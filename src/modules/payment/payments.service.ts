import Stripe from "stripe";
import { stripeClient } from "../../lib/stripe/stripe.lib";
import { PaymentsRepository } from "./payments.repository";
import { PaymentStatus } from "./payments.types";

export class PaymentsService {
    private paymentRepository: PaymentsRepository
    constructor(paymentRepository: PaymentsRepository) {
        this.paymentRepository = paymentRepository
    }

    async createPaymentIntent(orderId: string, amount: number, userId: string) {
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            metadata: {
                order_id: orderId,
                user_id: userId
            }
        })

        const payment = await this.paymentRepository.createPayment({
            order_id: orderId,
            provider: 'stripe',
            transaction_id: paymentIntent.id,
            amount: amount,
            status: 'pending',
        });

        return {
            payment,
            clientSecret: paymentIntent.client_secret,
        };
    }


    async handlePaymentStatus(status: PaymentStatus, paymentIntent: Stripe.PaymentIntent) {
        return this.paymentRepository.updatePaymentStatus(status, paymentIntent.metadata.order_id)
    }
}