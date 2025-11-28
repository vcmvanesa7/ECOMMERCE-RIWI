// src/components/products/ProductCard.tsx
"use client";
import React from "react";
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import { useCart } from "@/context/cart-context";

type Props = {
  id: string;
  title: string;
  price: number;
  image?: string;
};

export default function ProductCard({ id, title, price, image }: Props) {
  const { addItem } = useCart();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" height="140" image={image} alt={title} />
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="subtitle1">${price.toFixed(2)}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => addItem(id, 1)}>Add to cart</Button>
      </CardActions>
    </Card>
  );
}
