"use client";

import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "@/services/products.service";
import {
  Box, Typography, Table, TableBody, TableCell, TableHead,
  TableRow, IconButton, Button
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProductsListPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar producto?")) return;
    await deleteProduct(id);
    toast.success("Producto eliminado");
    loadProducts();
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Productos
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => router.push("/admin/products/new")}
      >
        Crear Producto
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Marca</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((p: any) => (
            <TableRow key={p._id}>
              <TableCell>{p.title}</TableCell>
              <TableCell>{p.brand}</TableCell>
              <TableCell>${p.price}</TableCell>
              <TableCell>{p.status}</TableCell>

              <TableCell align="right">
                <IconButton onClick={() => router.push(`/admin/products/edit/${p._id}`)}>
                  <EditIcon />
                </IconButton>

                <IconButton color="error" onClick={() => remove(p._id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
