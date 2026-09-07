import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100).refine((value) => !/[\r\n]/.test(value)),
  email: z.string().trim().max(254).email(),
  message: z.string().trim().min(10).max(5000),
});

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function pickEnv(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (value) {
      return value;
    }
  }
  return undefined;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body;
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch {
      return res.status(400).json({ error: "Request must contain valid JSON." });
    }
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Provide a name (1–100 characters), valid reply email (up to 254 characters), and message (10–5000 characters)." });
    }
    const { name, email, message } = parsed.data;

    const smtpHost = pickEnv("SMTP_HOST") || "smtp.gmail.com";
    const smtpPort = Number(pickEnv("SMTP_PORT") || 465);
    const smtpUser = pickEnv("SMTP_USER", "EMAIL_USER") || getRequiredEnv("EMAIL_USER");
    const smtpPass = pickEnv("SMTP_PASS", "EMAIL_PASS") || getRequiredEnv("EMAIL_PASS");
    const contactTo = pickEnv("CONTACT_TO_EMAIL", "EMAIL_TO") || getRequiredEnv("EMAIL_TO");

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: pickEnv("CONTACT_FROM_EMAIL", "EMAIL_USER") || smtpUser,
      to: contactTo,
      subject: `Portfolio contact from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nReply email: ${email}\n\nMessage:\n${message}`,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ error: "Delivery could not be confirmed. Please wait before trying again; the message may already have been sent." });
  }
}
