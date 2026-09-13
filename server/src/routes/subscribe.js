import { Router } from "express";
import { db } from "../db.js";
import { isEmail, normalizeEmail } from "../validate.js";

const router = Router();
const insert = db.prepare("INSERT INTO subscribers (email) VALUES (?) ON CONFLICT(email) DO NOTHING");

router.post("/", (req, res) => {
  const email = normalizeEmail(req.body?.email);
  if (!isEmail(email)) return res.status(400).json({ error: "Please enter a valid email address" });

  const { changes } = insert.run(email);
  res.status(changes ? 201 : 200).json({ ok: true, already: !changes });
});

export default router;
