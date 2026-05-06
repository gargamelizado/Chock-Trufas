import Logo from "../../assets/LOGO.png"
import "./estilo.css";

// Hero é a primeira dobra do site e leva o cliente diretamente para a compra.
export default function Hero() {
 return (
<section className="hero">
        {/* Logo grande reforça a marca antes da chamada de compra. */}
        <h1><img src={Logo} alt="Chock Trufas logo, a brand identity for an artisanal chocolate truffle shop" /></h1>
        <p>Doces e salgados artesanais para encomendas, festas e momentos especiais.</p>
        <a className="btnAgendar" href="/compra">Comprar pelo site</a>
      </section>
  )
}
