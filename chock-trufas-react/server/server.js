import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(__dirname, "data");
const ordersFile = path.join(dataDir, "orders.json");
const catalogFile = path.join(dataDir, "catalog.json");
const distDir = path.join(rootDir, "dist");
const app = express();
const port = Number(process.env.PORT) || 3001;
const comboCategoryNames = {
  salgadinhos: ["salgadinho", "salgadinhos"],
  docinhos: ["docinho", "docinhos"],
  bolo: ["bolo", "bolos"],
  refrigerante: ["refrigerante", "refrigerantes"],
};

app.use(express.json({ limit: "100kb" }));

async function ensureOrdersFile() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(ordersFile);
  } catch {
    await fs.writeFile(ordersFile, "[]\n");
  }
}

async function readOrders() {
  await ensureOrdersFile();
  const content = await fs.readFile(ordersFile, "utf8");

  if (!content.trim()) {
    await saveOrders([]);
    return [];
  }

  try {
    const orders = JSON.parse(content);
    if (!Array.isArray(orders)) {
      throw new Error("O arquivo de pedidos precisa conter uma lista.");
    }

    return orders;
  } catch (error) {
    throw new Error(`Arquivo de pedidos invalido: ${error.message}`);
  }
}

async function saveOrders(orders) {
  await ensureOrdersFile();
  await fs.writeFile(ordersFile, `${JSON.stringify(orders, null, 2)}\n`);
}

async function readCatalog() {
  const content = await fs.readFile(catalogFile, "utf8");
  const catalog = JSON.parse(content);
  return Array.isArray(catalog.products) ? catalog.products : [];
}

function asyncHandler(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

function cleanText(value) {
  return String(value || "").trim();
}

function findCatalogProduct(products, item) {
  const productId = cleanText(item?.productId);
  const productName = cleanText(item?.product);

  return products.find(
    (product) => product.id === productId || product.name === productName
  );
}

function getComboSummary(product) {
  const comboItems = product?.comboItems;
  const comboRules = getComboRules(product);

  if (!comboItems || !comboRules) {
    return null;
  }

  return Object.keys(comboRules).reduce((result, category) => {
    result[category] = Array.isArray(comboItems?.[category])
      ? comboItems[category]
      : [];
    return result;
  }, {});
}

function getComboRules(product) {
  if (!product?.comboRules || typeof product.comboRules !== "object") {
    return null;
  }

  const rules = Object.entries(product.comboRules).reduce(
    (result, [category, quantity]) => {
      const numberQuantity = Number(quantity || 0);

      if (Number.isFinite(numberQuantity) && numberQuantity > 0) {
        result[category] = numberQuantity;
      }

      return result;
    },
    {}
  );

  return Object.keys(rules).length > 0 ? rules : null;
}

function getFillingOptions(product) {
  return Array.isArray(product?.fillingOptions) ? product.fillingOptions : [];
}

function sanitizeFilling(filling, catalogProduct) {
  const value = cleanText(filling);
  const fillingOptions = getFillingOptions(catalogProduct);

  if (!value || fillingOptions.length === 0) {
    return "";
  }

  return fillingOptions.includes(value) ? value : "";
}

function sanitizeComboChoices(selectedComboItems, catalogProduct) {
  const allowedItems = getComboSummary(catalogProduct);
  const comboRules = getComboRules(catalogProduct);

  if (!allowedItems || !comboRules) {
    return null;
  }

  return Object.keys(comboRules).reduce((result, category) => {
    result[category] = sanitizeComboCategory(
      selectedComboItems?.[category],
      allowedItems[category] || []
    );
    return result;
  }, {});
}

function sanitizeComboCategory(selectedItems, allowedItems) {
  if (!Array.isArray(selectedItems)) {
    return [];
  }

  return selectedItems
    .map((item) => ({
      name: cleanText(item?.name),
      quantity: Number(item?.quantity || 0),
    }))
    .filter(
      (item) =>
        item.name &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0 &&
        allowedItems.includes(item.name)
    );
}

function sumComboCategory(items) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function formatComboCategory(category, quantity) {
  const names = comboCategoryNames[category] || [category, category];
  const name = Number(quantity) === 1 ? names[0] : names[1];

  return `${quantity} ${name}`;
}

function validateComboChoices(items, errors) {
  items
    .filter((item) => item.comboRules)
    .forEach((item) => {
      Object.entries(item.comboRules).forEach(([category, requiredQuantity]) => {
        const total = sumComboCategory(item.selectedComboItems?.[category] || []);

        if (total !== requiredQuantity) {
          errors.push(
            `${item.product} precisa ter ${formatComboCategory(category, requiredQuantity)} entre as opções escolhidas.`
          );
        }
      });
    });
}

function getComboQuantity(catalogProduct) {
  const rules = getComboRules(catalogProduct);

  if (!rules) {
    return "";
  }

  const quantities = Object.entries(rules).map(([category, quantity]) =>
    formatComboCategory(category, quantity)
  );

  if (quantities.length <= 1) {
    return quantities.join("");
  }

  return `${quantities.slice(0, -1).join(", ")} e ${quantities.at(-1)}`;
}

function formatOrderItemSummary(item) {
  const filling = item.filling ? ` - Recheio: ${item.filling}` : "";
  return `${item.product}: ${item.quantity}${filling}`;
}

function validateOrder(body, catalogProducts) {
  const errors = [];
  const items = Array.isArray(body.items)
    ? body.items
        .map((item) => {
          const catalogProduct = findCatalogProduct(catalogProducts, item);
          const comboItems = getComboSummary(catalogProduct);
          const comboRules = getComboRules(catalogProduct);
          const fillingOptions = getFillingOptions(catalogProduct);
          const hasCombo = Boolean(comboRules);

          return {
            productId: cleanText(item?.productId || catalogProduct?.id),
            product: cleanText(catalogProduct?.name || item?.product),
            quantity:
              hasCombo
                ? getComboQuantity(catalogProduct)
                : cleanText(item?.quantity),
            type: cleanText(hasCombo ? "combo" : catalogProduct?.type || "produto"),
            fillingOptions,
            filling: sanitizeFilling(item?.filling, catalogProduct),
            comboItems,
            comboRules,
            selectedComboItems: sanitizeComboChoices(
              item?.selectedComboItems,
              catalogProduct
            ),
          };
        })
        .filter((item) => item.product)
    : [];
  const orderItems = items.map(({ fillingOptions: _fillingOptions, ...item }) => item);

  const order = {
    customerName: cleanText(body.customerName),
    phone: cleanText(body.phone),
    items: orderItems,
    products: orderItems.map((item) => item.product),
    quantity: orderItems.map(formatOrderItemSummary).join(", "),
    desiredDate: cleanText(body.desiredDate),
    deliveryMethod: cleanText(body.deliveryMethod),
    address: cleanText(body.address),
    pickupDate: cleanText(body.pickupDate),
    pickupTime: cleanText(body.pickupTime),
    pickupPerson: cleanText(body.pickupPerson),
    pickupDocument: cleanText(body.pickupDocument),
    notes: cleanText(body.notes),
  };

  if (order.customerName.length < 2) {
    errors.push("Informe o nome do cliente.");
  }

  if (order.phone.length < 8) {
    errors.push("Informe um telefone válido.");
  }

  if (order.items.length === 0) {
    errors.push("Escolha pelo menos um produto.");
  }

  if (order.items.some((item) => !item.comboRules && !item.quantity)) {
    errors.push("Informe a quantidade de todos os produtos.");
  }

  if (
    items.some(
      (item) =>
        item.type !== "combo" &&
        item.fillingOptions.length > 0 &&
        !item.filling
    )
  ) {
    errors.push("Escolha o recheio dos produtos selecionados.");
  }

  validateComboChoices(order.items, errors);

  if (!["Retirada", "Entrega"].includes(order.deliveryMethod)) {
    errors.push("Escolha retirada ou entrega.");
  }

  if (order.deliveryMethod === "Entrega" && order.address.length < 5) {
    errors.push("Informe o endereço para entrega.");
  }

  if (order.deliveryMethod === "Retirada") {
    if (!order.pickupDate) {
      errors.push("Informe o dia da retirada.");
    }

    if (!order.pickupTime) {
      errors.push("Informe o horário de retirada.");
    }

    if (order.pickupPerson.length < 2) {
      errors.push("Informe a pessoa que vai retirar.");
    }

    if (order.pickupDocument.length < 3) {
      errors.push("Informe o documento de quem vai retirar.");
    }
  }

  return { order, errors };
}

app.get("/api/health", (request, response) => {
  response.json({ ok: true, service: "chock-trufas-api" });
});

app.get("/api/orders", asyncHandler(async (request, response) => {
  const orders = await readOrders();
  response.json({ orders });
}));

app.get("/api/catalog", asyncHandler(async (request, response) => {
  const products = await readCatalog();
  response.json({ products });
}));

app.post("/api/orders", asyncHandler(async (request, response) => {
  const catalogProducts = await readCatalog();
  const { order, errors } = validateOrder(request.body, catalogProducts);

  if (errors.length > 0) {
    return response.status(400).json({ message: "Pedido inválido.", errors });
  }

  const orders = await readOrders();
  const createdOrder = {
    id: crypto.randomUUID(),
    status: "novo",
    createdAt: new Date().toISOString(),
    ...order,
  };

  orders.unshift(createdOrder);
  await saveOrders(orders);

  return response.status(201).json({ order: createdOrder });
}));

app.use(express.static(distDir));

app.get("*", async (request, response, next) => {
  try {
    await fs.access(path.join(distDir, "index.html"));
    response.sendFile(path.join(distDir, "index.html"));
  } catch {
    next();
  }
});

app.use((error, request, response, _next) => {
  console.error(error);

  if (error.type === "entity.parse.failed") {
    return response.status(400).json({ message: "JSON inválido no pedido." });
  }

  response.status(500).json({ message: "Erro interno no servidor." });
});

const server = app.listen(port, () => {
  console.log(`Chock Trufas API running at http://127.0.0.1:${port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `A porta ${port} ja esta em uso. A API provavelmente ja esta aberta. Feche o terminal antigo ou use npm run dev para reaproveitar a API ativa.`
    );
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});
