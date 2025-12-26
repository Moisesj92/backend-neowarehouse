import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
  getProductByIdSchema,
} from "../schemas/product.schema";

const router = Router();

// Product
router.post(
  "/",
  validate(createProductSchema), // ← Valida antes de llegar al controller
  ProductController.store
);

router.put(
  "/:id",
  validate(updateProductSchema), // ← Valida params.id Y body
  ProductController.update
);

router.get(
  "/:id",
  validate(getProductByIdSchema), // ← Solo valida params.id
  ProductController.show
);

export default router;
