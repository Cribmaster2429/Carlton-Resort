import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// One SQLite file under server/data/ (gitignored), created on first run. DB_PATH overrides it, useful for tests.
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "data");
mkdirSync(dir, { recursive: true });

export const db = new DatabaseSync(process.env.DB_PATH || path.join(dir, "carlton.db"));

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS subscribers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel      TEXT NOT NULL,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    check_in   TEXT NOT NULL,
    check_out  TEXT NOT NULL,
    guests     INTEGER NOT NULL,
    status     TEXT NOT NULL DEFAULT 'requested',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);
