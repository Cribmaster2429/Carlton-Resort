import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subscribe from "./routes/subscribe.js";
import reservations from "./routes/reservations.js";

const app = express();
const PORT = process.env.PORT || 4000;
const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "client", "dist");

app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/subscribe", subscribe);
app.use("/api/reservations", reservations);
app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

// npm start passes --serve-client: the Vite build plus an SPA fallback for page navigations. Asset misses stay 404.
// In dev the site lives on Vite (port 3000), so this process answers API calls only.
if (process.argv.includes("--serve-client")) {
  app.use(express.static(clientDist));
  app.get(/.*/, (req, res, next) => {
    if (path.extname(req.path) || !req.accepts("html")) return next();
    res.sendFile(path.join(clientDist, "index.html"), (err) => {
      if (err) res.status(503).type("text/plain").send("Client build not found. Run npm run build first.");
    });
  });
} else {
  app.get(/.*/, (req, res, next) => {
    if (!req.accepts("html")) return next();
    res.status(404).type("text/plain").send("Carlton Resort API. In development the site is served by Vite on http://localhost:3000/");
  });
}

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  const error = err.type === "entity.parse.failed" ? "Invalid JSON"
    : status === 413 ? "Request too large"
    : status >= 500 ? "Server error"
    : "Bad request";
  res.status(status).json({ error });
});

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
