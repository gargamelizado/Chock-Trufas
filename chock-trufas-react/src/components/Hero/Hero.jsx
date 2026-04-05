import React from 'react'
import Logo from "../../assets/LOGO.png"
import "./estilo.css"
export default function Hero() {
 return (
<section className="hero">
        <h1><img src={Logo} alt="Chock Trufas logo, a brand identity for an artisanal chocolate truffle shop" /></h1>
        <p>Soluções sob medida para você. Agende já seu horário!</p>
        <a className="btnAgendar" href="#agendamento">Fazer um agendamento</a>
      </section>
  )
}
