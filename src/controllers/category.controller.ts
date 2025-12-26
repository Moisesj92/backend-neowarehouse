import type { Request, Response } from "express";
import { categoryService } from "../services/category.service";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema,
} from "../schemas/category.schema";

export const CategoryController = {
  // GET /categories - Obtener todas las categorías
  index: async (req: Request, res: Response) => {
    try {
      const categories = await categoryService.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // GET /categories/:id - Obtener una categoría por ID
  show: async (req: Request, res: Response) => {
    try {
      const { id } = getCategoryByIdSchema.parse({ params: req.params }).params;
      const category = await categoryService.getCategoryById(id);
      res.json(category);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Invalid ID",
          errors: error.issues,
        });
      }

      if (error.message === "Category not found") {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error fetching category" });
    }
  },

  // POST /categories - Crear una categoría
  store: async (req: Request, res: Response) => {
    try {
      const { body } = createCategorySchema.parse({ body: req.body });
      const newCategory = await categoryService.createCategory(body);
      res.status(201).json(newCategory);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Invalid data",
          errors: error.issues,
        });
      }

      if (error.message === "Category with this name already exists") {
        return res.status(409).json({ error: error.message });
      }

      return res
        .status(500)
        .json({ error: error.message || "Error creating category" });
    }
  },

  // PUT /categories/:id - Actualizar una categoría
  update: async (req: Request, res: Response) => {
    try {
      const { params, body } = updateCategorySchema.parse({
        params: req.params,
        body: req.body,
      });

      const updatedCategory = await categoryService.updateCategory(
        params.id,
        body
      );
      res.json(updatedCategory);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Invalid data",
          errors: error.issues,
        });
      }

      if (error.message === "Category not found") {
        return res.status(404).json({ error: error.message });
      }

      if (error.message === "Another category with this name already exists") {
        return res.status(409).json({ error: error.message });
      }

      return res
        .status(500)
        .json({ error: error.message || "Error updating category" });
    }
  },

  // DELETE /categories/:id - Eliminar una categoría
  destroy: async (req: Request, res: Response) => {
    try {
      const { id } = getCategoryByIdSchema.parse({ params: req.params }).params;
      const result = await categoryService.deleteCategory(id);
      res.json(result);
    } catch (error: any) {
      if (error.issues) {
        return res.status(400).json({
          message: "Invalid ID",
          errors: error.issues,
        });
      }

      if (error.message === "Category not found") {
        return res.status(404).json({ error: error.message });
      }

      if (error.message === "Cannot delete category with associated products") {
        return res.status(409).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error deleting category" });
    }
  },
};
