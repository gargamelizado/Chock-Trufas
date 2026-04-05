

export default function Footer() {
  return <>
    <section class="section">
        <h2>Depoimentos</h2>
        <div class="cardGroup">
          <div class="card">
            <div class="cardContent">
              <p>"Os melhores doces da região! Atendimento impecável."</p>
              <strong>- Juliana M.</strong>
            </div>
          </div>
          <div class="card">
            <div class="cardContent">
              <p>
                "Fiz uma encomenda pro aniversário do meu filho e foi um
                sucesso."
              </p>
              <strong>- Carlos R.</strong>
            </div>
          </div>
          <div class="card">
            <div class="cardContent">
              <p>
                "As trufas são deliciosas e o atendimento é super atencioso."
              </p>
              <strong>- Ana P.</strong>
            </div>
          </div>
          <div class="card">
            <div class="cardContent">
              <p>
                "Recomendo a todos! Produtos de qualidade e entrega rápida."
              </p>
              <strong>- Roberto S.</strong>
            </div>
          </div>
        </div>
      </section>
      <section id="agendamento" class="sectionAgendamento">
        <div class="formularioInformes">
          <h2>Agendamento</h2>
          <p>Preencha o formulário abaixo para agendar seu horário.</p>
        </div>
        <form action="#" method="post" class="form">
          <label for="nome">Nome</label>
          <input type="text" id="nome" name="nome" required />

          <label for="email">Email</label>
          <input type="email" id="email" name="email" />

          <label for="telefone">Telefone</label>
          <input type="tel" id="telefone" name="telefone" />

          <label for="servico">Serviço</label>
          <select id="servico" name="servico" required="">
            <option value="">Selecione um serviço</option>
            <option value="trufa">pacote Simples</option>
            <option value="festa">Pacote Festa</option>
            <option value="premium">Pacote Premium</option>
            <option value="premium">pacote Premium especiais</option>
            <option value="premium">Pacote Caixa de Doces</option>
            <option value="premium">pacote festa Gourmet</option>
          </select>

          <label for="mensagem">Mensagem</label>
          <textarea id="mensagem" name="mensagem" rows="4"></textarea>

          <button type="submit">Enviar Agendamento</button>
        </form>
      </section>
      <section id="contato" class="sectionContato">
        <h2>Contato</h2>
        <p>WhatsApp: (21) 992470799</p>
      
      </section>
      <footer>© 2025 Chock Trufas - Todos os direitos reservados.</footer>
      <a href="https://wa.me/5521992470799" class="whatsappBtn" target="_blank">WhatsApp</a>
    </>
}