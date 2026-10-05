
# Fresh Basket – MERN grocery store

## Run it

**Backend** (`/backend`)
```bash
cp .env.example .env     # fill in the values (or reuse your old .env)
npm install
npm run dev              # http://localhost:5000
```

**Frontend** (`/frontend`)
```bash
cp .env.example .env     # VITE_BACKEND_URL=http://localhost:5000
npm install
npm run dev              # http://localhost:5173
```

The seller dashboard is at `/seller` and uses `SELLER_EMAIL` / `SELLER_PASSWORD` from the backend `.env`.

## Customising
- Store name, currency symbol and tax % live in `client/src/config.js`
  (keep `TAX_PERCENT` in sync with `backend/controller/order.controller.js`).
- Colors and fonts are in `client/src/index.css` under `@theme`.


