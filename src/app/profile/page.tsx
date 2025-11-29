// src/app/profile/page.tsx
"use client";

import {
  Box,
  Button,
  Stack,
  Typography,
  Avatar,
  Modal,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  updateProfileSchema,
  UpdateProfileValues,
} from "@/lib/validators";
import { updateProfile } from "@/services/user.service";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, update } = useSession();

  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // RHF form using Yup schema type
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileValues>({
    // si el tipado molesta, se puede quitar el "as any"
    resolver: yupResolver(updateProfileSchema) as any,
    defaultValues: { name: "", imageBase64: null },
  });

  /**
   * Load initial session data (name + image)
   */
  useEffect(() => {
    if (!session?.user) return;

    reset({
      name: session.user.name || "",
      imageBase64: null,
    });

    // si no hay imagen, dejamos null y el Avatar muestra las iniciales
    setPreview(
      typeof session.user.image === "string" ? session.user.image : null
    );
  }, [session, reset]);

  /**
   * Convert selected file to base64 and store it in the form
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString() || null;
      setPreview(base64);
      setValue("imageBase64", base64);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Submit profile changes to API
   */
  const onSubmit = async (data: UpdateProfileValues) => {
    try {
      setLoading(true);

      // call API -> get updated user
      const user = await updateProfile(data);

      toast.success("Profile updated successfully!");

      // update NextAuth session (name + image URL from Cloudinary)
      await update({
        ...session,
        user: {
          ...session?.user,
          name: user.name,
          image: user.image?.url ?? session?.user?.image,
        },
      });

      // update local preview with Cloudinary URL, if we have it
      if (user.image?.url) {
        setPreview(user.image.url);
      }

      setOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <Typography textAlign="center" mt={5}>
        You must be logged in to view this page.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: "auto",
        mt: 6,
        p: 4,
        borderRadius: 3,
        boxShadow: 4,
      }}
    >
      {/* Header */}
      <Typography variant="h4" fontWeight={700} mb={4}>
        My Account
      </Typography>

      {/* User summary card */}
      <Stack direction="row" spacing={3} alignItems="center">
        <Avatar
          src={preview ?? undefined}
          sx={{ width: 120, height: 120, fontSize: 40 }}
        >
          {/* Fallback initials if no image */}
          {session.user.name?.[0]?.toUpperCase()}
        </Avatar>

        <Box>
          <Typography variant="h6">{session.user.name}</Typography>
          <Typography color="text.secondary">
            {session.user.email}
          </Typography>

          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => setOpen(true)}
          >
            Edit Profile
          </Button>
        </Box>
      </Stack>

      {/* Future activity section */}
      <Box mt={5}>
        <Typography variant="h6" fontWeight={600}>
          Your Activity
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Soon you will see your orders, favorite products and more 🎁
        </Typography>
      </Box>

      {/* ================= MODAL: EDIT PROFILE ================= */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            backgroundColor: "#fff",
            maxWidth: 450,
            mx: "auto",
            mt: 10,
            p: 4,
            borderRadius: 3,
            boxShadow: 10,
          }}
        >
          <Typography variant="h6" mb={3} fontWeight={600}>
            Edit Profile
          </Typography>

          <Stack spacing={3}>
            <Avatar
              src={preview ?? undefined}
              sx={{ width: 100, height: 100, mx: "auto", fontSize: 36 }}
            >
              {session.user.name?.[0]?.toUpperCase()}
            </Avatar>

            <Button variant="outlined" component="label">
              Change photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            <TextField
              label="Name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            {/* Email read-only outside del form */}
            <TextField
              label="Email"
              fullWidth
              value={session.user.email || ""}
              disabled
            />

            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
              startIcon={loading ? <CircularProgress size={18} /> : null}
            >
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
