import { categoryRepository } from "../repositories/category.repository";
import { Prisma } from "../generated/prisma/client";

export class CategoryService {
  async getAllCategories() {
    return categoryRepository.findAll();
  }

  async getCategoryById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  async createCategory(data: Prisma.CategoryCreateInput) {
    if (!data.name || data.name.trim() === "") {
      throw new Error("Category name is required");
    }

    const existingCategory = await categoryRepository.findByName(data.name);
    if (existingCategory) {
      throw new Error("Category already exists");
    }

    return categoryRepository.create(data);
  }

  async updateCategory(id: string, data: Prisma.CategoryUpdateInput) {
    await this.getCategoryById(id);

    if (data.name && typeof data.name === "string") {
      const existingCategory = await categoryRepository.findByName(data.name);
      if (existingCategory && existingCategory.id !== id) {
        throw new Error("Category name already exists");
      }
    }

    return categoryRepository.update(id, data);
  }

  async deleteCategory(id: string) {
    const category = await this.getCategoryById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    const hasProducts = await categoryRepository.hasProducts(id);
    if (hasProducts) {
      throw new Error("Cannot delete category with existing products");
    }

    return categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
