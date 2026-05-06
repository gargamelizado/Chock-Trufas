import Logo from "../../assets/LOGO.png"
import "./estilo.css";

// Hero é a primeira dobra do site e leva o cliente diretamente para a compra.
export default function Hero() {
 return (
<section className="hero">
        <div className="heroConteudo">
          {/* Logo grande reforça a marca antes da chamada de compra. */}
          <img className="heroLogo" src={Logo} alt="Logo da Chock Trufas" />
          <span className="heroEyebrow">Encomendas artesanais em Niterói e São Gonçalo</span>
          <h1>Chock Trufas</h1>
          <p>
            Doces, salgados e combos para festas feitos sob encomenda, com
            escolha de sabores e atendimento direto pelo WhatsApp.
          </p>
          <div className="heroAcoes">
            <a className="btnAgendar" href="/compra">Comprar pelo site</a>
            <a className="btnSecundario" href="/#precos">Ver produtos</a>
          </div>
          <div className="heroDestaques" aria-label="Diferenciais da Chock Trufas">
            <span>Produção artesanal</span>
            <span>Pedidos personalizados</span>
            <span>Entrega ou retirada</span>
          </div>
        </div>
      </section>
  )
}
