"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Chip,
  IconButton
} from "@mui/material";

import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { productSchema, ProductFormValues } from "@/lib/validators";
import { createProduct } from "@/services/products.service";

import { toast } from "sonner";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CreateProductPage() {
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  }: UseFormReturn<ProductFormValues> = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema) as any,
    defaultValues: {
      colors: [],
      sizes: [],
      variants: [],
      images: []
    }
  });
  console.log(errors);


  // Watch arrays (safe alternative to _formValues)
  const colors = watch("colors") || [];
  const sizes = watch("sizes") || [];
  const imagesWatch = watch("images") || [];

  // Field Arrays
  const { fields: variants, append: addVariant, remove: removeVariant } =
    useFieldArray({ control, name: "variants" });

  const { fields: images, append: addImage, remove: removeImage } =
    useFieldArray({ control, name: "images" });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await createProduct(data);
      toast.success("Product created successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Error creating product");
    }
  };

  return (
    <Box maxWidth={800} mx="auto" p={4}>
      <Typography variant="h4" mb={4} fontWeight={700}>
        Create Product
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

                const hex = (e.target as HTMLInputElement).value.trim();
                if (!hex) return;

                const current = watch("colors") || [];
                setValue("colors", [...current, hex]);

                (e.target as HTMLInputElement).value = "";
              }
            }}
          />

          <Stack direction="row" spacing={1} flexWrap="wrap">
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
                sx={{
                  backgroundColor: color,
                  color: "#fff"
                }}
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

                const size = (e.target as HTMLInputElement).value.trim();
                if (!size) return;

                const current = watch("sizes") || [];
                setValue("sizes", [...current, size]);

                (e.target as HTMLInputElement).value = "";
              }
            }}
          />

          <Stack direction="row" spacing={1} flexWrap="wrap">
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
                {...register(`variants.${index}.color`)}
              />

              <TextField
                label="Size"
                {...register(`variants.${index}.size`)}
              />

              <TextField
                label="Stock"
                type="number"
                {...register(`variants.${index}.stock`)}
              />

              <IconButton onClick={() => removeVariant(index)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}

          <Button
            sx={{ mt: 1 }}
            onClick={() =>
              addVariant({ color: "", size: "", stock: 0 })
            }
          >
            Add Variant
          </Button>
        </Box>

        {/* Images */}
        <Box>
          <Typography variant="h6">Images</Typography>

          {images.map((img, index) => (
            <Stack
              key={img.id}
              direction="row"
              spacing={2}
              alignItems="center"
              mt={1}
            >
              {imagesWatch[index]?.url && (
                <img
                  src={imagesWatch[index].url}
                  width={80}
                  style={{ borderRadius: 6 }}
                />
              )}

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
                  body: formData
                });

                const uploaded = await res.json();

                addImage({
                  url: uploaded.url,
                  public_id: uploaded.public_id
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
          Create Product
        </Button>
      </Stack>
    </Box>
  );
}
