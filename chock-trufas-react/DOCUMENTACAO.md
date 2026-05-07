# Documentacao do Site Chock Trufas

Este documento mapeia o site inteiro: estrutura, paginas, componentes, funcoes, rotas do frontend, rotas do backend, arquivos de dados e fluxo de compra.

## 1. Visao geral

O projeto e uma aplicacao React com Vite no frontend e uma API Express simples no backend.

- Frontend: React, Vite e CSS puro.
- Backend: Express com arquivos JSON para catalogo e pedidos.
- Porta do site em desenvolvimento: `http://localhost:5173`.
- Porta da API em desenvolvimento: `http://127.0.0.1:3001`.
- Fluxo principal: o cliente abre `/compra`, adiciona itens ao carrinho, escolhe recheios ou sabores do combo, informa entrega ou retirada, envia o pedido para a API e o site abre o WhatsApp com a mensagem pronta.

## 2. Estrutura principal

| Caminho | Funcao |
| --- | --- |
| `src/main.jsx` | Ponto de entrada do React. Renderiza o `App` dentro da `div#root`. |
| `src/App.jsx` | Decide qual pagina mostrar: home `/` ou compra `/compra`. |
| `src/index.css` | Variaveis, reset e base global. |
| `src/data/catalog.json` | Catalogo base importado pelo frontend antes de carregar a API. |
| `src/components/*/*.css` | CSS separado por componente, sempre ao lado do JSX correspondente. |
| `src/components/Header/estilo.css` | CSS ativo do Header. |
| `src/components/Hero/estilo.css` | CSS ativo do Hero. |
| `server/server.js` | API Express, rotas, validacoes e persistencia de pedidos. |
| `api/[...path].js` | Funcao serverless usada pela Vercel para atender `/api/*`. |
| `server/dev.js` | Script que sobe frontend e backend juntos com `npm run dev`. |
| `server/data/catalog.json` | Catalogo real usado pela API para validar produtos, combos e valores. |
| `server/data/orders.json` | Lista de pedidos registrados. |
| `vite.config.js` | Configura o React no Vite e o proxy `/api` para a API local. |
| `vercel.json` | Rewrite para `/compra` abrir a aplicacao React em deploy estatico. |

Observacao sobre a raiz do repositorio: existem `../index.html` e `../css/style.css` fora da pasta `chock-trufas-react`. Eles parecem ser uma versao estatica antiga. A aplicacao principal atual e esta pasta React/Vite com backend Express.

## 3. Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe backend e frontend juntos. Se a API ja estiver rodando em `3001`, reaproveita ela. |
| `npm run dev:web` | Sobe apenas o frontend Vite. |
| `npm run dev:api` | Sobe apenas a API Express. |
| `npm run lint` | Verifica problemas de codigo com ESLint. |
| `npm run build` | Gera a versao final do frontend em `dist`. |
| `npm start` | Sobe a API e serve tambem os arquivos de `dist`, quando existir build. |

## 4. Rotas do frontend

O projeto nao usa React Router. A rota e decidida em `src/App.jsx` com `window.location.pathname`.

| Rota | Componente principal | Conteudo |
| --- | --- | --- |
| `/` | `App` com componentes da home | Header, Hero, Sobre, Produtos, Compra, Espaco, Tabela e Footer. |
| `/compra` | `CompraSite` | Pagina completa de compra com catalogo, carrinho, dados do cliente, entrega ou retirada e envio do pedido. |

### Links internos do menu

| Link | Destino |
| --- | --- |
| `/#precos` | Secao de produtos e pacotes. |
| `/compra` | Pagina de compra. |
| `/#sobre` | Secao sobre a empresa. |
| `/#fotos` | Galeria de produtos/espaço. |
| `/#contato` | Contato, mapa e WhatsApp. |

## 5. Componentes do frontend

### `src/main.jsx`

Responsavel por importar os estilos globais, importar `App` e montar a aplicacao React no HTML.

Funcao principal:

| Funcao | Responsabilidade |
| --- | --- |
| `createRoot(...).render(...)` | Liga o React ao elemento `#root` do `index.html`. |

### `src/App.jsx`

Controla a composicao das paginas.

Funcao principal:

| Funcao | Responsabilidade |
| --- | --- |
| `App()` | Verifica se a URL e `/compra`. Se for, renderiza a pagina de compra. Caso contrario, renderiza a home completa. |

Detalhe importante:

- Na rota `/compra`, o `Footer` recebe `mostrarAgendamento={false}` para remover o formulario antigo de agendamento da pagina de compra.

### `src/components/Header/Header.jsx`

Mostra o topo fixo do site com logo, links e menu mobile.

Estados e funcoes:

| Nome | Tipo | Responsabilidade |
| --- | --- | --- |
| `open` | estado | Guarda se o menu mobile esta aberto ou fechado. |
| `setOpen` | atualizador de estado | Alterna o menu mobile ao clicar no botao. |
| `Header()` | componente | Renderiza logo, navegacao e botao mobile. |

### `src/components/Hero/Hero.jsx`

Primeira dobra da home. Mostra a logo grande, texto curto e botao para comprar pelo site.

Funcao principal:

| Funcao | Responsabilidade |
| --- | --- |
| `Hero()` | Renderiza a apresentacao inicial e o link para `/compra`. |

### `src/components/Sobre/Sobre.jsx`

Conta a historia da Chock Trufas e passa confianca para o cliente.

Funcao principal:

| Funcao | Responsabilidade |
| --- | --- |
| `Sobre()` | Renderiza a secao `#sobre`. |

### `src/components/Produtos/Produtos.jsx`

Mostra cards com produtos principais, imagem, preco e link para a pagina de compra.

Funcao principal:

| Funcao | Responsabilidade |
| --- | --- |
| `Produtos()` | Renderiza a secao `#precos` com cards de produtos e pacotes. |

Observacao:

- Esta secao e vitrine da home. Os precos iniciais vêm de `src/data/catalog.json`, e a compra real e validada pela API usando `server/data/catalog.json`.

### `src/components/Compra/Compra.jsx`

Secao da home que explica a compra pelo site e leva para `/compra`.

Constantes e funcoes:

| Nome | Tipo | Responsabilidade |
| --- | --- | --- |
| `pedidosSugeridos` | constante | Lista categorias destacadas: doces para festa, salgados por cento, empadao e tortas. |
| `Compra()` | componente | Renderiza o resumo do fluxo de compra e botao para abrir a pagina de compra. |

### `src/components/Espaco/Espaco.jsx`

Mostra uma galeria com imagens de produtos e producao.

Funcao principal:

| Funcao | Responsabilidade |
| --- | --- |
| `Espaco()` | Renderiza a secao `#fotos` com cards de imagens. |

### `src/components/Tabela/Tabela.jsx`

Mostra uma tabela simples de precos e descricoes.

Funcao principal:

| Funcao | Responsabilidade |
| --- | --- |
| `Tabela()` | Renderiza a tabela visual de precos da home. |

Observacao:

- Assim como `Produtos`, esta tabela e vitrine. Se mudar regras ou valores do catalogo real, atualize tambem esta tabela para a home nao ficar diferente da compra.

### `src/components/Footer/Footer.jsx`

Mostra depoimentos, formulario opcional de agendamento, mapa, rodape e botao fixo do WhatsApp.

Props, estados e funcoes:

| Nome | Tipo | Responsabilidade |
| --- | --- | --- |
| `mostrarAgendamento` | prop | Controla se o formulario antigo de agendamento aparece. Padrao: `true`. |
| `anoAtual` | constante | Pega o ano atual para o copyright. |
| `enviarAgendamento(event)` | funcao | Monta uma mensagem com dados do formulario e abre o WhatsApp. |
| `Footer()` | componente | Renderiza depoimentos, agendamento opcional, contato, mapa e WhatsApp. |

### `src/components/CompraSite/CompraSite.jsx`

E o componente mais importante da aplicacao. Ele controla a compra real pelo site.

Estados:

| Estado | Responsabilidade |
| --- | --- |
| `produtos` | Guarda o catalogo exibido na tela. Comeca com os produtos importados de `src/data/catalog.json` e depois tenta carregar `/api/catalog`. |
| `itensCarrinho` | Lista cada item adicionado. Cada entrada tem `cartItemId` e `productId`, permitindo adicionar o mesmo produto mais de uma vez. |
| `quantidades` | Guarda quantidades dos produtos comuns, separadas por `cartItemId`. |
| `recheios` | Guarda o recheio escolhido de cada item, separado por `cartItemId`. |
| `comboEscolhas` | Guarda escolhas de combos por item, categoria e sabor. |
| `formaRecebimento` | Controla se o cliente escolheu `Retirada` ou `Entrega`. |
| `enderecoEntrega` | Guarda CEP, rua, numero, bairro, cidade, UF, complemento e referencia da entrega. |
| `statusCep` | Mostra se a busca do CEP esta parada, buscando, com sucesso ou com erro. |
| `statusPedido` | Mostra estado do envio: parado, enviando, sucesso ou erro. |

Constantes:

| Nome | Responsabilidade |
| --- | --- |
| `nomesCategoriaCombo` | Define nomes singular/plural para categorias de combo. |
| `catalogoBase` | Importa o arquivo `src/data/catalog.json` para servir como base local da tela. |
| `produtosBase` | Lista de produtos extraida de `catalogoBase.products`, usada como estado inicial e fallback se a API estiver fora do ar. |
| `formasPagamento` | Lista as formas aceitas quando o pedido for para entrega: Pix, dinheiro no recebimento e cartao no recebimento. |
| `enderecoEntregaInicial` | Estado inicial usado para limpar o formulario de endereco depois do envio. |

Funcoes de carregamento e busca:

| Funcao | Responsabilidade |
| --- | --- |
| `carregarCatalogo()` | Busca `/api/catalog` e atualiza a lista de produtos. Se falhar, usa `produtosBase`, que vem de `src/data/catalog.json`. |
| `encontrarProduto(produtoId)` | Encontra um produto no catalogo carregado. |
| `criarItemCarrinhoId(produtoId)` | Cria um ID unico para cada linha do carrinho. |
| `obterProdutosDoCarrinho()` | Junta `itensCarrinho` com os dados completos do catalogo. |
| `contarProdutoNoCarrinho(produtoId)` | Conta quantas vezes um produto foi adicionado ao carrinho. |

Funcoes de CEP e endereco:

| Funcao | Responsabilidade |
| --- | --- |
| `limparCep(cep)` | Remove tudo que nao for numero e limita o CEP a 8 digitos. |
| `formatarCep(cep)` | Aplica a mascara `00000-000` no CEP digitado. |
| `alterarEnderecoEntrega(campo, valor)` | Atualiza um campo do endereco de entrega. |
| `buscarEnderecoPeloCep()` | Consulta `https://viacep.com.br/ws/{cep}/json/` e preenche rua, bairro, cidade e UF. |
| `montarEnderecoEntrega()` | Junta os campos de endereco em uma string unica enviada ao backend. |

Funcoes de produto e combo:

| Funcao | Responsabilidade |
| --- | --- |
| `obterCategoriasCombo(produto)` | Retorna categorias do combo, como `salgadinhos`, `docinhos`, `bolo` e `refrigerante`. |
| `produtoTemCombo(produto)` | Verifica se o produto possui `comboRules`. |
| `produtoTemRecheio(produto)` | Verifica se o produto possui `fillingOptions`. |
| `formatarMoeda(valor)` | Formata valores em real brasileiro. |
| `obterPrecoProduto(produto)` | Le o campo `price` do produto no catalogo. |
| `produtoTemPreco(produto)` | Verifica se o produto possui preco valido. |
| `obterQuantidadeNumerica(produto)` | Converte a quantidade digitada em numero para calcular subtotal. |
| `obterSubtotalProduto(produto)` | Calcula preco unitario vezes quantidade. |
| `obterTotalCarrinho()` | Soma todos os subtotais do carrinho. |
| `carrinhoTemItemSemPreco()` | Verifica se ha item sem preco cadastrado no catalogo. |
| `produtosComQuantidadeManual()` | Retorna produtos do carrinho que precisam de quantidade digitada. |
| `produtosComRecheio()` | Retorna produtos do carrinho que precisam de recheio escolhido. |
| `obterRegraCombo(produto, categoria)` | Retorna o limite obrigatorio de uma categoria do combo. |
| `somarEscolhasCombo(cartItemId, categoria)` | Soma o que o cliente ja escolheu em uma categoria. |
| `obterStatusCategoria(produto, categoria)` | Informa se ainda falta, passou ou completou a quantidade da categoria. |
| `obterMaximoItem(produto, categoria, item)` | Calcula o maximo permitido para um input sem passar do limite do combo. |

Funcoes de texto e resumo:

| Funcao | Responsabilidade |
| --- | --- |
| `formatarTituloCategoria(categoria)` | Transforma a categoria em titulo visual. |
| `formatarQuantidadeCategoria(categoria, quantidade)` | Escreve textos como `100 salgadinhos` ou `1 bolo`. |
| `unirPartes(partes)` | Junta textos com virgula e `e`. |
| `montarQuantidadeCombo(produto)` | Cria o resumo da regra do combo. Exemplo: `100 salgadinhos, 50 docinhos, 1 bolo e 2 refrigerantes`. |
| `montarDetalheProduto(produto)` | Monta o detalhe exibido no card do catalogo. |
| `formatarEscolhasCombo(items)` | Formata as escolhas feitas dentro de uma categoria. |
| `montarResumoComboEscolhido(selectedComboItems)` | Monta resumo textual dos sabores escolhidos no combo. |
| `montarMensagem(order)` | Cria a mensagem final enviada para o WhatsApp. |

Funcoes de montagem de payload:

| Funcao | Responsabilidade |
| --- | --- |
| `montarCategoriaCombo(escolhas)` | Converte objeto de escolhas em lista `{ name, quantity }`. |
| `montarEscolhasCombo(produto)` | Monta todas as categorias escolhidas de um produto combo. |

Funcoes do carrinho:

| Funcao | Responsabilidade |
| --- | --- |
| `adicionarAoCarrinho(produtoId)` | Adiciona uma nova linha no carrinho. O mesmo produto pode ser adicionado varias vezes. |
| `removerDoCarrinho(cartItemId)` | Remove uma linha especifica do carrinho e limpa quantidade, recheio e escolhas dela. |
| `alterarQuantidade(cartItemId, quantidade)` | Atualiza a quantidade digitada de uma linha do carrinho. |
| `alterarRecheio(cartItemId, recheio)` | Atualiza o recheio escolhido de uma linha do carrinho. |
| `alterarEscolhaCombo(cartItemId, categoria, item, quantidade)` | Atualiza a quantidade de um sabor/item dentro de um combo. |

Funcoes de validacao e envio:

| Funcao | Responsabilidade |
| --- | --- |
| `validarCombosSelecionados()` | Impede envio se qualquer categoria do combo nao fechar exatamente a regra. |
| `enviarPedido(event)` | Valida campos, monta o payload, envia `POST /api/orders`, trata resposta JSON com seguranca, abre WhatsApp e limpa o carrinho. |

## 6. Fluxo da pagina de compra

1. A pagina tenta carregar o catalogo em `GET /api/catalog`.
2. O cliente adiciona produtos ao carrinho pelos cards.
3. Se o produto tiver recheio, aparece um `select` de recheio.
4. Se o produto nao for combo, aparece input numerico de quantidade.
5. Se o produto for combo, aparecem categorias com inputs numericos e limite visivel.
6. O cliente escolhe `Retirada` ou `Entrega`.
7. Se escolher entrega, o cliente escolhe a forma de pagamento.
8. Para entrega, o site exige CEP, rua, numero, bairro, cidade e UF.
9. Ao digitar ou sair do campo CEP, o site pode consultar a ViaCEP e preencher dados de endereco automaticamente.
10. Para retirada, o site exige dia, horario, pessoa que vai retirar e documento.
11. O carrinho calcula preco unitario, subtotal e total usando `price` do catalogo.
12. O envio chama `POST /api/orders`.
13. A API valida tudo, recalcula valores pelo catalogo, salva em `server/data/orders.json` e devolve o pedido criado.
14. O frontend abre o WhatsApp com a mensagem do pedido pronta.

## 7. Carrinho

O carrinho fica em `CompraSite.jsx`, no estado `itensCarrinho`.

Cada clique em `Adicionar` cria uma nova linha com `cartItemId` unico. Por isso o cliente consegue adicionar o mesmo produto mais de uma vez e escolher quantidade, recheio ou combo diferente em cada linha.

O visual do carrinho fica em `src/components/CompraSite/CompraSite.css`, principalmente nestas classes:

| Classe | Responsabilidade |
| --- | --- |
| `.carrinhoPedido` | Container geral do carrinho. |
| `.carrinhoTopo` | Cabecalho com titulo e contador. |
| `.carrinhoVazio` | Estado exibido quando nao tem item. |
| `.carrinhoLista` | Lista com rolagem vertical quando ha muitos itens. |
| `.carrinhoItem` | Card de cada item do pedido. |
| `.carrinhoRemover` | Botao para remover uma linha do carrinho. |

## 7.1. CEP e endereco de entrega

A busca de CEP fica no frontend, dentro de `src/components/CompraSite/CompraSite.jsx`.

Quando o cliente escolhe `Entrega`, aparecem os campos:

- CEP.
- Rua.
- Numero.
- Bairro.
- Cidade.
- UF.
- Complemento.
- Ponto de referencia.

O cliente pode digitar o CEP e sair do campo, ou clicar em `Buscar CEP`. O site consulta a ViaCEP e preenche automaticamente rua, bairro, cidade e UF quando o CEP e encontrado. Numero, complemento e referencia continuam manuais porque normalmente nao vêm da API.

O backend continua recebendo `address` como texto unico. Esse texto e montado por `montarEnderecoEntrega()` antes de enviar o pedido.

## 8. Catalogo e produtos

A compra real usa `server/data/catalog.json` no backend. O frontend usa `src/data/catalog.json` como base inicial e substitui pelos dados de `/api/catalog` quando a API esta disponivel.

Formato de um produto comum:

```json
{
  "id": "cone-trufado",
  "name": "Cone trufado",
  "type": "produto",
  "price": 10,
  "fillingOptions": ["Brigadeiro", "Beijinho"]
}
```

Formato de um combo:

```json
{
  "id": "pacote-festa",
  "name": "Pacote Festa",
  "type": "combo",
  "price": 500,
  "comboRules": {
    "salgadinhos": 100,
    "docinhos": 50,
    "bolo": 1,
    "refrigerante": 2
  },
  "comboItems": {
    "salgadinhos": ["Coxinha", "Kibe"],
    "docinhos": ["Brigadeiro", "Beijinho"],
    "bolo": ["Chocolate"],
    "refrigerante": ["Coca-cola"]
  }
}
```

### Pacote Festa atual

O `Pacote Festa` esta configurado com:

- 100 salgadinhos.
- 50 docinhos.
- 1 bolo.
- 2 refrigerantes.

O cliente escolhe os sabores, mas o total de cada categoria precisa bater exatamente com a regra.

### Como adicionar um novo produto

1. Abra `server/data/catalog.json` e `src/data/catalog.json`.
2. Adicione o mesmo objeto dentro de `products` nos dois arquivos.
3. Use um `id` unico, sem espaco e sem acento.
4. Use `type: "produto"` para produto comum.
5. Se o produto tiver recheio, adicione `fillingOptions`.
6. Se for combo, adicione `comboRules` e `comboItems`.
7. Se quiser que apareca tambem na home, atualize `Produtos.jsx` e `Tabela.jsx`.

### Como adicionar uma nova categoria de combo

Hoje as categorias com nomes bonitos sao:

- `salgadinhos`
- `docinhos`
- `bolo`
- `refrigerante`

Se criar uma categoria nova, por exemplo `tortas`, atualize tambem:

- `nomesCategoriaCombo` em `src/components/CompraSite/CompraSite.jsx`.
- `comboCategoryNames` em `server/server.js`.

Se nao atualizar esses dois mapas, a categoria ainda pode funcionar, mas o texto pode aparecer menos bonito.

## 9. Rotas da API

Base local: `http://127.0.0.1:3001`.

| Metodo | Rota | Funcao |
| --- | --- | --- |
| `GET` | `/api/health` | Verifica se a API esta rodando. |
| `GET` | `/api/catalog` | Retorna os produtos do catalogo. |
| `GET` | `/api/orders` | Retorna pedidos somente com `ORDERS_ADMIN_TOKEN` e header `x-admin-token`. Sem token, responde 404. |
| `POST` | `/api/orders` | Registra um novo pedido. |
| `GET` | `*` | Em producao, tenta servir `dist/index.html` para rotas do frontend. |

### `GET /api/orders`

Esta rota nao fica aberta para visitantes. Para consultar pedidos, configure `ORDERS_ADMIN_TOKEN` no ambiente da API e envie o mesmo valor no header `x-admin-token`.

### Vercel e `/api/orders`

Na Vercel, o Express nao roda como servidor permanente com `app.listen`. Por isso existe `api/[...path].js`, que importa o `app` de `server/server.js` e entrega as rotas `/api/*` como serverless function.

O `vercel.json` nao reescreve `/api/*` para o frontend. Ele deixa `/api/orders`, `/api/catalog` e `/api/health` chegarem na funcao serverless. Isso corrige o erro em que finalizar pedido batia no HTML do React em vez de bater na API.

Atencao: arquivo JSON em Vercel nao e banco de dados permanente. Para o deploy, `orders.json` nao deve ser tratado como historico definitivo. O pedido consegue ser validado e retornado para abrir o WhatsApp, mas historico real em producao precisa de banco de dados ou armazenamento externo.

### `GET /api/health`

Resposta esperada:

```json
{
  "ok": true,
  "service": "chock-trufas-api"
}
```

### `GET /api/catalog`

Resposta esperada:

```json
{
  "products": []
}
```

### `POST /api/orders`

Payload esperado:

```json
{
  "customerName": "Cliente",
  "phone": "21999999999",
  "items": [
    {
      "productId": "cone-trufado",
      "product": "Cone trufado",
      "quantity": "2",
      "quantityNumber": 2,
      "unitPrice": 10,
      "subtotal": 20,
      "filling": "Brigadeiro",
      "selectedComboItems": null
    }
  ],
  "desiredDate": "2026-05-10",
  "deliveryMethod": "Entrega",
  "paymentMethod": "Pix",
  "address": "Rua exemplo, 123",
  "pickupDate": "",
  "pickupTime": "",
  "pickupPerson": "",
  "pickupDocument": "",
  "notes": "Sem observacoes"
}
```

Resposta de sucesso:

```json
{
  "order": {
    "id": "uuid-do-pedido",
    "status": "novo",
    "createdAt": "data-em-iso",
    "total": 20,
    "paymentMethod": "Pix"
  }
}
```

Resposta de erro de validacao:

```json
{
  "message": "Pedido invalido.",
  "errors": ["Informe o nome do cliente."]
}
```

## 10. Funcoes do backend

Arquivo: `server/server.js`.

| Funcao | Responsabilidade |
| --- | --- |
| `ensureOrdersFile()` | Garante que a pasta de dados e `orders.json` existam. |
| `readOrders()` | Le pedidos do JSON e valida se o conteudo e uma lista. |
| `saveOrders(orders)` | Salva pedidos em `server/data/orders.json`. |
| `readCatalog()` | Le produtos de `server/data/catalog.json`. |
| `asyncHandler(handler)` | Encapsula rotas async e manda erros para o middleware do Express. |
| `cleanText(value)` | Converte valores para texto limpo. |
| `parsePositiveNumber(value)` | Converte texto ou numero em valor positivo. |
| `roundCurrency(value)` | Arredonda valores monetarios para duas casas. |
| `getProductPrice(product)` | Le e valida o `price` do produto no catalogo. |
| `findCatalogProduct(products, item)` | Encontra produto por `productId` ou nome. |
| `getComboSummary(product)` | Retorna os itens permitidos de cada categoria do combo. |
| `getComboRules(product)` | Normaliza regras de combo com quantidades validas. |
| `getFillingOptions(product)` | Retorna opcoes de recheio de um produto. |
| `sanitizeFilling(filling, catalogProduct)` | Aceita recheio somente se existir no catalogo. |
| `sanitizeComboChoices(selectedComboItems, catalogProduct)` | Limpa escolhas de combo usando o catalogo como fonte de verdade. |
| `sanitizeComboCategory(selectedItems, allowedItems)` | Remove itens invalidos, vazios ou fora do catalogo em uma categoria. |
| `sumComboCategory(items)` | Soma quantidades de uma categoria de combo. |
| `formatComboCategory(category, quantity)` | Escreve textos como `50 docinhos`. |
| `validateComboChoices(items, errors)` | Verifica se cada categoria do combo fechou exatamente a quantidade exigida. |
| `getComboQuantity(catalogProduct)` | Monta o texto de quantidade do combo. |
| `formatOrderItemSummary(item)` | Monta resumo do item para compatibilidade com o campo `quantity`. |
| `validateOrder(body, catalogProducts)` | Valida cliente, telefone, itens, recheios, combos, entrega e retirada. |

Arquivo: `server/dev.js`.

| Funcao | Responsabilidade |
| --- | --- |
| `apiIsRunning()` | Verifica se a API ja esta ativa em `3001`. |
| `startProcess(command, args)` | Abre processos filhos, como backend e Vite. |
| `stopProcesses()` | Encerra processos abertos pelo script. |
| `startDev()` | Sobe API se necessario e abre o Vite. |

## 11. Validacoes do pedido

A validacao acontece no frontend e no backend.

No frontend:

- Precisa ter pelo menos um item no carrinho.
- Produtos comuns precisam de quantidade.
- Produtos com recheio precisam de recheio.
- Combos precisam fechar exatamente cada categoria.
- Entrega exige CEP, rua, numero, bairro, cidade e UF no frontend.
- Retirada exige dia, horario, pessoa e documento.

No backend:

- Nome precisa ter pelo menos 2 caracteres.
- Telefone precisa ter pelo menos 8 caracteres.
- Pedido precisa ter itens.
- Quantidade numerica maior que zero e obrigatoria para produto comum.
- Todo item precisa ter `price` valido no catalogo.
- Forma de pagamento precisa ser escolhida somente quando o pedido for para entrega.
- Recheio so e aceito se existir no catalogo.
- Combo so aceita itens existentes no catalogo.
- Combo precisa fechar exatamente a quantidade exigida.
- Entrega exige endereco com pelo menos 5 caracteres.
- Retirada exige dia, horario, pessoa e documento.

## 12. Erros comuns

### `Servidor de pedidos indisponivel`

Normalmente significa que o frontend esta aberto, mas a API nao esta rodando.

Solucao:

```bash
npm run dev
```

### `EADDRINUSE: address already in use :::3001`

Significa que a porta `3001` ja esta ocupada por outra API.

Solucoes:

- Fechar o terminal antigo que esta usando a porta.
- Rodar `npm run dev`, porque `server/dev.js` tenta reaproveitar a API ativa.
- Se necessario, alterar `PORT` ao iniciar a API.

### `Unexpected end of JSON input`

Esse erro acontecia quando o frontend tentava ler JSON vazio. O envio atual usa `response.text()` antes de fazer `JSON.parse`, entao consegue mostrar uma mensagem melhor quando a API responde vazia ou fora do formato esperado.

### `Nao foi possivel registrar o pedido`

Pode acontecer por validacao do pedido ou erro da API. Para descobrir a causa:

1. Rode `npm run dev`.
2. Abra `http://127.0.0.1:3001/api/health`.
3. Verifique se `server/data/catalog.json` e `server/data/orders.json` estao com JSON valido.
4. Confira a resposta de erro em `POST /api/orders`, porque a API retorna `errors` quando falta algum campo.

## 13. Arquivos de estilo

| Arquivo | Status | Responsabilidade |
| --- | --- | --- |
| `src/index.css` | Ativo | Variaveis, reset, `body`, links e imagens. |
| `src/components/Header/estilo.css` | Ativo | Header fixo, navegacao e menu mobile. |
| `src/components/Hero/estilo.css` | Ativo | Hero da home e botao principal. |
| `src/components/Sobre/Sobre.css` | Ativo | Secao sobre a empresa. |
| `src/components/Produtos/Produtos.css` | Ativo | Cards de produtos da home. |
| `src/components/Compra/Compra.css` | Ativo | Chamada da home para compra pelo site. |
| `src/components/Espaco/Espaco.css` | Ativo | Galeria de imagens. |
| `src/components/Tabela/Tabela.css` | Ativo | Tabela de precos. |
| `src/components/Footer/Footer.css` | Ativo | Depoimentos, agendamento, contato, mapa, rodape e WhatsApp. |
| `src/components/CompraSite/CompraSite.css` | Ativo | Pagina de compra, carrinho, combos, formulario e responsividade da compra. |

## 14. Checklist rapido depois de alterar o projeto

Sempre que mexer em produto, carrinho, rota ou backend, rode:

```bash
npm run lint
npm run build
node --check server/dev.js
node --check server/server.js
```

Para conferir API manualmente:

```bash
curl http://127.0.0.1:3001/api/health
curl http://127.0.0.1:3001/api/catalog
```

## 15. Verificacao completa executada

Ultima verificacao: 2026-05-06.

### Resultado geral

O site React/Vite, a pagina `/compra`, o catalogo, o backend e o fluxo basico de pedido foram verificados por comando. A verificacao visual fina ainda deve ser feita no navegador, principalmente em celular, porque isso depende de olhar a interface renderizada.

### Comandos executados

| Verificacao | Resultado |
| --- | --- |
| `npm run lint` | Passou sem erros. |
| `npm run build` | Passou e gerou `dist/`. |
| `node --check server/server.js` | Passou sem erro de sintaxe. |
| `node --check server/dev.js` | Passou sem erro de sintaxe. |
| JSON de `server/data/catalog.json` | Valido. |
| JSON de `src/data/catalog.json` | Valido. |
| JSON de `server/data/orders.json` | Valido. |
| Comparacao `server/data/catalog.json` x `src/data/catalog.json` | Iguais no momento da verificacao. |
| `GET /` no Vite local | Respondeu 200. |
| `GET /compra` no Vite local | Respondeu 200. |
| `GET /api/catalog` via proxy do Vite | Respondeu 200. |
| `GET /api/health` em API temporaria | Respondeu 200. |
| `GET /api/catalog` em API temporaria | Respondeu 200. |
| `GET /api/orders` sem token | Respondeu 404, como esperado. |
| `GET /api/orders` com `x-admin-token` correto | Respondeu 200. |
| `POST /api/orders` invalido | Respondeu 400 com lista de erros. |
| `POST /api/orders` valido | Respondeu 201, recalculou o total pelo backend e salvou o pedido. |
| Simulacao serverless `VERCEL=1` com `api/[...path].js` | `POST /api/orders` respondeu 201. |
| `GET https://viacep.com.br/ws/01001000/json/` | Respondeu com dados de CEP. |

O pedido criado durante o teste foi removido de `server/data/orders.json` depois da verificacao.

### Pontos revisados

- Home carrega com Header, Hero, Sobre, Produtos, Compra, Espaco, Tabela e Footer.
- `/compra` carrega com Header, CompraSite e Footer sem formulario antigo de agendamento.
- Carrinho permite adicionar o mesmo produto mais de uma vez.
- Produtos comuns exigem quantidade e, quando configurado, recheio.
- Combos exigem que as categorias fechem exatamente a regra do catalogo.
- Forma de pagamento aparece e e obrigatoria somente para entrega.
- Campo de CEP consulta a ViaCEP e preenche endereco da entrega.
- Retirada exige dia, horario, pessoa que vai retirar e documento.
- Backend recalcula preco unitario, subtotal e total usando `server/data/catalog.json`.
- Rota publica de pedidos nao expoe `orders.json` sem token.
- CSS dos componentes esta separado ao lado de cada JSX.
- Pasta antiga com acento foi trocada para `src/components/Espaco`.

### Atencao antes de publicar

- Configure `ORDERS_ADMIN_TOKEN` no ambiente se for consultar pedidos pela rota `GET /api/orders`.
- Em deploy na Vercel, confirme que o projeto usa a pasta `chock-trufas-react` como root ou que o build aponta para ela.
- Para historico permanente de pedidos em producao, troque o JSON por banco de dados ou armazenamento externo.
- Se alterar produtos, mantenha `server/data/catalog.json` e `src/data/catalog.json` sincronizados.
- Faça uma passada visual no navegador em desktop e celular para confirmar espacos, rolagem do carrinho e formulario do rodape.
