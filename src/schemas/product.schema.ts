import { z } from "zod";
import { uuidSchema } from "./common.schema";

const productBaseSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  price: z.number().positive("Price must be greater than 0"),
  stock: z
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative")
    .default(0),
  categoryId: uuidSchema.describe("Category ID"),
});

export const createProductSchema = z.object({
  body: productBaseSchema,
});

export const updateProductSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: productBaseSchema.partial(),
});

export const getProductByIdSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});

export type CreateProductInput = z.infer<typeof productBaseSchema>;
export type UpdateProductInput = Partial<CreateProductInput>;
