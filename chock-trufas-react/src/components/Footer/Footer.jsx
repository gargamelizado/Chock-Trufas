import "./Footer.css";

// Footer reúne depoimentos, agendamento opcional, mapa, contato e botão fixo de WhatsApp.
export default function Footer({ mostrarAgendamento = true, mostrarWhatsApp = true }) {
  const anoAtual = new Date().getFullYear();

  // Envia o formulário antigo de agendamento direto para WhatsApp quando ele está visível.
  function enviarAgendamento(event) {
    event.preventDefault();

    const dados = new FormData(event.currentTarget);
    const mensagem = [
      "Olá, quero fazer um agendamento na Chock Trufas.",
      `Nome: ${dados.get("nome")}`,
      `Email: ${dados.get("email") || "Não informado"}`,
      `Telefone: ${dados.get("telefone") || "Não informado"}`,
      `Serviço: ${dados.get("servico")}`,
      `Mensagem: ${dados.get("mensagem") || "Sem observações"}`,
    ].join("\n");

    window.open(
      `https://wa.me/5521992470799?text=${encodeURIComponent(mensagem)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <>
    {/* Depoimentos dão prova social na home e também aparecem no rodapé da compra. */}
    <section className="depoimentosSection">
      <div className="footerCabecalho">
        <span>Clientes</span>
        <h2>Quem encomenda, recomenda</h2>
      </div>
      <div className="depoimentosGrid">
        <div className="depoimentoCard">
          <div className="depoimentoContent">
            <p>"Os melhores doces da região! Atendimento impecável."</p>
            <strong>- Juliana M.</strong>
          </div>
        </div>
        <div className="depoimentoCard">
          <div className="depoimentoContent">
            <p>
              "Fiz uma encomenda pro aniversário do meu filho e foi um
              sucesso."
            </p>
            <strong>- Carlos R.</strong>
          </div>
        </div>
        <div className="depoimentoCard">
          <div className="depoimentoContent">
            <p>
              "As trufas são deliciosas e o atendimento é super atencioso."
            </p>
            <strong>- Ana P.</strong>
          </div>
        </div>
        <div className="depoimentoCard">
          <div className="depoimentoContent">
            <p>
              "Recomendo a todos! Produtos de qualidade e entrega rápida."
            </p>
            <strong>- Roberto S.</strong>
          </div>
        </div>
      </div>
    </section>
    {mostrarAgendamento ? (
      /* O formulário de agendamento fica fora da página /compra para não misturar fluxos. */
      <section id="agendamento" className="sectionAgendamento">
        <div className="formularioInformes">
          <span>Atendimento</span>
          <h2>Fale sobre sua encomenda</h2>
          <p>
            Envie uma ideia inicial do pedido. A confirmação de sabores, prazo
            e entrega continua pelo WhatsApp.
          </p>
        </div>
        <form className="form" onSubmit={enviarAgendamento}>
          <label htmlFor="nome">Nome</label>
          <input type="text" id="nome" name="nome" required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />

          <label htmlFor="telefone">Telefone</label>
          <input type="tel" id="telefone" name="telefone" />

          <label htmlFor="servico">Serviço</label>
          <select id="servico" name="servico" required>
            <option value="">Selecione um serviço</option>
            <option value="Pacote Simples">Pacote Simples</option>
            <option value="Pacote Festa">Pacote Festa</option>
            <option value="Pacote Premium">Pacote Premium</option>
            <option value="Pacote Premium Especial">Pacote Premium Especial</option>
            <option value="Pacote Caixa de Doces">Pacote Caixa de Doces</option>
            <option value="Pacote Festa Gourmet">Pacote Festa Gourmet</option>
          </select>

          <label htmlFor="mensagem">Mensagem</label>
          <textarea id="mensagem" name="mensagem" rows="4"></textarea>

          <button type="submit">Enviar Agendamento</button>
        </form>
      </section>
      ) : null}
      {/* Contato e mapa ajudam o cliente a confirmar a loja e falar pelo WhatsApp. */}
      <section id="contato" className="sectionContato">
        <div className="contatoResumo">
          <span>Contato</span>
          <h2>Atendimento Chock Trufas</h2>
          <p>WhatsApp: (21) 99247-0799</p>
          <a href="https://wa.me/5521992470799" target="_blank" rel="noreferrer">
            Conversar pelo WhatsApp
          </a>
        </div>
        <iframe
          title="Mapa da Chock Trufas"
          className="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3676.680316668931!2d-43.0957034!3d-22.851314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x998535af368b87%3A0xde4cc5ffae5503a0!2sCHOCK%20TRUFAS!5e0!3m2!1spt-BR!2sbr!4v1775445835340!5m2!1spt-BR!2sbr"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
      <footer>© {anoAtual} Chock Trufas - Doces e salgados sob encomenda.</footer>
      {mostrarWhatsApp ? (
        /* Atalho fixo para atendimento rápido em qualquer ponto da home. */
        <a
          href="https://wa.me/5521992470799"
          className="whatsappBtn"
          target="_blank"
          rel="noreferrer"
          aria-label="Conversar com a Chock Trufas pelo WhatsApp"
        >
          WhatsApp
        </a>
      ) : null}
    </>
  );
}
