# Chock Trufas

Aplicação React + Vite com uma API Express simples para registrar pedidos pelo site.

## Documentação

A documentação completa do site, componentes, funções, rotas, backend e catálogo está em [`DOCUMENTACAO.md`](./DOCUMENTACAO.md).

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

- Catálogo: `server/data/catalog.json`
- Pedidos registrados: `server/data/orders.json`

O Pacote Festa está configurado no catálogo como 100 salgadinhos, 40 docinhos, 1 bolo e 2 refrigerantes.
Cone trufado, Barra de Chocolate e Alfajor Maria exigem escolha de recheio no pedido.
