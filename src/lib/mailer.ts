// src/lib/mailer.ts
import nodemailer from "nodemailer";

/**
 * Nodemailer transporter using environment SMTP settings
 */
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465, // TLS Gmail/Outlook
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Generic function to send emails
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Ecommerce";

  const from = `"${appName}" <${process.env.SMTP_USER}>`;

  const mailOptions = {
    from,
    to,
    subject,
    html,
    text,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

/**
 * Helper for welcome email (optional)
 */
export async function sendWelcomeEmail(to: string, name: string) {
  const html = `
    <h2>Hola ${name} 👋</h2>
    <p>¡Gracias por registrarte en nuestra tienda!</p>
    <p>Estamos felices de tenerte con nosotros 😄</p>
  `;

  return sendEmail(to, "¡Bienvenido a la tienda!", html);
}

export default transporter;
