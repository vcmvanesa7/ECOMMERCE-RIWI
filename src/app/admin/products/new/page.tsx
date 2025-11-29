"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { productSchema, ProductFormValues } from "@/lib/validators";
import { createProduct } from "@/services/products.service";

import { toast } from "sonner";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import styles from "./ProductForm.module.css";

export default function CreateProductPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  }: UseFormReturn<ProductFormValues> = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema) as any,
    defaultValues: {
      colors: [],
      sizes: [],
      variants: [],
      images: [],
    },
  });

  const colors = watch("colors") || [];
  const sizes = watch("sizes") || [];
  const imagesWatch = watch("images") || [];

  const {
    fields: variants,
    append: addVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variants" });

  const {
    fields: images,
    append: addImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await createProduct(data);
      toast.success("Producto creado correctamente");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Error creando producto");
    }
  };

  return (
    <Box className={styles.container}>
      <div className={styles.backRow}>
        <IconButton
          onClick={() => router.push("/admin/products")}
          className={styles.backButton}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      </div>
      <Typography className={styles.title}>Crear Producto</Typography>

      {/* General Info */}
      <Box className={styles.section}>
        <Typography className={styles.sectionTitle}>
          Información General
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Title"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <TextField
            label="Brand"
            {...register("brand")}
            error={!!errors.brand}
            helperText={errors.brand?.message}
          />

          <TextField
            label="Category"
            {...register("category")}
            error={!!errors.category}
            helperText={errors.category?.message}
          />

          <Stack direction="row" spacing={3}>
            <TextField
              label="Price"
              type="number"
              {...register("price")}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <TextField
              label="Discount (%)"
              type="number"
              {...register("discount")}
              error={!!errors.discount}
              helperText={errors.discount?.message}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Colors */}
      <Box className={styles.section}>
        <Typography className={styles.sectionTitle}>Colores</Typography>

        <input
          className={styles.colorInput}
          type="text"
          placeholder="#000000"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const hex = (e.target as HTMLInputElement).value.trim();
              if (!hex) return;

              if (!/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
                toast.error("Color inválido");
                return;
              }
              setValue("colors", [...colors, hex]);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />

        <Stack direction="row" gap={1} flexWrap="wrap">
          {colors.map((color, i) => (
            <Chip
              key={i}
              label={color}
              onDelete={() =>
                setValue(
                  "colors",
                  colors.filter((_, idx) => idx !== i)
                )
              }
              sx={{ backgroundColor: color, color: "#fff" }}
            />
          ))}
        </Stack>
      </Box>

      {/* Sizes */}
      <Box className={styles.section}>
        <Typography className={styles.sectionTitle}>Tallas</Typography>

        <input
          className={styles.sizeInput}
          placeholder="S, M, L..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const size = (e.target as HTMLInputElement).value.trim();
              if (!size) return;

              setValue("sizes", [...sizes, size]);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />

        <Stack direction="row" gap={1} flexWrap="wrap">
          {sizes.map((size, i) => (
            <Chip
              key={i}
              label={size}
              onDelete={() =>
                setValue(
                  "sizes",
                  sizes.filter((_, idx) => idx !== i)
                )
              }
            />
          ))}
        </Stack>
      </Box>

      {/* Variants */}
      <Box className={styles.section}>
        <Typography className={styles.sectionTitle}>Variantes</Typography>

        {variants.map((field, index) => (
          <div key={field.id} className={styles.variantRow}>
            <TextField label="Color" {...register(`variants.${index}.color`)} />
            <TextField label="Size" {...register(`variants.${index}.size`)} />
            <TextField
              label="Stock"
              type="number"
              {...register(`variants.${index}.stock`)}
            />
            <IconButton onClick={() => removeVariant(index)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}

        <Button onClick={() => addVariant({ color: "", size: "", stock: 0 })}>
          Añadir variante
        </Button>
      </Box>

      {/* Images */}
      <Box className={styles.section}>
        <Typography className={styles.sectionTitle}>Imágenes</Typography>

        {/* Imagenes mostradas horizontalmente */}
        <div className={styles.horizontalList}>
          {images.map((img, index) => (
            <div key={img.id} className={styles.imageStack}>
              {imagesWatch[index]?.url && (
                <Image
                  src={imagesWatch[index].url}
                  alt="Preview"
                  width={100}
                  height={100}
                  className={styles.imagePreview}
                />
              )}

              <IconButton onClick={() => removeImage(index)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>

        <Button
          variant="outlined"
          component="label"
          className={styles.uploadLabel}
          disabled={uploading}
        >
          Subir imagen
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              setUploading(true);

              const formData = new FormData();
              formData.append("file", file);

              const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              const uploaded = await res.json();

              addImage({
                url: uploaded.url,
                public_id: uploaded.public_id,
              });

              setUploading(false);
            }}
          />
        </Button>
      </Box>

      <Button
        variant="contained"
        size="large"
        className={styles.submitButton}
        onClick={handleSubmit(onSubmit)}
      >
        Crear Producto
      </Button>
    </Box>
  );
}
