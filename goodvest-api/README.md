# Goodvest API

API Express + TypeScript strict + Prisma + Zod pour le parcours de souscription CIF.

## Pré-requis
- Node.js 18+

## Setup
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Endpoints principaux
- `POST /api/subscriptions` -> création utilisateur + subscription
- `PUT /api/subscriptions/:id/simulation`
- `PUT /api/subscriptions/:id/financial`
- `PUT /api/subscriptions/:id/risk`
- `PUT /api/subscriptions/:id/portfolio`
- `PUT /api/subscriptions/:id/compliance`
- `PUT /api/subscriptions/:id/identity`
- `PUT /api/subscriptions/:id/legal`

## Notes
- Les montants sont traités avec Decimal (decimal.js)
- Les validations sont centralisées dans `src/schemas/subscription.ts`
