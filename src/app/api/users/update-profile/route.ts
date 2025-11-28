// src/app/api/users/update-profile/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { User } from "@/schemas/user.schema";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session as any).user.id;
  const body = await req.json();
  const { imageBase64, imageUrl } = body;
  await connect();

  let imageData = null;
  if (imageBase64) {
    // upload base64 directly
    const upload = await cloudinary.uploader.upload(imageBase64, { folder: "users" });
    imageData = { url: upload.secure_url, public_id: upload.public_id };
  } else if (imageUrl) {
    const upload = await cloudinary.uploader.upload(imageUrl, { folder: "users" });
    imageData = { url: upload.secure_url, public_id: upload.public_id };
  }

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // delete previous image if exists
  if (user.image?.public_id) {
    try {
      await cloudinary.uploader.destroy(user.image.public_id);
    } catch (err) {
      console.warn("Failed to remove old image", err);
    }
  }

  user.image = imageData;
  await user.save();
  return NextResponse.json({ user });
}
