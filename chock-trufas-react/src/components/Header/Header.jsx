import { useState } from "react";
import Logo from "../../assets/LOGO.png";
import "./estilo.css";

// Header mostra logo, links principais e menu mobile com estado aberto/fechado.
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      {/* Identidade visual da loja sempre visível no topo. */}
      <div className="boxLogo">
        <a href="/" aria-label="Ir para o início" onClick={() => setOpen(false)}>
          <img src={Logo} alt="Logo da Chock Trufas" height="50" />
          <span>
            <strong>Chock Trufas</strong>
            <small>Doces e salgados</small>
          </span>
        </a>
      </div>
      {/* Navegação usa links com hash para seções da home e link direto para compra. */}
      <nav className={`nav ${open ? "navAberta" : ""}`} id="myLinks" aria-label="Menu principal">
        <a href="/#precos" onClick={() => setOpen(false)}>Preços</a>
        <a className="navComprar" href="/compra" onClick={() => setOpen(false)}>Comprar</a>
        <a href="/#sobre" onClick={() => setOpen(false)}>Sobre</a>
        <a href="/#fotos" onClick={() => setOpen(false)}>Fotos</a>
        <a href="/#contato" onClick={() => setOpen(false)}>Contato</a>
      </nav>
      {/* Botão usado só no layout mobile para expandir ou recolher o menu. */}
      <button
        type="button"
        className="material-symbols-outlined menuMobile"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-controls="myLinks"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "close" : "menu"}
      </button>
    </header>
  );
}
