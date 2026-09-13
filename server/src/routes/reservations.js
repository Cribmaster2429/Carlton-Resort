import { Router } from "express";
import { db } from "../db.js";
import { findStay } from "../stays.js";
import { isEmail, normalizeEmail, parseIsoDate, todayIso } from "../validate.js";
import { sendMail, reservationMail } from "../mail.js";

const router = Router();
const insert = db.prepare(
  "INSERT INTO reservations (hotel, name, email, check_in, check_out, guests) VALUES (?, ?, ?, ?, ?, ?)"
);

router.post("/", (req, res) => {
  const b = req.body ?? {};
  const stay = findStay(b.hotel);
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = normalizeEmail(b.email);
  const checkIn = parseIsoDate(b.checkIn);
  const checkOut = parseIsoDate(b.checkOut);
  const guests = b.guests;

  if (!stay) return res.status(400).json({ error: "Please choose a stay" });
  if (!name || !isEmail(email)) return res.status(400).json({ error: "Please enter your name and a valid email address" });
  if (!checkIn || !checkOut) return res.status(400).json({ error: "Please enter valid dates" });
  if (checkIn < todayIso()) return res.status(400).json({ error: "Check in cannot be in the past" });
  if (checkOut <= checkIn) return res.status(400).json({ error: "Check out must be after check in" });
  if (!Number.isInteger(guests) || guests < 1 || guests > 10) return res.status(400).json({ error: "Guests must be between 1 and 10" });

  const id = Number(insert.run(stay.slug, name, email, checkIn, checkOut, guests).lastInsertRowid);
  sendMail(reservationMail({ to: email, name, stay: stay.title, checkIn, checkOut, guests, id }));
  res.status(201).json({ ok: true, id });
});

export default router;
