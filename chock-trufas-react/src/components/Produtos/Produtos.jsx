import img from "../../assets/img5.jpg";
import img2 from "../../assets/barra-chocolate-23031-1024x683.webp";
import img3 from "../../assets/Alfajor-Maria-01-1920x1442-1200x901.jpg";
import img4 from "../../assets/hq720.jpg";
import img5 from "../../assets/como-fazer-salgados-para-vender-min.jpg";
import img6 from "../../assets/empadao-de-frango-na-marmita.jpg";
import catalogoBase from "../../data/catalog.json";
import "./Produtos.css";

const produtosCatalogo = Array.isArray(catalogoBase.products) ? catalogoBase.products : [];

function formatarPrecoProduto(produtoId) {
  const produto = produtosCatalogo.find((item) => item.id === produtoId);
  const preco = Number(produto?.price);

  if (!Number.isFinite(preco) || preco <= 0) {
    return "Valor a confirmar";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
}

const produtosVitrine = [
  {
    id: "cone-trufado",
    nome: "Cone trufado",
    preco: formatarPrecoProduto("cone-trufado"),
    descricao: "Cone crocante com recheios cremosos para escolher.",
    imagem: img,
    etiqueta: "Recheado",
  },
  {
    id: "barra-chocolate",
    nome: "Barra de Chocolate",
    preco: formatarPrecoProduto("barra-chocolate"),
    descricao: "Barra artesanal ao leite com recheio generoso.",
    imagem: img2,
    etiqueta: "Mais pedido",
  },
  {
    id: "alfajor-maria",
    nome: "Alfajor Maria",
    preco: formatarPrecoProduto("alfajor-maria"),
    descricao: "Alfajor com doce de leite e cobertura de chocolate.",
    imagem: img3,
    etiqueta: "Artesanal",
  },
  {
    id: "italianilho",
    nome: "Italianilho",
    preco: formatarPrecoProduto("italianilho"),
    descricao: "Salgadinho individual com opções doces e salgadas.",
    imagem: img4,
    etiqueta: "Unidade",
  },
  {
    id: "pacote-festa",
    nome: "Pacote Festa",
    preco: formatarPrecoProduto("pacote-festa"),
    descricao: "Combo com salgadinhos, docinhos, bolo e refrigerantes.",
    imagem: img5,
    etiqueta: "Festas",
  },
  {
    id: "empadao",
    nome: "Empadão",
    preco: formatarPrecoProduto("empadao"),
    descricao: "Empadão com massa crocante e recheios selecionados.",
    imagem: img6,
    etiqueta: "Sob encomenda",
  },
];

// Produtos apresenta os itens principais com foto, preço e link para adicionar no pedido.
export default function Produtos() {
  return (
  <section id="precos" className="produtosSection">
        <div className="produtosCabecalho">
          <span>Catálogo</span>
          <h2>Produtos e pacotes para encomenda</h2>
          <p>
            Escolha os itens no site e finalize pelo atendimento para confirmar
            disponibilidade, prazo e detalhes do pedido.
          </p>
        </div>

        <div className="produtosCardGroup">
          {produtosVitrine.map((produto) => (
            <article className="produtoCard" key={produto.nome}>
              <div className="produtoImagem">
                <img src={produto.imagem} alt={produto.nome} />
                <span>{produto.etiqueta}</span>
              </div>
              <div className="produtoCardContent">
                <div>
                  <h3>{produto.nome}</h3>
                  <strong>{produto.preco}</strong>
                </div>
                <p>{produto.descricao}</p>
                <a href="/compra">Adicionar ao pedido</a>
              </div>
            </article>
          ))}
        </div>
      </section>
  );
}
