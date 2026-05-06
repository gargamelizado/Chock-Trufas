import "./Tabela.css";

// Tabela resume preços e descrições para quem quer comparar antes de comprar.
export default function Tabela() {
  return (
    <section className="tabelaPreco">
        <h2>Tabela de Preços</h2>
        <div className="tabela">
          {/* Tabela fica com rolagem horizontal no mobile para preservar leitura. */}
          <table>
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
                <td>R$10</td>
                <td>Cone trufado com recheio de chocolate.</td>
              </tr>
              <tr>
                <td>Barra de Chocolate</td>
                <td>R$12</td>
                <td>Barra de chocolate ao leite com recheio cremoso.</td>
              </tr>
              <tr>
                <td>Alfajor Maria</td>
                <td>R$12</td>
                <td>Alfajor com doce de leite e cobertura de chocolate.</td>
              </tr>
              <tr>
                <td>Italianilho</td>
                <td>R$1.20</td>
                <td>Salgadinho com recheio de queijo e presunto.</td>
              </tr>
              <tr>
                <td>Pacote Festa</td>
                <td>R$79.90</td>
                <td>100 salgadinhos, 40 docinhos, 1 bolo e 2 refrigerantes escolhidos pelo cliente.</td>
              </tr>
              <tr>
                <td>Empadao</td>
                <td>R$10.00</td>
                <td>Empadao de frango com massa crocante.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
  )
}
