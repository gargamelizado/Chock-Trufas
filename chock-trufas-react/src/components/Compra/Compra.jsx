import "./Compra.css";

const pedidosSugeridos = [
  "Doces para festa",
  "Salgados por cento",
  "Empadao e tortas",
];

// Compra é a chamada da home que explica o fluxo e leva para a página /compra.
export default function Compra() {
  return (
    <section id="compra" className="sectionCompra">
      {/* Texto curto para preparar o cliente antes de abrir o carrinho. */}
      <div className="compraTexto">
        <span>Compra pelo site</span>
        <h2>Monte seu pedido em uma página exclusiva</h2>
        <p>
          Clique para abrir a área de compra, escolher produtos, informar
          quantidade e enviar tudo direto para o atendimento.
        </p>
      </div>

      <div className="compraGrid">
        {/* Passo a passo simples do pedido pelo site. */}
        <div className="compraCardPrincipal">
        <h3>Como vai funcionar</h3>
        <ol>
          <li>Cliente escolhe o tipo de produto.</li>
            <li>Informa quantidade, data e observações.</li>
          <li>A loja confirma o pedido no atendimento.</li>
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
