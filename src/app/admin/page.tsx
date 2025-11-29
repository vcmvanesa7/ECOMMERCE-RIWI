"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";

export default function AdminDashboard() {
  const router = useRouter();

  const cards = [
    {
      title: "Products",
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      action: () => router.push("/admin/products"),
    },
    {
      title: "Orders",
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      action: () => router.push("/admin/orders"),
    },
    {
      title: "Users",
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      action: () => router.push("/admin/users"),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((c, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "0.3s",
                ":hover": { transform: "scale(1.04)" },
              }}
              onClick={c.action}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                {c.icon}
                <Typography variant="h6" fontWeight={600} mt={2}>
                  {c.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
