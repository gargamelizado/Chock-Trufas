import { useEffect, useState } from "react";
import "./CompraSite.css";

const nomesCategoriaCombo = {
  salgadinhos: ["salgadinho", "salgadinhos"],
  docinhos: ["docinho", "docinhos"],
  bolo: ["bolo", "bolos"],
  refrigerante: ["refrigerante", "refrigerantes"],
};

const formasPagamento = [
  "Pix",
  "Dinheiro",
  "Cartão de crédito",
  "Cartão de débito",
  "Ticket restaurante",
];
const enderecoEntregaInicial = {
  cep: "",
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  complemento: "",
  referencia: "",
};

// Página completa de compra: carrega o catálogo, monta o carrinho e envia o pedido para a API.
export default function CompraSite() {
  const [produtos, setProdutos] = useState([]);
  const [catalogoStatus, setCatalogoStatus] = useState({
    type: "loading",
    message: "Carregando catálogo...",
  });
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [recheios, setRecheios] = useState({});
  const [comboEscolhas, setComboEscolhas] = useState({});
  const [formaRecebimento, setFormaRecebimento] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState(enderecoEntregaInicial);
  const [statusCep, setStatusCep] = useState({
    type: "idle",
    message: "",
  });
  const [statusPedido, setStatusPedido] = useState({
    type: "idle",
    message: "",
    orderId: "",
  });

  // Carrega o catálogo real pela API; server/data/catalog.json é a fonte de verdade.
  useEffect(() => {
    async function carregarCatalogo() {
      try {
        const response = await fetch("/api/catalog");
        const data = await response.json();

        if (response.ok && Array.isArray(data.products)) {
          setProdutos(data.products);
          setCatalogoStatus({
            type: "success",
            message: "",
          });
          return;
        }

        throw new Error("A API não retornou o catálogo.");
      } catch {
        setProdutos([]);
        setCatalogoStatus({
          type: "error",
          message: "Não foi possível carregar o catálogo. Verifique a API.",
        });
      }
    }

    carregarCatalogo();
  }, []);

  function encontrarProduto(produtoId) {
    return produtos.find((produto) => produto.id === produtoId);
  }

  function criarItemCarrinhoId(produtoId) {
    const idSeguro = globalThis.crypto?.randomUUID?.();
    const idFallback = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return `${produtoId}-${idSeguro || idFallback}`;
  }

  function obterProdutosDoCarrinho() {
    return itensCarrinho
      .map((item) => {
        const produto = encontrarProduto(item.productId);

        return produto ? { ...produto, cartItemId: item.cartItemId } : null;
      })
      .filter(Boolean);
  }

  function contarProdutoNoCarrinho(produtoId) {
    return itensCarrinho.filter((item) => item.productId === produtoId).length;
  }

  function obterCategoriasCombo(produto) {
    return Object.keys(produto?.comboRules || {});
  }

  function produtoTemCombo(produto) {
    return obterCategoriasCombo(produto).length > 0;
  }

  function produtoTemRecheio(produto) {
    return Array.isArray(produto?.fillingOptions) && produto.fillingOptions.length > 0;
  }

  function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(valor || 0));
  }

  function obterPrecoProduto(produto) {
    const preco = Number(produto?.price);

    return Number.isFinite(preco) && preco > 0 ? preco : 0;
  }

  function produtoTemPreco(produto) {
    return obterPrecoProduto(produto) > 0;
  }

  function obterQuantidadeNumerica(produto) {
    if (produtoTemCombo(produto)) {
      return 1;
    }

    const quantidade = Number(
      String(quantidades[produto.cartItemId] || "").replace(",", ".")
    );

    return Number.isFinite(quantidade) && quantidade > 0 ? quantidade : 0;
  }

  function obterSubtotalProduto(produto) {
    return obterPrecoProduto(produto) * obterQuantidadeNumerica(produto);
  }

  function obterTotalCarrinho(produtosCarrinho = obterProdutosDoCarrinho()) {
    return produtosCarrinho.reduce(
      (total, produto) => total + obterSubtotalProduto(produto),
      0
    );
  }

  function carrinhoTemItemSemPreco(produtosCarrinho = obterProdutosDoCarrinho()) {
    return produtosCarrinho.some((produto) => !produtoTemPreco(produto));
  }

  function produtosComQuantidadeManual(produtosCarrinho = obterProdutosDoCarrinho()) {
    return produtosCarrinho.filter((produto) => !produtoTemCombo(produto));
  }

  function produtosComRecheio(produtosCarrinho = obterProdutosDoCarrinho()) {
    return produtosCarrinho.filter((produto) => produtoTemRecheio(produto));
  }

  function formatarTituloCategoria(categoria) {
    const nomes = nomesCategoriaCombo[categoria] || [categoria, categoria];
    return nomes[1].charAt(0).toUpperCase() + nomes[1].slice(1);
  }

  function formatarQuantidadeCategoria(categoria, quantidade) {
    const nomes = nomesCategoriaCombo[categoria] || [categoria, categoria];
    const nome = Number(quantidade) === 1 ? nomes[0] : nomes[1];

    return `${quantidade} ${nome}`;
  }

  function unirPartes(partes) {
    if (partes.length <= 1) {
      return partes.join("");
    }

    return `${partes.slice(0, -1).join(", ")} e ${partes.at(-1)}`;
  }

  function montarQuantidadeCombo(produto) {
    return unirPartes(
      obterCategoriasCombo(produto).map((categoria) =>
        formatarQuantidadeCategoria(categoria, obterRegraCombo(produto, categoria))
      )
    );
  }

  function montarDetalheProduto(produto) {
    const detalhes = [];

    if (produtoTemCombo(produto)) {
      detalhes.push(montarQuantidadeCombo(produto));
    }

    if (produtoTemRecheio(produto)) {
      detalhes.push(`${produto.fillingOptions.length} opções de recheio`);
    }

    return detalhes.length > 0 ? detalhes.join(" · ") : "Produto sob encomenda";
  }

  function formatarResumoItens(quantidade) {
    return quantidade === 1 ? "1 item no carrinho" : `${quantidade} itens no carrinho`;
  }

  function montarResumoComboEscolhido(selectedComboItems) {
    if (!selectedComboItems) {
      return "";
    }

    return Object.entries(selectedComboItems)
      .map(
        ([categoria, items]) =>
          `${formatarTituloCategoria(categoria)} escolhidos: ${formatarEscolhasCombo(items)}`
      )
      .join(". ");
  }

  function formatarEscolhasCombo(items = []) {
    if (items.length === 0) {
      return "nenhum";
    }

    return items.map((item) => `${item.name} ${item.quantity}`).join(", ");
  }

  function obterRegraCombo(produto, categoria) {
    return Number(produto?.comboRules?.[categoria] || 0);
  }

  function somarEscolhasCombo(cartItemId, categoria) {
    const escolhas = comboEscolhas[cartItemId]?.[categoria] || {};

    return Object.values(escolhas).reduce(
      (total, quantidade) => total + Number(quantidade || 0),
      0
    );
  }

  function obterStatusCategoria(produto, categoria) {
    const total = somarEscolhasCombo(produto.cartItemId, categoria);
    const limite = obterRegraCombo(produto, categoria);
    const restante = limite - total;

    if (restante > 0) {
      return {
        classe: "faltando",
        texto: `Faltam ${restante}`,
      };
    }

    if (restante < 0) {
      return {
        classe: "excedido",
        texto: `Passou ${Math.abs(restante)}`,
      };
    }

    return {
      classe: "completo",
      texto: "Completo",
    };
  }

  function obterMaximoItem(produto, categoria, item) {
    const atual = Number(comboEscolhas[produto.cartItemId]?.[categoria]?.[item] || 0);
    const total = somarEscolhasCombo(produto.cartItemId, categoria);
    const limite = obterRegraCombo(produto, categoria);

    return Math.max(0, limite - total + atual);
  }

  function montarEscolhasCombo(produto) {
    const escolhas = comboEscolhas[produto.cartItemId] || {};

    return obterCategoriasCombo(produto).reduce((resultado, categoria) => {
      resultado[categoria] = montarCategoriaCombo(escolhas[categoria]);
      return resultado;
    }, {});
  }

  function montarCategoriaCombo(escolhas = {}) {
    return Object.entries(escolhas)
      .map(([name, quantity]) => ({
        name,
        quantity: Number(quantity || 0),
      }))
      .filter((item) => item.quantity > 0);
  }

  function adicionarAoCarrinho(produtoId) {
    setItensCarrinho((itensAtuais) => [
      ...itensAtuais,
      {
        cartItemId: criarItemCarrinhoId(produtoId),
        productId: produtoId,
      },
    ]);
  }

  function removerDoCarrinho(cartItemId) {
    setItensCarrinho((itensAtuais) =>
      itensAtuais.filter((item) => item.cartItemId !== cartItemId)
    );
    setQuantidades((quantidadesAtuais) => {
      const novasQuantidades = { ...quantidadesAtuais };
      delete novasQuantidades[cartItemId];
      return novasQuantidades;
    });
    setRecheios((recheiosAtuais) => {
      const novosRecheios = { ...recheiosAtuais };
      delete novosRecheios[cartItemId];
      return novosRecheios;
    });
    setComboEscolhas((escolhasAtuais) => {
      const novasEscolhas = { ...escolhasAtuais };
      delete novasEscolhas[cartItemId];
      return novasEscolhas;
    });
  }

  function alterarQuantidade(cartItemId, quantidade) {
    setQuantidades((quantidadesAtuais) => ({
      ...quantidadesAtuais,
      [cartItemId]: quantidade,
    }));
  }

  function alterarRecheio(cartItemId, recheio) {
    setRecheios((recheiosAtuais) => ({
      ...recheiosAtuais,
      [cartItemId]: recheio,
    }));
  }

  function alterarEscolhaCombo(cartItemId, categoria, item, quantidade) {
    const quantidadeNumerica =
      quantidade === ""
        ? ""
        : Math.max(0, Math.floor(Number(String(quantidade).replace(",", ".")) || 0));

    setComboEscolhas((escolhasAtuais) => ({
      ...escolhasAtuais,
      [cartItemId]: {
        ...escolhasAtuais[cartItemId],
        [categoria]: {
          ...escolhasAtuais[cartItemId]?.[categoria],
          [item]: quantidadeNumerica,
        },
      },
    }));
  }

  function limparCep(cep) {
    return String(cep || "").replace(/\D/g, "").slice(0, 8);
  }

  function formatarCep(cep) {
    const cepLimpo = limparCep(cep);

    return cepLimpo.length > 5
      ? `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`
      : cepLimpo;
  }

  function alterarEnderecoEntrega(campo, valor) {
    const valorTratado = campo === "cep" ? formatarCep(valor) : valor;

    setEnderecoEntrega((enderecoAtual) => ({
      ...enderecoAtual,
      [campo]: valorTratado,
    }));

    if (campo === "cep" && limparCep(valorTratado).length < 8) {
      setStatusCep({
        type: "idle",
        message: "",
      });
    }
  }

  async function buscarEnderecoPeloCep() {
    const cepLimpo = limparCep(enderecoEntrega.cep);

    if (cepLimpo.length !== 8) {
      setStatusCep({
        type: "error",
        message: "Digite um CEP com 8 números.",
      });
      return;
    }

    setStatusCep({
      type: "loading",
      message: "Buscando CEP...",
    });

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

      if (!response.ok) {
        throw new Error("CEP inválido.");
      }

      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado.");
      }

      setEnderecoEntrega((enderecoAtual) => ({
        ...enderecoAtual,
        cep: data.cep || formatarCep(cepLimpo),
        rua: data.logradouro || enderecoAtual.rua,
        bairro: data.bairro || enderecoAtual.bairro,
        cidade: data.localidade || enderecoAtual.cidade,
        estado: data.uf || enderecoAtual.estado,
      }));
      setStatusCep({
        type: "success",
        message: "Endereço preenchido pelo CEP.",
      });
    } catch (error) {
      setStatusCep({
        type: "error",
        message: error.message || "Não foi possível buscar o CEP.",
      });
    }
  }

  function montarEnderecoEntrega() {
    const { cep, rua, numero, bairro, cidade, estado, complemento, referencia } =
      enderecoEntrega;
    const partesEndereco = [
      `${rua}, ${numero}`,
      bairro,
      `${cidade} - ${estado}`,
      `CEP ${cep}`,
      complemento ? `Complemento: ${complemento}` : "",
      referencia ? `Referência: ${referencia}` : "",
    ];

    return partesEndereco.filter(Boolean).join(" | ");
  }

  function validarCombosSelecionados() {
    const produtosCarrinho = obterProdutosDoCarrinho();

    for (const produto of produtosCarrinho) {
      if (!produtoTemCombo(produto)) {
        continue;
      }

      for (const categoria of obterCategoriasCombo(produto)) {
        const total = somarEscolhasCombo(produto.cartItemId, categoria);
        const regra = obterRegraCombo(produto, categoria);

        if (total !== regra) {
          alert(
            `${produto.name} precisa ter ${formatarQuantidadeCategoria(categoria, regra)} entre as opções escolhidas.`
          );
          return false;
        }
      }
    }

    return true;
  }

  function montarMensagem(order) {
    const itens = order.items
      .map((item) => {
        const comboResumo = item.selectedComboItems
          ? ` (${montarResumoComboEscolhido(item.selectedComboItems)})`
          : "";
        const recheioResumo = item.filling ? ` - Recheio: ${item.filling}` : "";
        const valorResumo = item.subtotal ? ` - ${formatarMoeda(item.subtotal)}` : "";

        return `${item.product}: ${item.quantity}${recheioResumo}${comboResumo}${valorResumo}`;
      })
      .join(", ");

    const mensagem = [
      "Olá, quero confirmar uma compra pelo site da Chock Trufas.",
      `Pedido: ${order.id}`,
      `Nome: ${order.customerName}`,
      `Telefone: ${order.phone}`,
      `Itens: ${itens}`,
      `Total: ${formatarMoeda(order.total)}`,
      `Entrega ou retirada: ${order.deliveryMethod}`,
    ];

    if (order.deliveryMethod === "Entrega") {
      mensagem.push(
        `Pagamento: ${order.paymentMethod}`,
        `Endereço: ${order.address}`
      );
    }

    if (order.deliveryMethod === "Retirada") {
      mensagem.push(
        `Dia da retirada: ${order.pickupDate}`,
        `Horário de retirada: ${order.pickupTime}`,
        `Pessoa que vai retirar: ${order.pickupPerson}`,
        `Documento: ${order.pickupDocument}`
      );
    }

    mensagem.push(
      `Data desejada: ${order.desiredDate || "A combinar"}`,
      `Observações: ${order.notes || "Sem observações"}`
    );

    return mensagem.join("\n");
  }

  async function enviarPedido(event) {
    event.preventDefault();

    const dados = new FormData(event.currentTarget);
    const produtosCarrinho = obterProdutosDoCarrinho();
    const itens = produtosCarrinho.map((produto) => ({
      productId: produto.id,
      product: produto.name,
      quantity: produtoTemCombo(produto)
        ? montarQuantidadeCombo(produto)
        : String(quantidades[produto.cartItemId] || "").trim(),
      quantityNumber: obterQuantidadeNumerica(produto),
      unitPrice: obterPrecoProduto(produto),
      subtotal: obterSubtotalProduto(produto),
      filling: produtoTemRecheio(produto)
        ? String(recheios[produto.cartItemId] || "")
        : "",
      selectedComboItems: produtoTemCombo(produto) ? montarEscolhasCombo(produto) : null,
    }));

    if (itens.length === 0) {
      alert("Adicione pelo menos um produto ao carrinho.");
      return;
    }

    if (carrinhoTemItemSemPreco(produtosCarrinho)) {
      alert(
        "Existe produto sem preço cadastrado no catálogo. Adicione o campo price no catalog.json antes de finalizar."
      );
      return;
    }

    if (
      produtosComQuantidadeManual(produtosCarrinho).some(
        (produto) => obterQuantidadeNumerica(produto) <= 0
      )
    ) {
      alert("Informe uma quantidade numérica maior que zero para todos os produtos.");
      return;
    }

    if (
      produtosComRecheio(produtosCarrinho).some(
        (produto) => !String(recheios[produto.cartItemId] || "").trim()
      )
    ) {
      alert("Escolha o recheio dos produtos selecionados.");
      return;
    }

    if (!validarCombosSelecionados()) {
      return;
    }

    const payload = {
      customerName: dados.get("nome"),
      phone: dados.get("telefone"),
      items: itens,
      desiredDate: dados.get("data"),
      deliveryMethod: dados.get("entrega"),
      paymentMethod: formaRecebimento === "Entrega" ? dados.get("pagamento") : "",
      address: formaRecebimento === "Entrega" ? montarEnderecoEntrega() : "",
      pickupDate: dados.get("diaRetirada"),
      pickupTime: dados.get("horarioRetirada"),
      pickupPerson: dados.get("pessoaRetirada"),
      pickupDocument: dados.get("documentoRetirada"),
      notes: dados.get("observacoes"),
    };

    setStatusPedido({
      type: "loading",
      message: "Enviando pedido...",
      orderId: "",
    });

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            "A API respondeu em um formato inválido. Verifique se o backend está rodando."
          );
        }
      }

      if (!response.ok) {
        if (!data.message && !data.errors && response.status >= 500) {
          throw new Error(
            "Servidor de pedidos indisponível. Inicie o site com npm run dev para subir o frontend e o backend juntos."
          );
        }

        throw new Error(
          data.errors?.join(" ") ||
            data.message ||
            "Não foi possível registrar o pedido."
        );
      }

      if (!data.order) {
        throw new Error("A API não retornou os dados do pedido.");
      }

      const mensagem = montarMensagem(data.order);

      setStatusPedido({
        type: "success",
        message: "Pedido registrado. Abrindo WhatsApp para confirmação.",
        orderId: data.order.id,
      });

      window.open(
        `https://wa.me/5521992470799?text=${encodeURIComponent(mensagem)}`,
        "_blank",
        "noopener,noreferrer"
      );

      event.currentTarget.reset();
      setItensCarrinho([]);
      setQuantidades({});
      setRecheios({});
      setComboEscolhas({});
      setFormaRecebimento("");
      setEnderecoEntrega(enderecoEntregaInicial);
      setStatusCep({
        type: "idle",
        message: "",
      });
    } catch (error) {
      setStatusPedido({
        type: "error",
        message: error.message || "Não foi possível registrar o pedido.",
        orderId: "",
      });
    }
  }

  const produtosDoCarrinho = obterProdutosDoCarrinho();
  const totalCarrinho = obterTotalCarrinho(produtosDoCarrinho);
  const temItemSemPreco = carrinhoTemItemSemPreco(produtosDoCarrinho);

  return (
    <main className="paginaCompra">
      <section className="compraHero">
        <a href="/" className="voltarSite">Voltar ao site</a>
        <span>Compra pelo site</span>
        <h1>Monte seu pedido</h1>
        <p>
          Adicione os produtos ao carrinho, escolha recheios e sabores, e envie
          o pedido direto para o atendimento da Chock Trufas.
        </p>
        <div className="compraEtapas" aria-label="Etapas da compra">
          <span>1. Produtos</span>
          <span>2. Sabores</span>
          <span>3. Entrega ou retirada</span>
        </div>
      </section>

      <section className="compraPedido">
        <form className="formPedido" onSubmit={enviarPedido}>
          {/* Catálogo visual: o cliente adiciona produtos ao carrinho sem depender de checkbox cru. */}
          <fieldset className="catalogoProdutos">
            <legend>Adicionar produtos</legend>
            <p className="catalogoIntro">
              Escolha quantos itens quiser. O mesmo produto pode entrar mais de
              uma vez com recheios ou sabores diferentes.
            </p>
            {catalogoStatus.message ? (
              <div className={`catalogoStatus ${catalogoStatus.type}`} role="status">
                {catalogoStatus.message}
              </div>
            ) : null}
            {produtos.length > 0 ? (
              <div className="catalogoGrid">
                {produtos.map((produto) => {
                  const quantidadeNoCarrinho = contarProdutoNoCarrinho(produto.id);
                  const estaNoCarrinho = quantidadeNoCarrinho > 0;

                  return (
                    <article
                      className={`catalogoCard ${estaNoCarrinho ? "selecionado" : ""}`}
                      key={produto.id}
                    >
                      <div>
                        <span>{produtoTemCombo(produto) ? "Personalizado" : "Produto"}</span>
                        <h3>{produto.name}</h3>
                        <p>{montarDetalheProduto(produto)}</p>
                        <strong className="catalogoPreco">
                          {produtoTemPreco(produto)
                            ? formatarMoeda(obterPrecoProduto(produto))
                            : "Valor a confirmar"}
                        </strong>
                        {estaNoCarrinho ? (
                          <p>{quantidadeNoCarrinho} no carrinho</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className={estaNoCarrinho ? "botaoNoCarrinho" : ""}
                        onClick={() => adicionarAoCarrinho(produto.id)}
                      >
                        {estaNoCarrinho ? "Adicionar mais" : "Adicionar"}
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : null}
          </fieldset>

          {/* Carrinho do pedido: concentra quantidades, recheios, combos e remoção de item. */}
          <section className="carrinhoPedido" aria-labelledby="titulo-carrinho">
            <div className="carrinhoTopo">
              <div>
                <span>Carrinho</span>
                <h2 id="titulo-carrinho">Itens do pedido</h2>
              </div>
              <strong>{produtosDoCarrinho.length}</strong>
            </div>

            {produtosDoCarrinho.length === 0 ? (
              <div className="carrinhoVazio">
                <strong>Nenhum item adicionado ainda.</strong>
                <p>Escolha produtos no catálogo acima para montar o pedido.</p>
              </div>
            ) : (
              <div className="carrinhoLista">
                {produtosDoCarrinho.map((produto, index) => (
                  <article className="carrinhoItem" key={produto.cartItemId}>
                    <header>
                      <div>
                        <span>
                          {produtoTemCombo(produto) ? "Combo" : "Item"} #{index + 1}
                        </span>
                        <h3>{produto.name}</h3>
                      </div>
                      <div className="carrinhoValores">
                        <span>
                          {produtoTemPreco(produto)
                            ? formatarMoeda(obterPrecoProduto(produto))
                            : "Valor a confirmar"}
                        </span>
                        <strong>
                          {produtoTemPreco(produto)
                            ? formatarMoeda(obterSubtotalProduto(produto))
                            : "Sem preço"}
                        </strong>
                      </div>
                      <button
                        type="button"
                        className="carrinhoRemover"
                        aria-label={`Remover ${produto.name} do carrinho`}
                        title="Remover item do carrinho"
                        onClick={() => removerDoCarrinho(produto.cartItemId)}
                      >
                        <span aria-hidden="true">×</span>
                        Remover item
                      </button>
                    </header>

                    {produtoTemRecheio(produto) ? (
                      <div className="campoLinha">
                        <label htmlFor={`recheio-${produto.cartItemId}`}>
                          Recheio
                        </label>
                        <select
                          id={`recheio-${produto.cartItemId}`}
                          value={recheios[produto.cartItemId] || ""}
                          onChange={(event) =>
                            alterarRecheio(produto.cartItemId, event.target.value)
                          }
                          required
                        >
                          <option value="">Escolha o recheio</option>
                          {produto.fillingOptions.map((recheio) => (
                            <option value={recheio} key={recheio}>
                              {recheio}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : null}

                    {!produtoTemCombo(produto) ? (
                      <div className="campoLinha">
                        <label htmlFor={`quantidade-${produto.cartItemId}`}>
                          Quantidade
                        </label>
                        <input
                          id={`quantidade-${produto.cartItemId}`}
                          type="number"
                          min="1"
                          step="1"
                          value={quantidades[produto.cartItemId] || ""}
                          onChange={(event) =>
                            alterarQuantidade(produto.cartItemId, event.target.value)
                          }
                          placeholder="Ex: 10"
                          required
                        />
                      </div>
                    ) : null}

                    {produtoTemCombo(produto) ? (
                      <div className="comboPersonalizacao">
                        <p>
                          O total precisa fechar em{" "}
                          <strong>{montarQuantidadeCombo(produto)}</strong>.
                        </p>

                        <div className="comboCategorias">
                          {obterCategoriasCombo(produto).map((categoria) => (
                            <div className="comboCategoria" key={categoria}>
                              <h3>
                                {formatarTituloCategoria(categoria)}
                                <span>
                                  {somarEscolhasCombo(produto.cartItemId, categoria)} /{" "}
                                  {obterRegraCombo(produto, categoria)}
                                </span>
                              </h3>
                              <small
                                className={`comboStatus ${
                                  obterStatusCategoria(produto, categoria).classe
                                }`}
                              >
                                {obterStatusCategoria(produto, categoria).texto}
                              </small>

                              {produto.comboItems?.[categoria]?.map((item) => (
                                <label className="comboItem" key={item}>
                                  <span>{item}</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    max={obterMaximoItem(produto, categoria, item)}
                                    value={
                                      comboEscolhas[produto.cartItemId]?.[categoria]?.[
                                        item
                                      ] || ""
                                    }
                                    onChange={(event) =>
                                      alterarEscolhaCombo(
                                        produto.cartItemId,
                                        categoria,
                                        item,
                                        event.target.value
                                      )
                                    }
                                  />
                                </label>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Data e forma de recebimento definem quais campos extras serão obrigatórios. */}
          <div className="dadosClientePedido">
            <div className="campoLinha">
              <label htmlFor="nome">Nome</label>
              <input id="nome" name="nome" type="text" required />
            </div>

            <div className="campoLinha">
              <label htmlFor="telefone">Telefone</label>
              <input id="telefone" name="telefone" type="tel" required />
            </div>
          </div>
          <fieldset className="grupoEntrega">
            <legend>Forma de recebimento</legend>
            <label>
              <input
                type="radio"
                name="entrega"
                value="Retirada"
                required
                onChange={(event) => setFormaRecebimento(event.target.value)}
              />
              <span>Retirada</span>
            </label>
            <label>
              <input
                type="radio"
                name="entrega"
                value="Entrega"
                onChange={(event) => setFormaRecebimento(event.target.value)}
              />
              <span>Entrega</span>
            </label>
          </fieldset>

          {formaRecebimento === "Entrega" ? (
            <>
              <fieldset className="grupoPagamento">
                <legend>Forma de pagamento na entrega</legend>
                {formasPagamento.map((forma) => (
                  <label key={forma}>
                    <input type="radio" name="pagamento" value={forma} required />
                    <span>{forma}</span>
                  </label>
                ))}
              </fieldset>

              <div className="enderecoEntrega">
                <div className="cepLinha">
                  <div className="campoLinha">
                    <label htmlFor="cepEntrega">CEP</label>
                    <input
                      id="cepEntrega"
                      name="cepEntrega"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength="9"
                      value={enderecoEntrega.cep}
                      onBlur={buscarEnderecoPeloCep}
                      onChange={(event) =>
                        alterarEnderecoEntrega("cep", event.target.value)
                      }
                      placeholder="00000-000"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    className="botaoBuscarCep"
                    onClick={buscarEnderecoPeloCep}
                    disabled={statusCep.type === "loading"}
                  >
                    {statusCep.type === "loading" ? "Buscando..." : "Buscar CEP"}
                  </button>
                </div>

                {statusCep.message ? (
                  <small className={`cepStatus ${statusCep.type}`}>
                    {statusCep.message}
                  </small>
                ) : null}

                <div className="enderecoGrid">
                  <div className="campoLinha campoRua">
                    <label htmlFor="ruaEntrega">Rua</label>
                    <input
                      id="ruaEntrega"
                      name="ruaEntrega"
                      type="text"
                      value={enderecoEntrega.rua}
                      onChange={(event) =>
                        alterarEnderecoEntrega("rua", event.target.value)
                      }
                      placeholder="Rua"
                      required
                    />
                  </div>

                  <div className="campoLinha">
                    <label htmlFor="numeroEntrega">Número</label>
                    <input
                      id="numeroEntrega"
                      name="numeroEntrega"
                      type="text"
                      value={enderecoEntrega.numero}
                      onChange={(event) =>
                        alterarEnderecoEntrega("numero", event.target.value)
                      }
                      placeholder="123"
                      required
                    />
                  </div>

                  <div className="campoLinha">
                    <label htmlFor="bairroEntrega">Bairro</label>
                    <input
                      id="bairroEntrega"
                      name="bairroEntrega"
                      type="text"
                      value={enderecoEntrega.bairro}
                      onChange={(event) =>
                        alterarEnderecoEntrega("bairro", event.target.value)
                      }
                      placeholder="Bairro"
                      required
                    />
                  </div>

                  <div className="campoLinha">
                    <label htmlFor="cidadeEntrega">Cidade</label>
                    <input
                      id="cidadeEntrega"
                      name="cidadeEntrega"
                      type="text"
                      value={enderecoEntrega.cidade}
                      onChange={(event) =>
                        alterarEnderecoEntrega("cidade", event.target.value)
                      }
                      placeholder="Cidade"
                      required
                    />
                  </div>

                  <div className="campoLinha">
                    <label htmlFor="estadoEntrega">UF</label>
                    <input
                      id="estadoEntrega"
                      name="estadoEntrega"
                      type="text"
                      maxLength="2"
                      value={enderecoEntrega.estado}
                      onChange={(event) =>
                        alterarEnderecoEntrega(
                          "estado",
                          event.target.value.toUpperCase()
                        )
                      }
                      placeholder="RJ"
                      required
                    />
                  </div>

                  <div className="campoLinha">
                    <label htmlFor="complementoEntrega">Complemento</label>
                    <input
                      id="complementoEntrega"
                      name="complementoEntrega"
                      type="text"
                      value={enderecoEntrega.complemento}
                      onChange={(event) =>
                        alterarEnderecoEntrega("complemento", event.target.value)
                      }
                      placeholder="Apto, casa, bloco..."
                    />
                  </div>

                  <div className="campoLinha campoReferencia">
                    <label htmlFor="referenciaEntrega">Ponto de referência</label>
                    <input
                      id="referenciaEntrega"
                      name="referenciaEntrega"
                      type="text"
                      value={enderecoEntrega.referencia}
                      onChange={(event) =>
                        alterarEnderecoEntrega("referencia", event.target.value)
                      }
                      placeholder="Próximo de..."
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {formaRecebimento === "Retirada" ? (
            <div className="retiradaCampos">
              <div className="campoLinha">
                <label htmlFor="diaRetirada">Dia da retirada</label>
                <input
                  id="diaRetirada"
                  name="diaRetirada"
                  type="date"
                  required
                />
              </div>

              <div className="campoLinha">
                <label htmlFor="horarioRetirada">Horário de retirada</label>
                <input
                  id="horarioRetirada"
                  name="horarioRetirada"
                  type="time"
                  required
                />
              </div>

              <div className="campoLinha">
                <label htmlFor="pessoaRetirada">Pessoa que vai retirar</label>
                <input
                  id="pessoaRetirada"
                  name="pessoaRetirada"
                  type="text"
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="campoLinha">
                <label htmlFor="documentoRetirada">Documento</label>
                <input
                  id="documentoRetirada"
                  name="documentoRetirada"
                  type="text"
                  placeholder="CPF, RG ou outro documento"
                  required
                />
              </div>
            </div>
          ) : null}

          <div className="campoLinha">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              name="observacoes"
              rows="5"
              placeholder="Sabores, endereço, horário, detalhes da festa..."
            ></textarea>
          </div>

          {statusPedido.message ? (
            <div className={`pedidoStatus ${statusPedido.type}`}>
              <strong>{statusPedido.message}</strong>
              {statusPedido.orderId ? <span>Pedido: {statusPedido.orderId}</span> : null}
            </div>
          ) : null}

          <button
            type="submit"
            className="botaoEnviarPedido"
            disabled={statusPedido.type === "loading"}
          >
            {statusPedido.type === "loading" ? "Enviando..." : "Finalizar pedido"}
          </button>
        </form>

        {/* Resumo fixo ajuda o cliente a entender o estado do carrinho enquanto preenche o pedido. */}
        <aside className="pedidoAjuda">
          <span>Resumo</span>
          <h2>{formatarMoeda(totalCarrinho)}</h2>
          <strong>{formatarResumoItens(produtosDoCarrinho.length)}</strong>
          <p>
            Total estimado pelo catálogo. Prazo, disponibilidade e detalhes
            personalizados continuam sendo confirmados no atendimento.
          </p>
          {temItemSemPreco ? (
            <small>Existe item sem preço cadastrado no catálogo.</small>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
