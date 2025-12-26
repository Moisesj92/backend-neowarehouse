import { z } from "zod";
import { uuidSchema } from "./common.schema";

const categoryBaseSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),
});

export const createCategorySchema = z.object({
  body: categoryBaseSchema,
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: categoryBaseSchema.partial(),
});

export const getCategoryByIdSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});

export type CreateCategoryInput = z.infer<typeof categoryBaseSchema>;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;
