import { z } from "zod";
import { uuidSchema } from "./common.schema";

const movementTypeEnum = z.enum(["IN", "OUT", "ADJUSTMENT"]);

const inventoryMovementBaseSchema = z
  .object({
    productId: uuidSchema.describe("Product ID"),
    type: movementTypeEnum,
    quantity: z
      .number()
      .int("Quantity must be an integer")
      .positive("Quantity must be greater than 0"),
    reason: z
      .string()
      .max(500, "Reason cannot exceed 500 characters")
      .trim()
      .optional(),
    referenceNumber: z
      .string()
      .max(100, "Reference number cannot exceed 100 characters")
      .trim()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.type === "ADJUSTMENT" && !data.reason) {
        return false;
      }
      return true;
    },
    {
      message: "Adjustment movements must include a reason",
      path: ["reason"],
    }
  );

export const createInventoryMovementSchema = z.object({
  body: inventoryMovementBaseSchema,
});

export const getInventoryMovementByIdSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});

export const getInventoryMovementsByProductSchema = z.object({
  params: z.object({
    productId: uuidSchema,
  }),
});

export type CreateInventoryMovementInput = z.infer<
  typeof inventoryMovementBaseSchema
>;
