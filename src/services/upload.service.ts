// src/services/upload.service.ts
import axios from "axios";

export type UploadedImage = {
  url: string;
  public_id: string;
};

export async function uploadImage(file: File): Promise<UploadedImage> {
  const fd = new FormData();
  fd.append("file", file);

  const { data } = await axios.post<UploadedImage>("/api/upload", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
