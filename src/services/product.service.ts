import { productRepository } from "../repositories/product.repository";
import { categoryRepository } from "../repositories/category.repository";
import { Prisma } from "../generated/prisma/client";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";

export class ProductService {
  async getAllProducts() {
    return productRepository.findAll();
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async createProduct(data: CreateProductInput) {
    if (data.price <= 0) {
      throw new Error("The price must be positive");
    }

    const category = await categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    const existingProduct = await productRepository.findByExactName(data.name);
    if (existingProduct) {
      throw new Error("Product already exist");
    }

    const prismaData: Prisma.ProductCreateInput = {
      name: data.name,
      price: data.price,
      stock: data.stock,
      category: {
        connect: { id: data.categoryId },
      },
    };

    return productRepository.create(prismaData);
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    await this.getProductById(id);

    if (data.categoryId) {
      const category = await categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error("Category not found");
      }
    }

    if (data.name) {
      const existingProducts = await productRepository.findByName(data.name);
      const duplicateProduct = existingProducts.find((p) => p.id !== id);
      if (duplicateProduct) {
        throw new Error("Product name already exist.");
      }
    }

    const prismaData: Prisma.ProductUpdateInput = {
      ...(data.name && { name: data.name }),
      ...(data.price && { price: data.price }),
      ...(data.stock !== undefined && { stock: data.stock }),
      ...(data.categoryId && {
        category: {
          connect: { id: data.categoryId },
        },
      }),
    };

    return productRepository.update(id, prismaData);
  }

  async deleteProduct(id: string) {
    await this.getProductById(id);
    return productRepository.delete(id);
  }

  async searchProducts(name: string) {
    return productRepository.findByName(name);
  }
}

export const productService = new ProductService();
