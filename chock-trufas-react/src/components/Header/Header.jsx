import { useState } from "react";
import Logo from "../../assets/LOGO.png"
import "./estilo.css";

// Header mostra logo, links principais e menu mobile com estado aberto/fechado.
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      {/* Identidade visual da loja sempre visível no topo. */}
      <div className="boxLogo">
        <a href="/" aria-label="Ir para o início">
          <img src={Logo} alt="Logo da Chock Trufas" height="50" />
        </a>
      </div>
      {/* Navegação usa links com hash para seções da home e link direto para compra. */}
      <nav className={`nav ${open ? "navAberta" : ""}`} id="myLinks">
        <a href="/#precos">Preços</a>
        <a className="navComprar" href="/compra">Comprar</a>
        <a href="/#sobre">Sobre</a>
        <a href="/#fotos">Espaço</a>
        <a href="/#contato">Contato</a>
      </nav>
      {/* Botão usado só no layout mobile para expandir ou recolher o menu. */}
      <button
        type="button"
        className="material-symbols-outlined menuMoblie"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-controls="myLinks"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "close" : "menu"}
      </button>
    </header>
  )
}
