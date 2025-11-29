"use client";

import styles from "./editProductForm.module.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { uploadImage } from "@/services/upload.service";

import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import Image from "next/image";

import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { productSchema, ProductFormValues } from "@/lib/validators";
import { getProductById, updateProduct } from "@/services/products.service";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";

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
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema) as any,
  });

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

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await getProductById(id as string);

        const fixedProduct = {
          ...product,
          images: product.images?.map((img: any) => ({
            id: crypto.randomUUID(),
            url: img.url,
            public_id: img.public_id,
          })),
          variants: product.variants?.map((v: any) => ({
            id: crypto.randomUUID(),
            ...v,
          })),
        };

        reset(fixedProduct);
      } catch (err) {
        toast.error("Error loading product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, reset]);

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
    <Box className={styles.container}>
      <div className={styles.backRow}>
        <IconButton
          onClick={() => router.push("/admin/products")}
          className={styles.backButton}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      </div>
      <Typography className={styles.title}>Edit Product</Typography>
      <Stack spacing={3}>
        {/* Title */}
        <div className={styles.section}>
          <Typography className={styles.sectionTitle}>General Info</Typography>

          <div className={styles.sectionContent}>
            <TextField
              label="Title"
              {...register("title")}
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className={styles.section}>
          <Typography className={styles.sectionTitle}>Pricing</Typography>

          <TextField
            label="Price"
            type="number"
            {...register("price")}
            error={!!errors.price}
            helperText={errors.price?.message}
            fullWidth
          />

          <TextField
            label="Discount (%)"
            type="number"
            {...register("discount")}
            fullWidth
            error={!!errors.discount}
            helperText={errors.discount?.message}
            sx={{ mt: 2 }}
          />
        </div>

        {/* Variants */}
        <div className={styles.section}>
          <Typography className={styles.sectionTitle}>Variants</Typography>

          {variants.map((field, index) => (
            <div key={field.id} className={styles.variantRow}>
              <TextField
                label="Color"
                {...register(`variants.${index}.color`)}
              />
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

          <Button
            sx={{ mt: 1 }}
            onClick={() => addVariant({ color: "", size: "", stock: 0 })}
          >
            Add Variant
          </Button>
        </div>

        {/* Images */}
        <div className={styles.section}>
          <Typography className={styles.sectionTitle}>Images</Typography>

          <div className={styles.horizontalList}>
            {images.map((img, index) => (
              <Stack
                key={img.id}
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Image
                  src={img.url}
                  alt="Product image"
                  width={80}
                  height={80}
                  style={{ borderRadius: 6 }}
                />
                <IconButton onClick={() => removeImage(index)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
          </div>

          <Button
            variant="outlined"
            component="label"
            className={styles.uploadLabel}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                try {
                  setUploading(true);

                  const uploaded = await uploadImage(file);

                  addImage({
                    url: uploaded.url,
                    public_id: uploaded.public_id,
                  });
                } catch (err) {
                  toast.error("Error uploading image");
                } finally {
                  setUploading(false);
                }
              }}
            />
          </Button>
        </div>

        <Button
          className={styles.submitButton}
          onClick={handleSubmit(onSubmit)}
        >
          Update Product
        </Button>
      </Stack>
    </Box>
  );
}
