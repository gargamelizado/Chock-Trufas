import img from "../../assets/img5.jpg";
import img2 from "../../assets/barra-chocolate-23031-1024x683.webp";
import img3 from "../../assets/Alfajor-Maria-01-1920x1442-1200x901.jpg";
import img4 from "../../assets/hq720.jpg";
import img5 from "../../assets/como-fazer-salgados-para-vender-min.jpg";
import img6 from "../../assets/empadao-de-frango-na-marmita.jpg";
import "./Produtos.css";



// Produtos apresenta os itens principais com foto, preço e link para adicionar no pedido.
export default function Produtos() {
  return (
  <section id="precos" className="produtosSection">
        <h2>Produtos e pacotes</h2>
        {/* Primeira linha de cards: doces individuais e barra. */}
        <div className="produtosCardGroup">
          <div className="produtoCard">
            <img src={img} alt="Cone trufado" />
            <div className="produtoCardContent">
              <h3>Cone trufado - R$10</h3>
              <p>Cone trufado com recheio de chocolate.</p>
              <a href="/compra">comprar</a>
            </div>
          </div>
          <div className="produtoCard">
            <img src={img2} alt="Barra de Chocolate" />
            <div className="produtoCardContent">
              <h3>Barra de Chocolate - R$12</h3>
              <p>Barra de chocolate ao leite com recheio cremoso.</p>
              <a href="/compra">comprar</a>
            </div>
          </div>
          <div className="produtoCard">
            <img src={img3} alt="Alfajor Maria" />
            <div className="produtoCardContent">
              <h3>Alfajor Maria - R$12</h3>
              <p>Alfajor com doce de leite e cobertura de chocolate.</p>
              <a href="/compra">comprar</a>
            </div>
          </div>
        </div>
        {/* Segunda linha de cards: salgado, pacote de festa e empadão. */}
        <div className="produtosCardGroup">
          <div className="produtoCard">
            <img src={img4} alt="Italianilho" />
            <div className="produtoCardContent">
              <h3>Italianilho - R$1.20</h3>
              <p>Italianilho com recheio de queijo e presunto.</p>
              <a href="/compra">comprar</a>
            </div>
          </div>
          <div className="produtoCard">
            <img src={img5} alt="Pacote Festa" />
            <div className="produtoCardContent">
              <h3>Pacote Festa - R$79.90</h3>
              <p>Combo com 100 salgadinhos, 40 docinhos, bolo e refrigerantes para escolher.</p>
              <a href="/compra">comprar</a>
            </div>
          </div>
          <div className="produtoCard">
            <img src={img6} alt="Empadao" />
            <div className="produtoCardContent">
              <h3>Empadao - R$10.00</h3>
              <p>Empadao de frango com massa crocante que derrete na boca.</p>
              <a href="/compra">comprar</a>
            </div>
          </div>
        </div>
      </section>
  );
}
