
import { createClient } from 'redis';
import dotenv from 'dotenv';


dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST || '';
const REDIS_PORT = process.env.REDIS_PORT || '';
const REDIS_URL = process.env.REDIS_URL || '';

export const createRedisClient = () => {
    const client = createClient({
        url: REDIS_URL,
    });

    client.on('error', (err: Error) => console.log('Redis Client Error: ', err))
    client.on('connect', () => console.log('Redis client Connected'))
    client.on('reconnecting', () => console.log('redis client reconnecting'))

    return client;

};

export const redisClient = createRedisClient();
export const redisSubscriber = createRedisClient();

const connectClients = async () => {
    try {
        await redisClient.connect()
        await redisSubscriber.connect()
        console.log('All Redis clients connected successfully');

    } catch (err) {
        console.log('failed to connect redis clients: ', err)
        process.exit(1);
    }
};

connectClients();

