import { NextFunction, Request, Response } from "express";
import { stripeClient } from "../../../lib/stripe/stripe.lib";
import { StripeWebhookService } from "./stripe-webhook.service";
import config from "../../../config/env";

export class StripeWebhookController {
    constructor(
        private stripeWebhookService: StripeWebhookService
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const signature = req.headers["stripe-signature"];

            if (typeof signature !== "string") {
                return res.status(400).send("Missing Stripe signature");
            }

            if (!config.stripeWebhookSecret) {
                return res.status(503).send("Stripe webhook is not configured");
            }

            const event = stripeClient.webhooks.constructEvent(
                req.rawBody ?? req.body,
                signature,
                config.stripeWebhookSecret
            );

            await this.stripeWebhookService.handleEvent(event);

            return res.status(200).json({ received: true });
        } catch (error) {
            console.error("🔥 WEBHHOOK ERROR DETECTED:", error);
            next(error);
        }
    };
}