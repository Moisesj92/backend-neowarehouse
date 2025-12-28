import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import type { InventoryMovement } from "../generated/prisma/client";

export class InventoryMovementRepository {
  async findAll(): Promise<InventoryMovement[]> {
    return prisma.inventoryMovement.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<InventoryMovement | null> {
    return prisma.inventoryMovement.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByProductId(productId: string): Promise<InventoryMovement[]> {
    return prisma.inventoryMovement.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(
    data: Prisma.InventoryMovementCreateInput
  ): Promise<InventoryMovement> {
    return prisma.inventoryMovement.create({
      data,
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async calculateCurrentStock(productId: string): Promise<number> {
    const movements = await prisma.inventoryMovement.findMany({
      where: { productId },
      select: {
        type: true,
        quantity: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!movements || movements.length === 0) {
      return 0;
    }

    let stock = 0;
    let lastAdjustmentIndex = -1;

    for (let i = movements.length - 1; i >= 0; i--) {
      if (movements[i]?.type === "ADJUSTMENT") {
        lastAdjustmentIndex = i;
        stock = movements[i]?.quantity ?? 0;
        break;
      }
    }

    const startIndex = lastAdjustmentIndex === -1 ? 0 : lastAdjustmentIndex + 1;

    for (let i = startIndex; i < movements.length; i++) {
      const movement = movements[i];
      if (movement?.type === "IN") {
        stock += movement.quantity;
      } else if (movement?.type === "OUT") {
        stock -= movement.quantity;
      }
    }

    return stock;
  }
}

export const inventoryMovementRepository = new InventoryMovementRepository();
