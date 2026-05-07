import img from "../../assets/bolo-salgado-no-potinho.jpg";
import img2 from "../../assets/salgados-para-festa-1024x686.webp";
import img3 from "../../assets/empadao-de-carne-seca.jpg";
import img4 from "../../assets/barras.jpg";
import img5 from "../../assets/Alfajor-Maria-01-1920x1442-1200x901.jpg";
import img6 from "../../assets/doce_capa.webp";
import "./Espaco.css";

const fotosProducao = [
  { src: img, alt: "Bolo salgado no potinho pronto para encomenda" },
  { src: img2, alt: "Salgadinhos de festa organizados para servir" },
  { src: img3, alt: "Empadão de carne seca assado" },
  { src: img4, alt: "Barras de chocolate recheadas" },
  { src: img5, alt: "Alfajor artesanal com cobertura de chocolate" },
  { src: img6, alt: "Doces variados da Chock Trufas" },
];

// Espaco mostra fotos de produtos e produção para reforçar variedade visual da loja.
export default function Espaco() {
  return (
    <section id="fotos" className="espacoSection">
      <div className="espacoCabecalho">
        <span>Produção e variedade</span>
        <h2>Um pouco do que sai da nossa cozinha</h2>
      </div>
      {/* Galeria de produtos reais para dar segurança visual antes da compra. */}
      <div className="espacoCardGroup">
        {fotosProducao.map((foto) => (
          <div className="espacoCard" key={foto.alt}>
            <img src={foto.src} alt={foto.alt} />
          </div>
        ))}
      </div>
    </section>
  );
}
