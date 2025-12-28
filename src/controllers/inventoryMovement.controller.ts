import type { Request, Response } from "express";
import { inventoryMovementService } from "../services/inventoryMovement.service";
import {
  createInventoryMovementSchema,
  getInventoryMovementByIdSchema,
  getInventoryMovementsByProductSchema,
} from "../schemas/inventoryMovement.schema";

export const InventoryMovementController = {
  // GET /inventory-movements - Obtener todos los movimientos
  index: async (req: Request, res: Response) => {
    try {
      const movements = await inventoryMovementService.getAllMovements();
      res.json(movements);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // GET /inventory-movements/:id - Obtener un movimiento por ID
  show: async (req: Request, res: Response) => {
    try {
      const { id } = getInventoryMovementByIdSchema.parse({
        params: req.params,
      }).params;
      const movement = await inventoryMovementService.getMovementById(id);
      res.json(movement);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Invalid ID",
          errors: error.issues,
        });
      }

      if (error.message === "Inventory movement not found") {
        return res.status(404).json({ error: error.message });
      }

      return res
        .status(500)
        .json({ error: "Error fetching inventory movement" });
    }
  },

  // GET /inventory-movements/product/:productId - Obtener movimientos por producto
  getByProduct: async (req: Request, res: Response) => {
    try {
      const { productId } = getInventoryMovementsByProductSchema.parse({
        params: req.params,
      }).params;
      const movements = await inventoryMovementService.getMovementsByProductId(
        productId
      );
      res.json(movements);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Invalid product ID",
          errors: error.issues,
        });
      }

      if (error.message === "Product not found") {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error fetching movements" });
    }
  },

  // GET /inventory-movements/product/:productId/stock - Obtener stock actual de un producto
  getProductStock: async (req: Request, res: Response) => {
    try {
      const { productId } = getInventoryMovementsByProductSchema.parse({
        params: req.params,
      }).params;
      const stockInfo = await inventoryMovementService.getProductCurrentStock(
        productId
      );
      res.json(stockInfo);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Invalid product ID",
          errors: error.issues,
        });
      }

      if (error.message === "Product not found") {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error calculating stock" });
    }
  },

  // POST /inventory-movements - Crear un movimiento
  store: async (req: Request, res: Response) => {
    try {
      const { body } = createInventoryMovementSchema.parse({ body: req.body });
      const newMovement = await inventoryMovementService.createMovement(body);
      res.status(201).json(newMovement);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues,
        });
      }

      if (
        error.message === "Product not found" ||
        error.message.includes("Insufficient stock")
      ) {
        return res.status(400).json({ error: error.message });
      }

      console.error("Error creating inventory movement:", error);
      return res
        .status(500)
        .json({ error: "Error creating inventory movement" });
    }
  },
};
