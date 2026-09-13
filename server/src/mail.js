import nodemailer from "nodemailer";

// Outbound mail through any SMTP account (a Gmail App Password works). See .env.example.
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
const configured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

const transport = configured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

if (!configured) console.log("Mail: SMTP not configured, emails will be logged instead of sent");

// Never throws and never blocks a response. Returns true only when the message was accepted.
export async function sendMail({ to, subject, text }) {
  if (!transport) {
    console.log(`Mail (not sent) to ${to}: ${subject}`);
    return false;
  }
  try {
    await transport.sendMail({ from: MAIL_FROM || SMTP_USER, to, subject, text });
    return true;
  } catch (err) {
    console.error(`Mail failed to ${to}: ${err.message}`);
    return false;
  }
}

export const welcomeMail = (to) => ({
  to,
  subject: "You are on the Carlton Resort list",
  text: [
    "Thank you for signing up.",
    "",
    "We send a few emails a year: offers first, then the occasional note about what is new at the resort.",
    "",
    "Carlton Resort, North Shore, Solmera Cay",
  ].join("\n"),
});

export const reservationMail = ({ to, name, stay, checkIn, checkOut, guests, id }) => ({
  to,
  subject: `Reservation request #${id} received, ${stay}`,
  text: [
    `Dear ${name},`,
    "",
    `We have received your request for ${stay}, ${checkIn} to ${checkOut}, ${guests} guest${guests === 1 ? "" : "s"}.`,
    `Your reference is #${id}. We will confirm availability by email shortly. No payment has been taken.`,
    "",
    "Carlton Resort, North Shore, Solmera Cay",
  ].join("\n"),
});
