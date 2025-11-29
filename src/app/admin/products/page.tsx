"use client";

import { useEffect, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import styles from "../products/[id]/edit/editProductForm.module.css";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useRouter } from "next/navigation";
import {
  getProductsFiltered,
  deleteProduct,
} from "@/services/products.service";
import Image from "next/image";
import { toast } from "sonner";

// Debounce
function useDebounce(value: string, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function ProductsListPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const debouncedSearch = useDebounce(search);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsFiltered({
        page,
        limit,
        search: debouncedSearch,
        category,
        sort,
      });

      setProducts(data.items);
      setTotalPages(data.pages);
    } catch (err) {
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, category, sort]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;

    try {
      await deleteProduct(id);
      toast.success("Producto eliminado");
      loadProducts();
    } catch {
      toast.error("Error eliminando producto");
    }
  };

  return (
    <Box p={3}>
      <IconButton
        onClick={() => router.push("/admin")}
        className={styles.backButton}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <Typography variant="h4" fontWeight="700" mb={4}>
        Productos
      </Typography>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          label="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 250 }}
        />

        <TextField
          select
          label="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="ropa">Ropa</MenuItem>
          <MenuItem value="zapatos">Zapatos</MenuItem>
          <MenuItem value="electronica">Electrónica</MenuItem>
        </TextField>

        <TextField
          select
          label="Ordenar por"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="newest">Más recientes</MenuItem>
          <MenuItem value="price_asc">Precio menor</MenuItem>
          <MenuItem value="price_desc">Precio mayor</MenuItem>
        </TextField>

        <Button
          variant="contained"
          onClick={() => router.push("/admin/products/new")}
        >
          Crear Producto
        </Button>
      </Stack>

      {/* Loading */}
      {loading ? (
        <Box p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imagen</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>
                  {p.images?.[0]?.url && (
                    <Image
                      src={p.images[0].url}
                      alt={p.title}
                      width={60}
                      height={60}
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                  )}
                </TableCell>

                <TableCell>{p.title}</TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell>{p.category}</TableCell>

                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => router.push(`/admin/products/${p._id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton color="error" onClick={() => handleDelete(p._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      <Stack direction="row" spacing={1} mt={3}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i}
            variant={page === i + 1 ? "contained" : "outlined"}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
