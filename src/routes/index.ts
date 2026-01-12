import { Router } from "express";
import productRoutes from "./product.routes";
import categoryRoutes from "./category.routes";
import inventoryMovementRoutes from "./inventoryMovement.routes";
import { hmacAuthMiddleware } from "../middlewares";

const router = Router();

router.use(hmacAuthMiddleware);

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/inventory-movements", inventoryMovementRoutes);

export default router;
