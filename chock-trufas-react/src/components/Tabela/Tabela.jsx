import React from 'react'

export default function Tabela() {
  return (
    <section className="tabelaPreco">
        <h2>Tabela de Preços</h2>
        <div className="tabela">
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
                <td>pacote Simples</td>
                <td>R$29</td>
                <td>Ideal para lembrancinhas ou pequenas festas.</td>
              </tr>
              <tr>
                <td>Pacote Festa</td>
                <td>R$39</td>
                <td>Combo com variedade de sabores para festas.</td>
              </tr>
              <tr>
                <td>Pacote Premium</td>
                <td>R$49</td>
                <td>Embalagens personalizadas e entrega agendada.</td>
              </tr>
              <tr>
                <td>pacote Premium especiais</td>
                <td>R$59</td>
                <td>Trufas recheadas com ingredientes especiais.</td>
              </tr>
              <tr>
                <td>Pacote Caixa de Doces</td>
                <td>R$69</td>
                <td>Caixa com uma seleção de nossos melhores doces.</td>
              </tr>
              <tr>
                <td>pacote festa Gourmet</td>
                <td>R$79</td>
                <td>Inclui trufas, salgados e bebidas.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
  )
}
