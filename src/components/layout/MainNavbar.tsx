"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Badge,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "@/context/cart-context";

export default function MainNavbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cart } = useCart();

  const itemsCount =
    cart?.items?.reduce((acc, item) => acc + (item.qty ?? 0), 0) ?? 0;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const isLoggedIn = status === "authenticated";
  const role = (session?.user as any)?.role;

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
        {/* Logo / brand */}
        <Box
          sx={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          <Typography variant="h6" fontWeight={700}>
            Koy Style
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Link carrito */}
        <IconButton
          color="inherit"
          onClick={() => router.push("/cart")}
          sx={{ mr: 2 }}
        >
          <Badge badgeContent={itemsCount} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* Si no está logueado: Login / Register */}
        {!isLoggedIn && (
          <>
            <Button
              color="inherit"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </Button>
            <Button
              color="primary"
              variant="contained"
              sx={{ ml: 1 }}
              onClick={() => router.push("/auth/register")}
            >
              Register
            </Button>
          </>
        )}

        {/* Si está logueado: Perfil / Admin / Logout */}
        {isLoggedIn && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {(session?.user?.name as string) ?? "User"}
            </Typography>

            <Button
              color="inherit"
              onClick={() => router.push("/profile")}
            >
              Profile
            </Button>

            {role === "admin" && (
              <Button
                color="inherit"
                onClick={() => router.push("/admin")}
              >
                Dashboard Admin
              </Button>
            )}

            <Button
              color="inherit"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
