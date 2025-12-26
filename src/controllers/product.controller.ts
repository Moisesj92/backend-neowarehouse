import type { Request, Response } from "express";
import { productService } from "../services/product.service";
import {
  createProductSchema,
  updateProductSchema,
  getProductByIdSchema,
} from "../schemas/product.schema";

export const ProductController = {
  // GET /products - Obtener todos los productos
  index: async (req: Request, res: Response) => {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // GET /products/:id - Obtener un producto por ID
  show: async (req: Request, res: Response) => {
    try {
      const { id } = getProductByIdSchema.parse({ params: req.params }).params;
      const product = await productService.getProductById(id);
      res.json(product);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Invalid ID",
          errors: error.issues,
        });
      }

      if (error.message === "Product not found") {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error fetching product" });
    }
  },

  // POST /products - Crear un producto
  store: async (req: Request, res: Response) => {
    try {
      const { body } = createProductSchema.parse({ body: req.body });
      const newProduct = await productService.createProduct(body);
      res.status(201).json(newProduct);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Invalid data",
          errors: error.issues,
        });
      }

      if (error.message === "Product already exists") {
        return res.status(409).json({ error: error.message });
      }

      return res
        .status(500)
        .json({ error: error.message || "Error creating product" });
    }
  },

  // PUT /products/:id - Actualizar un producto
  update: async (req: Request, res: Response) => {
    try {
      const { params, body } = updateProductSchema.parse({
        params: req.params,
        body: req.body,
      });

      const updatedProduct = await productService.updateProduct(
        params.id,
        body
      );
      res.json(updatedProduct);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Invalid data",
          errors: error.issues,
        });
      }

      if (error.message === "Product not found") {
        return res.status(404).json({ error: error.message });
      }

      if (error.message === "Another product with this name already exists") {
        return res.status(409).json({ error: error.message });
      }

      return res
        .status(500)
        .json({ error: error.message || "Error updating product" });
    }
  },

  // DELETE /products/:id - Eliminar un producto
  destroy: async (req: Request, res: Response) => {
    try {
      const { id } = getProductByIdSchema.parse({ params: req.params }).params;
      const result = await productService.deleteProduct(id);
      res.json(result);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Invalid ID",
          errors: error.issues,
        });
      }

      if (error.message === "Product not found") {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error deleting product" });
    }
  },
};
