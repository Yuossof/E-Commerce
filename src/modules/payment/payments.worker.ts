import "dotenv/config";
import { rabbitMQ } from "../../config/rabbitmq"
import { PaymentsRepository } from "./payments.repository"
import { PaymentsService } from "./payments.service"
import { InventoryRepository } from "../products/inventory.repository";

const inventoryRepo = new InventoryRepository()
const paymentsRepo = new PaymentsRepository(inventoryRepo)
const paymentsService = new PaymentsService(paymentsRepo)

export async function startPaymentWorker() {
    const channel = await rabbitMQ.createChannel()
    const queueName = 'payment_queue';

    await channel.assertQueue(queueName, { durable: true })
    channel.prefetch(3)
    console.log(` [*] Payment Worker is waiting for messages in ${queueName}...`);
    channel.consume(queueName, async (msg) => {
        if (msg !== null) {
            try {
                console.log("New message:", msg.content.toString())
                const paymentData = JSON.parse(msg.content.toString())

                await paymentsService.handlePaymentStatus(paymentData.status, paymentData.paymentIntent)
                channel.ack(msg)
            } catch (error) {
                console.error(' [x] Error processing payment message:', error);
                channel.nack(msg, false, false);
            }
        }
    })
}

startPaymentWorker()