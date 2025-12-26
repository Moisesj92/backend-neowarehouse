import type { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import {
  createProductSchema,
  updateProductSchema,
  getProductByIdSchema,
} from "../schemas/product.schema";

export const ProductController = {
  // GET /products - Obtener todos los productos
  index: async (req: Request, res: Response) => {
    try {
      const products = await ProductService.getAllProducts();
      res.json(products);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // GET /products/:id - Obtener un producto por ID
  show: async (req: Request, res: Response) => {
    try {
      const { id } = getProductByIdSchema.parse({ params: req.params }).params;
      const product = await ProductService.getProductById(id);
      res.json(product);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "ID inválido",
          errors: error.issues,
        });
      }

      if (error.message === "Producto no encontrado") {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error al obtener producto" });
    }
  },

  // POST /products - Crear un producto
  store: async (req: Request, res: Response) => {
    try {
      const { body } = createProductSchema.parse({ body: req.body });
      const newProduct = await ProductService.createProduct(body);
      res.status(201).json(newProduct);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: error.issues,
        });
      }

      if (error.message === "Ya existe un producto con este nombre.") {
        return res.status(409).json({ error: error.message });
      }

      return res
        .status(500)
        .json({ error: error.message || "Error al crear producto" });
    }
  },

  // PUT /products/:id - Actualizar un producto
  update: async (req: Request, res: Response) => {
    try {
      const { params, body } = updateProductSchema.parse({
        params: req.params,
        body: req.body,
      });

      const updatedProduct = await ProductService.updateProduct(
        params.id,
        body
      );
      res.json(updatedProduct);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: error.issues,
        });
      }

      if (error.message === "Producto no encontrado") {
        return res.status(404).json({ error: error.message });
      }

      if (error.message === "Ya existe otro producto con este nombre.") {
        return res.status(409).json({ error: error.message });
      }

      return res
        .status(500)
        .json({ error: error.message || "Error al actualizar producto" });
    }
  },

  // DELETE /products/:id - Eliminar un producto
  destroy: async (req: Request, res: Response) => {
    try {
      const { id } = getProductByIdSchema.parse({ params: req.params }).params;
      const result = await ProductService.deleteProduct(id);
      res.json(result);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "ID inválido",
          errors: error.issues,
        });
      }

      if (error.message === "Producto no encontrado") {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error al eliminar producto" });
    }
  },
};
