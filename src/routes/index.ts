import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import categoryRoutes from "../modules/categories/categories.routes"
import productRoutes from "../modules/products/products.routes"
import orderRoutes from "../modules/orders/orders.routes"
import cartRoutes from "../modules/carts/carts.routes"
import addressRoutes from "../modules/addresses/addresses.routes"
import webhookRoutes from "../modules/webhooks/webhooks.routes"

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes)
router.use("/products", productRoutes)
router.use("/orders", orderRoutes)
router.use("/carts", cartRoutes)
router.use("/addresses", addressRoutes)

router.use("/webhooks", webhookRoutes);
export default router;