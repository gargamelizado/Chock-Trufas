import { useEffect, useState } from "react";
import "./Tabela.css";

function formatarPrecoProduto(produtosCatalogo, produtoId) {
  const produto = produtosCatalogo.find((item) => item.id === produtoId);
  const preco = Number(produto?.price);

  if (!Number.isFinite(preco) || preco <= 0) {
    return "A confirmar";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
}

// Tabela resume preços e descrições para quem quer comparar antes de comprar.
export default function Tabela() {
  const [produtosCatalogo, setProdutosCatalogo] = useState([]);

  useEffect(() => {
    async function carregarCatalogo() {
      try {
        const response = await fetch("/api/catalog");
        const data = await response.json();

        if (response.ok && Array.isArray(data.products)) {
          setProdutosCatalogo(data.products);
        }
      } catch {
        setProdutosCatalogo([]);
      }
    }

    carregarCatalogo();
  }, []);

  return (
    <section className="tabelaPreco">
      <div className="tabelaCabecalho">
        <span>Consulta rápida</span>
        <h2>Tabela de preços</h2>
        <p>Valores base. Combos, sabores e detalhes são confirmados no atendimento.</p>
      </div>
      <div className="tabela">
        {/* Tabela fica com rolagem horizontal no mobile para preservar leitura. */}
        <table aria-label="Tabela de preços base da Chock Trufas">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Preço</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cone trufado</td>
              <td>{formatarPrecoProduto(produtosCatalogo, "cone-trufado")}</td>
              <td>Cone trufado com recheio de chocolate.</td>
            </tr>
            <tr>
              <td>Barra de Chocolate</td>
              <td>{formatarPrecoProduto(produtosCatalogo, "barra-chocolate")}</td>
              <td>Barra de chocolate ao leite com recheio cremoso.</td>
            </tr>
            <tr>
              <td>Alfajor Maria</td>
              <td>{formatarPrecoProduto(produtosCatalogo, "alfajor-maria")}</td>
              <td>Alfajor com doce de leite e cobertura de chocolate.</td>
            </tr>
            <tr>
              <td>Italianilho</td>
              <td>{formatarPrecoProduto(produtosCatalogo, "italianilho")}</td>
              <td>Salgadinho individual com opções de recheio.</td>
            </tr>
            <tr>
              <td>Pacote Festa</td>
              <td>{formatarPrecoProduto(produtosCatalogo, "pacote-festa")}</td>
              <td>100 salgadinhos, 50 docinhos, 1 bolo e 2 refrigerantes escolhidos pelo cliente.</td>
            </tr>
            <tr>
              <td>Empadão</td>
              <td>{formatarPrecoProduto(produtosCatalogo, "empadao")}</td>
              <td>Empadão com massa crocante e recheios selecionados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
