import { createClient } from 'redis';
import config from './env';

export const client = createClient({
    url: config.redisUrl
});

client.on('error', (err) => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('Redis connecting...'));
client.on('ready', () => console.log('Redis ready to use'));


export const connectToRedis = async () => {
    try {
        await client.connect()
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
        process.exit(1);
    }
}