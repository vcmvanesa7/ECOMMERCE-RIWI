// src/services/user.service.ts
import axios from "axios";
import type { UpdateProfileValues } from "@/lib/validators";

export type UpdatedUser = {
  id: string;
  email: string;
  name?: string;
  image?: {
    url: string;
    public_id: string;
  } | null;
};

/**
 * Calls API to update current user's profile.
 * Returns the updated user object.
 */
export async function updateProfile(data: {
  name?: string;
  imageBase64?: string | null;
}) {
  const res = await axios.put("/api/users/update-profile", data);
  return res.data.user; 
}
