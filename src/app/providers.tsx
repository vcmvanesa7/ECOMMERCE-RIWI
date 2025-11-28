"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "sonner";
import theme from "@/styles/theme";
import { CartProvider } from "@/context/cart-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Toaster richColors position="top-right" />
        {children}
      </CartProvider>
    </ThemeProvider>
  );
}
