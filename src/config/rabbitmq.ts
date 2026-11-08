import amqp, { Channel } from 'amqplib';
import config from './env';

class RabbitMQClient {
    private connection: any | null = null;

    async connect() {
        if (this.connection) {
            return this.connection;
        }

        try {
            this.connection = await amqp.connect(config.rabbitMqUrl || 'amqp://localhost');

            this.connection.on('close', () => {
                console.error(' [x] RabbitMQ connection closed. Reconnecting...');
                this.connection = null;
                setTimeout(() => this.connect(), 5000);
            });

            console.log(' [✔] Successfully connected to RabbitMQ server');
            return this.connection;
        } catch (error) {
            console.error(' [x] Failed to connect to RabbitMQ:', error);
            process.exit(1);
        }
    }

    async createChannel(): Promise<Channel> {
        const conn = await this.connect();
        return await conn.createChannel();
    }
}

export const rabbitMQ = new RabbitMQClient();