import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import type { Category } from "../generated/prisma/client";

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput
  ): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id },
    });
  }

  async hasProducts(id: string): Promise<boolean> {
    const count = await prisma.product.count({
      where: { categoryId: id },
    });
    return count > 0;
  }
}

export const categoryRepository = new CategoryRepository();
