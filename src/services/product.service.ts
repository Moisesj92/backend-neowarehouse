import { productRepository } from "../repository/product.repository";
import { Prisma } from "../generated/prisma/client";

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

  async createProduct(data: Prisma.ProductCreateInput) {
    // Lógica de negocio adicional aquí
    if (data.price <= 0) {
      throw new Error("Price must be positive");
    }
    return productRepository.create(data);
  }

  async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    await this.getProductById(id); // Verifica que existe
    return productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    await this.getProductById(id); // Verifica que existe
    return productRepository.delete(id);
  }

  async searchProducts(name: string) {
    return productRepository.findByName(name);
  }
}

export const productService = new ProductService();
