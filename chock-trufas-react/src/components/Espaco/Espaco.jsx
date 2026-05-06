import img from "../../assets/bolo-salgado-no-potinho.jpg"
import img2 from "../../assets/salgados-para-festa-1024x686.webp"
import img3 from "../../assets/empadao-de-carne-seca.jpg"
import img4 from "../../assets/barras.jpg"
import img5 from "../../assets/Alfajor-Maria-01-1920x1442-1200x901.jpg" 
import img6 from "../../assets/doce_capa.webp"
import "./Espaco.css";

// Espaco mostra fotos de produtos e produção para reforçar variedade visual da loja.
export default function Espaco() {
  return (
<section id="fotos" className="espacoSection">
        <div className="espacoCabecalho">
          <span>Produção e variedade</span>
          <h2>Um pouco do que sai da nossa cozinha</h2>
        </div>
        {/* Galeria superior com produtos salgados e bolos. */}
        <div className="espacoCardGroup">
          <div className="espacoCard">
            <img src={img} alt="Espaço 1" />
          </div>
          <div className="espacoCard">
            <img src={img2} alt="Espaço 2" />
          </div>
          <div className="espacoCard">
            <img src={img3} alt="Espaço 3" />
          </div>
        </div>
        {/* Galeria inferior com barras, alfajor e doces. */}
        <div className="espacoCardGroup">
          <div className="espacoCard">
            <img src={img4} alt="Espaço 4" />
          </div>
          <div className="espacoCard">
            <img src={img5} alt="Espaço 5" />
          </div>
          <div className="espacoCard">
            <img src={img6} alt="Espaço 6" />
          </div>
        </div>
      </section>
    
  )
}
