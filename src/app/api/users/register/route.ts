// src/app/api/users/register/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { User } from "@/schemas/user.schema";
import { hashPassword } from "@/lib/bcrypt";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await connect();
    const exists = await User.findOne({ email }).lean();
    if (exists) return NextResponse.json({ error: "User already exists" }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const user = await User.create({ name, email, passwordHash });

    // Send welcome email (non-blocking recommended, but we do simple await for MVP)
    const html = `<p>Hi ${name || ""}, welcome to ${process.env.NEXT_PUBLIC_APP_NAME || "our store"}!</p>`;
    try {
      await sendEmail(email, "Welcome", html);
    } catch (err) {
      console.warn("Failed to send welcome email:", err);
    }

    // Return minimal user (do not send passwordHash)
    return NextResponse.json({ user: { id: user._id, email: user.email, name: user.name } }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
