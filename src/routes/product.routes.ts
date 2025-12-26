import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
  getProductByIdSchema,
} from "../schemas/product.schema";

const router = Router();

router.get("/", ProductController.index);

router.get("/:id", validate(getProductByIdSchema), ProductController.show);

router.post("/", validate(createProductSchema), ProductController.store);

router.put("/:id", validate(updateProductSchema), ProductController.update);

router.patch("/:id", validate(updateProductSchema), ProductController.update);

router.delete(
  "/:id",
  validate(getProductByIdSchema),
  ProductController.destroy
);

export default router;
