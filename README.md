# Carlton Resort

Website for a luxury resort on Solmera Cay. React front end, Express API, SQLite storage, one repo.

```
Carlton-Resort/
  client/    React 19 + Vite 7 (src/, public/, index.html, vite.config.js)
  server/    Express 5 + SQLite via node:sqlite (src/index.js, src/routes/, data/)
```

## Requirements

Node 22.13 or newer (the API uses the built in SQLite module).

## Setup

```bash
npm install      # installs root, client and server
npm run dev      # Vite on http://localhost:3000 plus the API on port 4000
```

Vite proxies `/api` to the API in development, so the front end only ever uses relative URLs.

## Production

```bash
npm run build    # builds client/dist
npm start        # one Express process on port 4000 serving the build and the API
```

The database is created on first run at `server/data/carlton.db` and is not committed.

## API

```
+---------------------------+-----------------------------------------------------------------+
| Endpoint                  | Body                                                            |
+---------------------------+-----------------------------------------------------------------+
| GET  /api/health          |                                                                 |
| POST /api/subscribe       | { email }                                                       |
| POST /api/reservations    | { hotel (stay slug), name, email, checkIn, checkOut, guests }   |
+---------------------------+-----------------------------------------------------------------+
```

Errors come back as `{ "error": "message" }` with a 4xx status.

## Status

Done: home page, stay list and stay pages, newsletter and reservation requests stored in SQLite,
all photos and the hero video served locally with sources in `client/public/images/CREDITS.md`.

Open: sign in and accounts (the modal exists, no auth endpoints yet), real availability and
pricing, payment, email confirmations, and responsive layouts for phones and tablets.
