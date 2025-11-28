import { NextResponse } from "next/server";
import * as yup from "yup";
import connect from "@/lib/db";
import { User } from "@/schemas/user.schema";
import { hashPassword } from "@/lib/bcrypt";
import { sendEmail } from "@/lib/mailer";

const registerSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await registerSchema.validate(body, { abortEarly: false });

    await connect();

    const exists = await User.findOne({ email: body.email });
    if (exists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await hashPassword(body.password);

    const user = await User.create({
      name: body.name,
      email: body.email,
      passwordHash,
      provider: "credentials",
      role: "client",
    });

    // Email bienvenida
    try {
      const html = `
        <p>Hola ${user.name},</p>
        <p>Bienvenid@ a nuestra tienda 🛒✨</p>
      `;
      await sendEmail(user.email, "¡Bienvenido/a!", html);
    } catch (err) {
      console.warn("Error enviando email:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
