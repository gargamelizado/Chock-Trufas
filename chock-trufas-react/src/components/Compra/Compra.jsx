import "./Compra.css";

const pedidosSugeridos = [
  "Doces para festa",
  "Salgados por cento",
  "Empadão e tortas",
];

// Compra é a chamada da home que explica o fluxo e leva para a página /compra.
export default function Compra() {
  return (
    <section id="compra" className="sectionCompra">
      {/* Texto curto para preparar o cliente antes de abrir o carrinho. */}
      <div className="compraTexto">
        <span>Compra pelo site</span>
        <h2>Monte o pedido com sabores, quantidades e retirada ou entrega</h2>
        <p>
          A página de compra reúne carrinho, recheios, combos de festa,
          endereço ou dados de retirada. Depois, a loja confirma o pedido pelo
          atendimento.
        </p>
      </div>

      <div className="compraGrid">
        {/* Passo a passo simples do pedido pelo site. */}
        <div className="compraCardPrincipal">
        <h3>Como funciona</h3>
        <ol>
          <li>Escolha os produtos e adicione ao carrinho.</li>
          <li>Informe recheios, sabores e quantidades.</li>
          <li>Envie o pedido para a loja confirmar no WhatsApp.</li>
        </ol>
        </div>

        {/* Atalhos de categorias que reforçam o tipo de pedido aceito. */}
        <div className="compraResumo">
          <h3>Comprar online</h3>
          <div className="compraTags">
            {pedidosSugeridos.map((pedido) => (
              <span key={pedido}>{pedido}</span>
            ))}
          </div>
          <a href="/compra">Abrir página de compra</a>
        </div>
      </div>
    </section>
  );
}
