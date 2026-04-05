import img from "../../assets/img5.jpg";
import img2 from "../../assets/barra-chocolate-23031-1024x683.webp";
import img3 from "../../assets/Alfajor-Maria-01-1920x1442-1200x901.jpg";
import img4 from "../../assets/hq720.jpg";
import img5 from "../../assets/como-fazer-salgados-para-vender-min.jpg";
import img6 from "../../assets/empadao-de-frango-na-marmita.jpg";



export default function Produtos() {
  return (
  <section id="precos" class="section">
        <h2>Pacotes de Agendamento</h2>
        <div class="cardGroup">
          <div class="card">
            <img src={img} alt="Cone trufado" />
            <div class="cardContent">
              <h3>Cone trufado - R$10</h3>
              <p>Cone trufado com recheio de chocolate.</p>
              <a href="#agendamento">comprar</a>
            </div>
          </div>
          <div class="card">
            <img src={img2} alt="Pacote Festa" />
            <div class="cardContent">
              <h3>Barra de Chocolate - R$12</h3>
              <p>Barra de chocolate ao leite com recheio cremoso.</p>
              <a href="#agendamento">comprar</a>
            </div>
          </div>
          <div class="card">
            <img src={img3} alt="Premium Especial" />
            <div class="cardContent">
              <h3>Alfajor Maria - R$12</h3>
              <p>Alfajor com doce de leite e cobertura de chocolate.</p>
              <a href="#agendamento">comprar</a>
            </div>
          </div>
        </div>
        <div class="cardGroup">
          <div class="card">
            <img src={img4} alt="Italianilho" />
            <div class="cardContent">
              <h3>Italianilho - R$1.20</h3>
              <p>Italianilho com recheio de queijo e presunto.</p>
              <a href="#agendamento">comprar</a>
            </div>
          </div>
          <div class="card">
            <img src={img5} alt="Pacote Festa" />
            <div class="cardContent">
              <h3>Pacote Festa - R$79.90</h3>
              <p>Combo com variedade de opções de salgadinhos para festas.</p>
              <a href="#agendamento">comprar</a>
            </div>
          </div>
          <div class="card">
            <img src={img6} alt="Premium Especial" />
            <div class="cardContent">
              <h3>empadao - R$10.00</h3>
              <p>empadao de frango com massa crocante que derrete na boca.</p>
              <a href="#agendamento">comprar</a>
            </div>
          </div>
        </div>
      </section>
  );
}