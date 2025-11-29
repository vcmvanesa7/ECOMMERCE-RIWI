"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "sonner";
import theme from "@/styles/theme";     
import { CartProvider } from "@/context/cart-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <CartProvider>
          {/* Notifications */}
          <Toaster richColors position="top-right" />

          {children}
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
