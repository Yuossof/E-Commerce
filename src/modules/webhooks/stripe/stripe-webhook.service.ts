
import Stripe from "stripe";
import { rabbitMQ } from "../../../config/rabbitmq";
import { PaymentStatus } from "../../payment/payments.types";

export class StripeWebhookService {
  async handleEvent(event: Stripe.Event) {
    switch (event.type) {
      case "payment_intent.succeeded":
        return this.sendPaymentToQueue(
          event.data.object as Stripe.PaymentIntent,
          "success"
        )
      case "payment_intent.payment_failed":
        return this.sendPaymentToQueue(
          event.data.object as Stripe.PaymentIntent,
          "failed"
        )

      case "payment_intent.canceled":
        return this.sendPaymentToQueue(
          event.data.object as Stripe.PaymentIntent,
          "canceled"
        )

      default:
        return
    }
  }

  async sendPaymentToQueue(paymentIntent: Stripe.PaymentIntent, status: PaymentStatus) {
    const channel = await rabbitMQ.createChannel();
    const queueName = 'payment_queue';
    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify({
        paymentIntent: paymentIntent,
        status: status
      })),
      {
        persistent: true,
      }
    );

    console.log(` [x] Payment sent to queue for order: ${paymentIntent.metadata.orderId}`);
  }
}