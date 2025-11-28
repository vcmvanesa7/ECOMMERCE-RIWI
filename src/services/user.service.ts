// src/services/user.service.ts
import axios from "axios";

/**
 * Update profile service
 * Email is NEVER sent — NextAuth session defines the user identity.
 */
export async function updateProfile(data: {
  name?: string;
  imageBase64?: string | null;
}) {
  try {
    const res = await axios.put("/api/users/update-profile", data);
    return res.data.user; // return updated user safely
  } catch (error: any) {
    // Extract clean error message
    const message =
      error.response?.data?.error || "Failed to update profile.";

    throw new Error(message);
  }
}
