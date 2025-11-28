// src/components/ui/ImageUploader.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@mui/material";

type Props = {
  onUploaded: (data: { url: string; public_id: string }) => void;
};

export default function ImageUploader({ onUploaded }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setLoading(true);
      try {
        const res = await fetch("/api/uploads/cloudinary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });
        const json = await res.json();
        if (res.ok) {
          onUploaded(json);
        } else {
          console.error("Upload failed", json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <input accept="image/*" type="file" id="file" style={{ display: "none" }} onChange={handleFile} />
      <label htmlFor="file">
        <Button component="span" variant="contained">{loading ? "Uploading..." : "Upload image"}</Button>
      </label>
    </div>
  );
}
