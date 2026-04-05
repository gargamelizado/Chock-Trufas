import React from 'react'
import img from "../../assets/bolo-salgado-no-potinho.jpg"
import img2 from "../../assets/salgados-para-festa-1024x686.webp"
import img3 from "../../assets/empadao-de-carne-seca.jpg"
import img4 from "../../assets/barras.jpg"
import img5 from "../../assets/Alfajor-Maria-01-1920x1442-1200x901.jpg" 
import img6 from "../../assets/doce_capa.webp"
export default function Espaço() {
  return (
<section id="fotos" className="section">
        <h2>Nosso Espaço</h2>
        <div className="cardGroup">
          <div className="card">
            <img src={img} alt="Espaço 1" />
          </div>
          <div className="card">
            <img src={img2} alt="Espaço 2" />
          </div>
          <div className="card">
            <img src={img3} alt="Espaço 3" />
          </div>
        </div>
        <div className="cardGroup">
          <div className="card">
            <img src={img4} alt="Espaço 4" />
          </div>
          <div className="card">
            <img src={img5} alt="Espaço 5" />
          </div>
          <div className="card">
            <img src={img6} alt="Espaço 6" />
          </div>
        </div>
      </section>
    
  )
}



