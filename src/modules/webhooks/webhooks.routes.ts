import { Router } from "express";
import stripeWebhookRoutes from "./stripe/stripe-webhook.routes";

const router = Router();

router.use("/payments", stripeWebhookRoutes);

export default router;