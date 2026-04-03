import nodemailer from "nodemailer";

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
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const name = (body?.name || "").trim();
    const message = (body?.message || "").trim();

    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required." });
    }

    const smtpHost = pickEnv("SMTP_HOST") || "smtp.gmail.com";
    const smtpPort = Number(pickEnv("SMTP_PORT") || 465);
    const smtpUser = pickEnv("SMTP_USER", "EMAIL_USER") || getRequiredEnv("EMAIL_USER");
    const smtpPass = pickEnv("SMTP_PASS", "EMAIL_PASS") || getRequiredEnv("EMAIL_PASS");
    const contactTo = pickEnv("CONTACT_TO_EMAIL", "EMAIL_TO") || getRequiredEnv("EMAIL_TO");

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: pickEnv("CONTACT_FROM_EMAIL", "EMAIL_USER") || smtpUser,
      to: contactTo,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\n\nMessage:\n${message}`,
      html: `
        <h2>New Portfolio Contact</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ error: "Unable to send email right now." });
  }
}
