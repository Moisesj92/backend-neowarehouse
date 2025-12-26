import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema,
} from "../schemas/category.schema";

const router = Router();

router.get("/", CategoryController.index);

router.get("/:id", validate(getCategoryByIdSchema), CategoryController.show);

router.post("/", validate(createCategorySchema), CategoryController.store);

router.put("/:id", validate(updateCategorySchema), CategoryController.update);

router.patch("/:id", validate(updateCategorySchema), CategoryController.update);

router.delete(
  "/:id",
  validate(getCategoryByIdSchema),
  CategoryController.destroy
);

export default router;
