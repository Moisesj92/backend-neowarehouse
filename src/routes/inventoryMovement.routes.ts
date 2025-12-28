import { Router } from "express";
import { InventoryMovementController } from "../controllers/inventoryMovement.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createInventoryMovementSchema,
  getInventoryMovementByIdSchema,
  getInventoryMovementsByProductSchema,
} from "../schemas/inventoryMovement.schema";

const router = Router();

// Obtener todos los movimientos
router.get("/", InventoryMovementController.index);

// Obtener un movimiento por ID
router.get(
  "/:id",
  validate(getInventoryMovementByIdSchema),
  InventoryMovementController.show
);

// Obtener movimientos por producto
router.get(
  "/product/:productId",
  validate(getInventoryMovementsByProductSchema),
  InventoryMovementController.getByProduct
);

// Obtener stock actual calculado de un producto
router.get(
  "/product/:productId/stock",
  validate(getInventoryMovementsByProductSchema),
  InventoryMovementController.getProductStock
);

// Crear un movimiento
router.post(
  "/",
  validate(createInventoryMovementSchema),
  InventoryMovementController.store
);

export default router;
