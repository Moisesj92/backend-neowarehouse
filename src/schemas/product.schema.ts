import * as z from "zod";
import { uuidSchema } from "./common.schema";

const productBaseSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),
  price: z.number().positive("El precio debe ser mayor a 0"),
  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .nonnegative("El stock no puede ser negativo")
    .default(0),
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
