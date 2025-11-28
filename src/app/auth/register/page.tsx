"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema, RegisterFormValues } from "@/schemas/auth/registerSchema";
import { TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });

  const router = useRouter();

  async function onSubmit(data: RegisterFormValues) {
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to register");
        return;
      }

      toast.success("Registered! Please login.");
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        fullWidth
        sx={{ mt: 2 }}
      >
        Register
      </Button>
    </form>
  );
}
