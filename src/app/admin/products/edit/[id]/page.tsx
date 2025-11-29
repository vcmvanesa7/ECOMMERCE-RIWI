"use client";

import {
  Box, Button, TextField, Typography,
  Stack, Chip, IconButton
} from "@mui/material";

import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  productSchema,
  ProductFormValues,
} from "@/lib/validators";

import {
  getProductById,
  updateProduct
} from "@/services/products.service";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema) as any,
  });

  // ARRAY FIELDS
  const { fields: variants, append: addVariant, remove: removeVariant } =
    useFieldArray({ control, name: "variants" });

  const { fields: images, append: addImage, remove: removeImage } =
    useFieldArray({ control, name: "images" });

  // LOAD PRODUCT BY ID
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await getProductById(id as string);

        // Preload form
        reset(product);
      } catch {
        toast.error("Error loading product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, reset]);

  if (loading) return <Typography p={4}>Loading...</Typography>;

  // SUBMIT
  const onSubmit = async (data: ProductFormValues) => {
    try {
      await updateProduct(id as string, data);
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Error updating product");
    }
  };

  return (
    <Box maxWidth={800} mx="auto" p={4}>
      <Typography variant="h4" mb={4} fontWeight={700}>
        Edit Product
      </Typography>

      <Stack spacing={3}>

        {/* Title */}
        <TextField
          label="Title"
          {...register("title")}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        {/* Description */}
        <TextField
          label="Description"
          multiline
          rows={4}
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        {/* Brand */}
        <TextField
          label="Brand"
          {...register("brand")}
          error={!!errors.brand}
          helperText={errors.brand?.message}
        />

        {/* Category */}
        <TextField
          label="Category"
          {...register("category")}
          error={!!errors.category}
          helperText={errors.category?.message}
        />

        {/* Price */}
        <TextField
          label="Price"
          type="number"
          {...register("price")}
          error={!!errors.price}
          helperText={errors.price?.message}
        />

        {/* Discount */}
        <TextField
          label="Discount (%)"
          type="number"
          {...register("discount")}
          error={!!errors.discount}
          helperText={errors.discount?.message}
        />

        {/* Colors */}
        <Stack spacing={1}>
          <Typography>Colors (hex)</Typography>
          <input
            type="text"
            placeholder="#000000"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const hex = (e.target as HTMLInputElement).value;
                setValue("colors", [
                  ...(control._formValues.colors || []),
                  hex,
                ]);
                (e.target as HTMLInputElement).value = "";
              }
            }}
          />

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {control._formValues.colors?.map((color: string, i: number) => (
              <Chip
                key={i}
                label={color}
                onDelete={() =>
                  setValue(
                    "colors",
                    control._formValues.colors.filter(
                      (_: any, idx: number) => idx !== i
                    )
                  )
                }
                sx={{ background: color, color: "#fff" }}
              />
            ))}
          </Stack>
        </Stack>

        {/* Sizes */}
        <Stack spacing={1}>
          <Typography>Sizes</Typography>
          <input
            type="text"
            placeholder="S, M, L..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const size = (e.target as HTMLInputElement).value;
                setValue("sizes", [
                  ...(control._formValues.sizes || []),
                  size,
                ]);
                (e.target as HTMLInputElement).value = "";
              }
            }}
          />

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {control._formValues.sizes?.map((size: string, i: number) => (
              <Chip
                key={i}
                label={size}
                onDelete={() =>
                  setValue(
                    "sizes",
                    control._formValues.sizes.filter(
                      (_: any, idx: number) => idx !== i
                    )
                  )
                }
              />
            ))}
          </Stack>
        </Stack>

        {/* Variants */}
        <Box mt={3}>
          <Typography variant="h6">Variants</Typography>
          {variants.map((field, index) => (
            <Stack
              key={field.id}
              direction="row"
              spacing={2}
              alignItems="center"
              mt={1}
            >
              <TextField
                label="Color"
                {...register(`variants.${index}.color` as const)}
              />

              <TextField
                label="Size"
                {...register(`variants.${index}.size` as const)}
              />

              <TextField
                label="Stock"
                type="number"
                {...register(`variants.${index}.stock` as const)}
              />

              <IconButton onClick={() => removeVariant(index)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}

          <Button
            sx={{ mt: 1 }}
            onClick={() => addVariant({ color: "", size: "", stock: 0 })}
          >
            Add Variant
          </Button>
        </Box>

        {/* Images */}
        <Box>
          <Typography variant="h6">Images</Typography>

          {images.map((img, index) => (
            <Stack key={img.id} direction="row" spacing={2} alignItems="center">
              <img
                src={img.url}
                width={80}
                style={{ borderRadius: 6 }}
              />
              <IconButton onClick={() => removeImage(index)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}

          <Button
            variant="outlined"
            sx={{ mt: 1 }}
            disabled={uploading}
            component="label"
          >
            Upload Image
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
          onClick={handleSubmit(onSubmit)}
        >
          Update Product
        </Button>
      </Stack>
    </Box>
  );
}
