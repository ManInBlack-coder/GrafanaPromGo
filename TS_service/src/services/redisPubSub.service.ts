import { createClient } from "redis";
import {config} from '../config';
import { WebsocketSerivce } from "./websocket.service";

const REDIS_URL = `redis://${config.redisHost}:${config.redisPort}`;
const TAXI_UPDATE_CHANNEL = 'taxi_updates';

export const redisClient = createClient({url: REDIS_URL});
export const redisSubscriber = createClient({url: REDIS_URL});

let wsService: WebsocketSerivce | null = null;

export const initializeRedis = async (WebsocketSerivce: WebsocketSerivce) => {
    wsService = WebsocketSerivce;

    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    redisSubscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));

    await redisClient.connect();
    await redisSubscriber.connect();

    console.log('All Redis clients connected successfully.');

    redisSubscriber.subscribe(TAXI_UPDATE_CHANNEL, (err) => {
        if (err) {
            console.error(`Failed to subscribe to ${TAXI_UPDATE_CHANNEL}:`, err);
        } else {
            console.log(`Subscribed to Redis channel: ${TAXI_UPDATE_CHANNEL}`);

        }
    });

    redisSubscriber.on('message', (channel,message) => {
        if (channel === TAXI_UPDATE_CHANNEL && wsService) {
            wsService.sendTaxiUpdate(message);
        }
    });

};

export const closeRedis = async () => {
    await redisClient.quit();
    await redisSubscriber.quit();
    console.log('All Redis clients disconnected.');

}
