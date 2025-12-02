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
import Image from "next/image";

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
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1400,
          mx: "auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* LOGO */}
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => router.push("/")}
        >
          <Image
            src="/logs/Horizontal.png"
            alt="KOI Logo"
            width={75}
            height={30}
            priority
            className="opacity-90 hover:opacity-100 transition"
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* CARRITO */}
        <IconButton
          color="inherit"
          onClick={() => router.push("/cart")}
          sx={{ mr: 2 }}
        >
          <Badge
            badgeContent={itemsCount}
            sx={{ "& .MuiBadge-badge": { backgroundColor: "#111" } }}
          >
            <ShoppingCartIcon sx={{ color: "#111" }} />
          </Badge>
        </IconButton>

        {/* AUTH BUTTONS */}
        {!isLoggedIn ? (
          <>
            <Button
              onClick={() => router.push("/auth/login")}
              sx={{
                color: "#111",
                fontWeight: 600,
                textTransform: "none",
                mx: 1,
              }}
            >
              Login
            </Button>

            <Button
              onClick={() => router.push("/auth/register")}
              sx={{
                bgcolor: "#111",
                color: "#fff",
                px: 2.5,
                borderRadius: "8px",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              Register
            </Button>
          </>
        ) : (
          <>
            {/* USER */}
            <Typography sx={{ mr: 1, fontWeight: 500 }}>
              {session?.user?.name}
            </Typography>

            <Button
              onClick={() => router.push("/profile")}
              sx={{ textTransform: "none" }}
            >
              Profile
            </Button>

            {role === "admin" && (
              <Button
                onClick={() => router.push("/admin")}
                sx={{ textTransform: "none" }}
              >
                Panel Admin
              </Button>
            )}

            <Button onClick={handleLogout} sx={{ textTransform: "none" }}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
