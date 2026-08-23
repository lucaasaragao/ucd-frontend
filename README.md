# UCD Frontend

Frontend (React + Vite + TypeScript + Tailwind) do MVP da UCD, consumindo a API em [ucd](https://github.com/lucaasaragao/ucd).

## Rodando localmente

```bash
npm install
cp .env.example .env   # ajuste VITE_API_URL se necessário
npm run dev
```

Requer o backend rodando (por padrão em `http://localhost:8080`, veja `.env.example`).

## Fluxo coberto

- Login / criar conta (atleta ou organizador)
- Listagem e detalhe de eventos publicados
- Inscrição em uma categoria do evento (atleta)
- Minhas inscrições, com status de pagamento (simulado) e resultado, quando disponível
