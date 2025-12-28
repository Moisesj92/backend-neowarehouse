import { inventoryMovementRepository } from "../repositories/inventoryMovement.repository";
import { productRepository } from "../repositories/product.repository";
import { Prisma } from "../generated/prisma/client";
import type { CreateInventoryMovementInput } from "../schemas/inventoryMovement.schema";

export class InventoryMovementService {
  async getAllMovements() {
    return inventoryMovementRepository.findAll();
  }

  async getMovementById(id: string) {
    const movement = await inventoryMovementRepository.findById(id);
    if (!movement) {
      throw new Error("Inventory movement not found");
    }
    return movement;
  }

  async getMovementsByProductId(productId: string) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    return inventoryMovementRepository.findByProductId(productId);
  }

  async createMovement(data: CreateInventoryMovementInput) {
    const product = await productRepository.findById(data.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Validar cantidad según el tipo de movimiento
    if (data.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    // Para movimientos OUT, verificar que haya suficiente stock
    if (data.type === "OUT") {
      const currentStock =
        await inventoryMovementRepository.calculateCurrentStock(data.productId);
      if (currentStock < data.quantity) {
        throw new Error(
          `Insufficient stock. Current stock: ${currentStock}, requested: ${data.quantity}`
        );
      }
    }

    // Crear el movimiento
    const prismaData: Prisma.InventoryMovementCreateInput = {
      type: data.type,
      quantity: data.quantity,
      reason: data.reason,
      product: {
        connect: { id: data.productId },
      },
    };

    const movement = await inventoryMovementRepository.create(prismaData);

    // Actualizar el stock del producto
    const newStock = await inventoryMovementRepository.calculateCurrentStock(
      data.productId
    );
    await productRepository.update(data.productId, { stock: newStock });

    return movement;
  }

  async getProductCurrentStock(productId: string) {
    // Verificar que el producto exista
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const calculatedStock =
      await inventoryMovementRepository.calculateCurrentStock(productId);

    return {
      productId,
      productName: product.name,
      currentStock: calculatedStock,
      storedStock: product.stock,
    };
  }
}

export const inventoryMovementService = new InventoryMovementService();
