"use client";

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateProfileSchema } from "@/lib/validators";
import { updateProfile } from "@/services/user.service";
import { toast } from "sonner";

type FormValues = {
  name?: string;
  imageBase64?: string | null;
};

export default function ProfilePage() {
  const { data: session, update } = useSession();

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(updateProfileSchema),
  });

  /**
   * Load initial values (name, profile image)
   */
  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || "",
      });

      setPreview(
        session.user.image ||
          "/default-profile.png" // Optional default
      );
    }
  }, [session, reset]);

  /**
   * Convert selected image file to base64
   */
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString() || null;
      setPreview(base64 || null);
      setValue("imageBase64", base64); // save into form
    };
    reader.readAsDataURL(file);
  }

  /**
   * Submit form: update profile
   */
  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const updatedUser = await updateProfile(data);

      toast.success("Profile updated successfully!");

      // Refresh NextAuth session so UI updates
      await update({
        ...session,
        user: {
          ...session?.user,
          name: updatedUser.name,
          image: updatedUser.image?.url,
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <Typography variant="h6" sx={{ mt: 5, textAlign: "center" }}>
        You must be logged in to view this page.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 5,
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" fontWeight={600} mb={3}>
        My Profile
      </Typography>

      <Stack spacing={3}>
        {/* Avatar preview */}
        <Box sx={{ textAlign: "center" }}>
          <Avatar
            src={preview || ""}
            alt="Profile"
            sx={{ width: 120, height: 120, mx: "auto", mb: 1 }}
          />
          <Button variant="outlined" component="label">
            Change photo
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
        </Box>

        {/* Name */}
        <TextField
          label="Name"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.toString()}
          fullWidth
        />

        {/* Email (readonly) */}
        <TextField
          label="Email"
          value={session.user.email}
          disabled
          fullWidth
        />

        {/* Submit */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </Stack>
    </Box>
  );
}
