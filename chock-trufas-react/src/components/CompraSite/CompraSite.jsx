import { useEffect, useState } from "react";
import catalogoBase from "../../../server/data/catalog.json";
import "./CompraSite.css";

const nomesCategoriaCombo = {
  salgadinhos: ["salgadinho", "salgadinhos"],
  docinhos: ["docinho", "docinhos"],
  bolo: ["bolo", "bolos"],
  refrigerante: ["refrigerante", "refrigerantes"],
};

const produtosBase = Array.isArray(catalogoBase.products) ? catalogoBase.products : [];

// Página completa de compra: carrega o catálogo, monta o carrinho e envia o pedido para a API.
export default function CompraSite() {
  const [produtos, setProdutos] = useState(produtosBase);
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [recheios, setRecheios] = useState({});
  const [comboEscolhas, setComboEscolhas] = useState({});
  const [formaRecebimento, setFormaRecebimento] = useState("");
  const [statusPedido, setStatusPedido] = useState({
    type: "idle",
    message: "",
    orderId: "",
  });

  // Sincroniza os produtos da tela com o catálogo do backend; se a API cair, mantém o catalog.json importado.
  useEffect(() => {
    async function carregarCatalogo() {
      try {
        const response = await fetch("/api/catalog");
        const data = await response.json();

        if (response.ok && Array.isArray(data.products)) {
          setProdutos(data.products);
        }
      } catch {
        setProdutos(produtosBase);
      }
    }

    carregarCatalogo();
  }, []);

  function encontrarProduto(produtoId) {
    return produtos.find((produto) => produto.id === produtoId);
  }

  function criarItemCarrinhoId(produtoId) {
    return `${produtoId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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

  function produtosComQuantidadeManual() {
    return obterProdutosDoCarrinho().filter((produto) => !produtoTemCombo(produto));
  }

  function produtosComRecheio() {
    return obterProdutosDoCarrinho().filter((produto) => produtoTemRecheio(produto));
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

    return detalhes.length > 0 ? detalhes.join(" · ") : "Quantidade livre";
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
    setComboEscolhas((escolhasAtuais) => ({
      ...escolhasAtuais,
      [cartItemId]: {
        ...escolhasAtuais[cartItemId],
        [categoria]: {
          ...escolhasAtuais[cartItemId]?.[categoria],
          [item]: quantidade,
        },
      },
    }));
  }

  function validarCombosSelecionados() {
    for (const produto of obterProdutosDoCarrinho()) {
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

        return `${item.product}: ${item.quantity}${recheioResumo}${comboResumo}`;
      })
      .join(", ");

    const mensagem = [
      "Olá, quero confirmar uma compra pelo site da Chock Trufas.",
      `Pedido: ${order.id}`,
      `Nome: ${order.customerName}`,
      `Telefone: ${order.phone}`,
      `Itens: ${itens}`,
      `Entrega ou retirada: ${order.deliveryMethod}`,
    ];

    if (order.deliveryMethod === "Entrega") {
      mensagem.push(`Endereço: ${order.address}`);
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
    const itens = obterProdutosDoCarrinho().map((produto) => ({
      productId: produto.id,
      product: produto.name,
      quantity: produtoTemCombo(produto)
        ? montarQuantidadeCombo(produto)
        : String(quantidades[produto.cartItemId] || "").trim(),
      filling: produtoTemRecheio(produto)
        ? String(recheios[produto.cartItemId] || "")
        : "",
      selectedComboItems: produtoTemCombo(produto) ? montarEscolhasCombo(produto) : null,
    }));

    if (itens.length === 0) {
      alert("Adicione pelo menos um produto ao carrinho.");
      return;
    }

    if (
      produtosComQuantidadeManual().some(
        (produto) => !String(quantidades[produto.cartItemId] || "").trim()
      )
    ) {
      alert("Informe a quantidade dos produtos no carrinho.");
      return;
    }

    if (
      produtosComRecheio().some(
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
      address: dados.get("endereco"),
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
    } catch (error) {
      setStatusPedido({
        type: "error",
        message: error.message || "Não foi possível registrar o pedido.",
        orderId: "",
      });
    }
  }

  const produtosDoCarrinho = obterProdutosDoCarrinho();

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
      </section>

      <section className="compraPedido">
        <form className="formPedido" onSubmit={enviarPedido}>
          {/* Dados básicos do cliente que acompanham todo pedido enviado ao backend. */}
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

          {/* Catálogo visual: o cliente adiciona produtos ao carrinho sem depender de checkbox cru. */}
          <fieldset className="catalogoProdutos">
            <legend>Adicionar produtos</legend>
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
                      {estaNoCarrinho ? (
                        <em>{quantidadeNoCarrinho} no carrinho</em>
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
                      <button
                        type="button"
                        className="carrinhoRemover"
                        onClick={() => removerDoCarrinho(produto.cartItemId)}
                      >
                        Remover
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
                          type="text"
                          value={quantidades[produto.cartItemId] || ""}
                          onChange={(event) =>
                            alterarQuantidade(produto.cartItemId, event.target.value)
                          }
                          placeholder="Ex: 10 unidades, 1 cento"
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
          <div className="pedidoGrid">
            <div className="campoLinha">
              <label htmlFor="data">Data desejada</label>
              <input id="data" name="data" type="date" />
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
            <div className="campoLinha">
              <label htmlFor="endereco">Endereço para entrega</label>
              <input
                id="endereco"
                name="endereco"
                type="text"
                placeholder="Rua, número, bairro e ponto de referência"
                required
              />
            </div>
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
          <h2>{produtosDoCarrinho.length} item(ns) no carrinho</h2>
          <p>
            O valor final, prazo e disponibilidade são confirmados no
            atendimento. Assim a loja consegue ajustar sabores, tamanhos e
            detalhes personalizados.
          </p>
        </aside>
      </section>
    </main>
  );
}
