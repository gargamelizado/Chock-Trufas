import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Sobre from "./components/Sobre/Sobre";
import Produtos from "./components/Produtos/Produtos";
import Compra from "./components/Compra/Compra";
import CompraSite from "./components/CompraSite/CompraSite";
import Footer from "./components/Footer/Footer";
import Tabela from "./components/Tabela/Tabela";
import Espaco from "./components/Espaco/Espaco";

// App controla a composição das páginas: site institucional na raiz e compra em /compra.
function App() {
  const paginaCompra = window.location.pathname === "/compra";

  if (paginaCompra) {
    return (
      <>
        {/* Cabeçalho mantido também na compra para o cliente voltar à navegação principal. */}
        <Header />
        <CompraSite />
        {/* Na página de compra o formulário antigo de agendamento fica oculto. */}
        <Footer mostrarAgendamento={false} mostrarWhatsApp={false} />
      </>
    );
  }

  return (
    <>
      {/* Página inicial completa com apresentação, produtos, compra, fotos, preços e contato. */}
      <Header />
      <Hero />
      <Sobre />
      <Produtos />
      <Compra />
      <Espaco />
      <Tabela />
      <Footer />
    </>
  );
}

export default App;
