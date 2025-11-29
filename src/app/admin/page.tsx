"use client";

import styles from "./Dashboard.module.css";

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
      icon: <InventoryIcon className={styles.icon} />,
      action: () => router.push("/admin/products"),
    },
    {
      title: "Orders",
      icon: <ShoppingCartIcon className={styles.icon} />,
      action: () => router.push("/admin/orders"),
    },
    {
      title: "Users",
      icon: <PeopleIcon className={styles.icon} />,
      action: () => router.push("/admin/users"),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography className={styles.title}>Admin Dashboard</Typography>

      <Grid container spacing={3} className={styles.grid}>
        {cards.map((c, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Card
              className={styles.card}
              onClick={c.action}
            >
              <CardContent className={styles.cardContent}>
                {c.icon}

                <Typography className={styles.cardTitle}>
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
