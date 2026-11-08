import { Router } from "express";
import { StripeWebhookController } from "./stripe-webhook.controller";
import { StripeWebhookService } from "./stripe-webhook.service";
import express from "express";
const router = Router()

const stripeWebhookService = new StripeWebhookService()
const stripeWebhookController = new StripeWebhookController(stripeWebhookService)

router.post("/", express.raw({ type: "application/json" }), stripeWebhookController.handle)

export default router