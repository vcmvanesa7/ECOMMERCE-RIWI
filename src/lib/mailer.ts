// src/lib/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string, text?: string) {
  const info = await transporter.sendMail({
    from: `"${process.env.NEXT_PUBLIC_APP_NAME || "Ecommerce"}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text: text || undefined,
    html,
  });
  return info;
}
