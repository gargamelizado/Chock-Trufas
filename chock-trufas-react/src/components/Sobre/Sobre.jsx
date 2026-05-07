import "./Sobre.css";

// Sobre conta a história da Chock Trufas e cria confiança antes da área de produtos.
export default function Sobre() {
  return (
    <section id="sobre" className="sectionSobre">
      <span className="sobreEyebrow">Nossa história</span>
      <h2>Produção familiar com cuidado de encomenda especial</h2>
      <p>
        A Chock Trufas nasceu dentro de uma família, atendendo amigos,
        parentes e vizinhos. Com a boa aceitação dos primeiros pedidos, a loja
        cresceu pelo WhatsApp e hoje atende Niterói e São Gonçalo com doces,
        salgados e combos preparados com higiene, capricho e atenção aos
        detalhes de cada cliente.
      </p>
      <div className="sobrePilares">
        <strong>Qualidade artesanal</strong>
        <strong>Atendimento direto</strong>
        <strong>Pedidos personalizados</strong>
      </div>
    </section>
  );
}
