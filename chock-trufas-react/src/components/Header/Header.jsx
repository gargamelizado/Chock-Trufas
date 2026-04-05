import { useState } from "react";
import "./estilo.css"
import Logo from "../../assets/LOGO.png"
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <div className="header">
      <div className="boxLogo">
        <img src={Logo} alt="Chock Trufas logo, a brand identity for an artisanal chocolate truffle shop" height="50" />
      </div>
      <nav className="nav" id="myLinks">
        <a href="#precos">Preços</a>
        <a href="#sobre">Sobre</a>
        <a href="#fotos">Espaço</a>
        <a href="#contato">Contato</a>
      </nav>
      <span className="material-symbols-outlined menuMoblie" onClick={() => setOpen(!open)}> menu </span>
    </div>
  )
}

