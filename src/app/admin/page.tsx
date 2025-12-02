"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";

export default function AdminDashboard() {
  const router = useRouter();

  const cards = [
    {
      title: "Products",
      icon: <Inventory2RoundedIcon sx={{ fontSize: 48 }} />,
      action: () => router.push("/admin/products"),
    },
    {
      title: "Categories",
      icon: <CategoryRoundedIcon sx={{ fontSize: 48 }} />,
      action: () => router.push("/admin/categories"),
    },
    {
      title: "Orders",
      icon: <LocalMallRoundedIcon sx={{ fontSize: 48 }} />,
      action: () => router.push("/admin/orders"),
    },
    {
      title: "Users",
      icon: <GroupRoundedIcon sx={{ fontSize: 48 }} />,
      action: () => router.push("/admin/users"),
    },
  ];

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: 3, py: 6 }}>
      {/* TITLE */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 4,
          pb: 1,
          borderBottom: "2px solid #e5e5e5",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        Admin Dashboard
      </Typography>

      {/* GRID */}
      <Grid container spacing={4}>
        {cards.map((card, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              onClick={card.action}
              sx={{
                cursor: "pointer",
                borderRadius: "18px",
                px: 1,
                py: 1,
                border: "1px solid #f0f0f0",
                background: "white",
                boxShadow:
                  "0px 4px 12px rgba(0, 0, 0, 0.04), 0px 1px 3px rgba(0, 0, 0, 0.06)",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent
                sx={{
                  textAlign: "center",
                  py: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    color: "#111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {card.icon}
                </Box>

                <Typography
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    fontSize: "1rem",
                  }}
                >
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
