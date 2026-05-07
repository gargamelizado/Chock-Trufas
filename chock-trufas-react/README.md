# Chock Trufas

Aplicação React + Vite com uma API Express simples para registrar pedidos pelo site.

## Documentação

A documentação completa do site, componentes, funções, rotas, backend e catálogo está em [`DOCUMENTACAO.md`](./DOCUMENTACAO.md).
Ela também contém a última verificação executada no projeto.

## Como rodar

```bash
npm install
npm run dev
```

O comando `npm run dev` sobe o frontend e o backend juntos:

- Site: `http://localhost:5173`
- API: `http://127.0.0.1:3001`

## Scripts

- `npm run dev`: abre frontend e backend no modo desenvolvimento.
- `npm run dev:web`: abre apenas o Vite.
- `npm run dev:api`: abre apenas a API.
- `npm run lint`: verifica problemas de código.
- `npm run build`: gera a versão de produção.
- `npm start`: serve a API e os arquivos gerados em `dist`.

## Dados

- Catálogo da API: `server/data/catalog.json`
- Catálogo base do frontend: `src/data/catalog.json`
- Pedidos registrados: `server/data/orders.json`

O Pacote Festa está configurado no catálogo como 100 salgadinhos, 50 docinhos, 1 bolo e 2 refrigerantes.
Cone trufado, Barra de Chocolate e Alfajor Maria exigem escolha de recheio no pedido.
Na entrega, o formulário possui busca de CEP pela ViaCEP para preencher rua, bairro, cidade e UF.

## Vercel

O deploy precisa incluir a pasta `api/`. Ela transforma o backend Express em função serverless para `/api/health`, `/api/catalog` e `/api/orders`.

Importante: em Vercel, pedido salvo em JSON não é armazenamento definitivo. A função consegue finalizar o pedido e abrir o WhatsApp, mas para histórico permanente o próximo passo é ligar banco de dados ou outro serviço de armazenamento.

## Verificação rápida

Depois de alterar o site, rode:

```bash
npm run lint
npm run build
node --check server/server.js
node --check server/dev.js
```
