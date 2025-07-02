// ts_service/src/server.ts
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import app, { websocketConnections, redisPubSubMessagesTotal, register } from './app'; // Import the Express app and metrics
import { createRedisClient, redisSubscriber } from './redis/redisClient'; // Your Redis client setup

// --- Configuration ---
const PORT = process.env.PORT || 3030;
const TAXI_UPDATE_CHANNEL = 'taxi_updates';

// --- Create HTTP Server & WebSocket Server ---
const httpServer = createServer(app); // Use the Express app
const wss = new WebSocketServer({ server: httpServer });

// --- WebSocket Server Logic ---
wss.on('connection', ws => {
    console.log('WebSocket client connected');
    websocketConnections.inc();

    ws.on('message', message => {
        console.log(`Received message from client: ${message}`);
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        websocketConnections.dec();
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

// --- Redis Pub/Sub Subscriber Logic ---
redisSubscriber.connect().then(() => {
    console.log('Redis subscriber connected.');
    redisSubscriber.subscribe(TAXI_UPDATE_CHANNEL, (err) => {
        if (err) {
            console.error(`Failed to subscribe to ${TAXI_UPDATE_CHANNEL}:`, err);
        } else {
            console.log(`Subscribed to Redis channel: ${TAXI_UPDATE_CHANNEL}`);
        }
    });

    redisSubscriber.on('message', (channel, message) => {
        if (channel === TAXI_UPDATE_CHANNEL) {
            redisPubSubMessagesTotal.labels(channel).inc();
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    });
}).catch(err => {
    console.error('Failed to connect Redis subscriber:', err);
    process.exit(1);
});

// --- Start the HTTP Server ---
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Prometheus metrics available on http://localhost:${PORT}/metrics`);
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
});

// --- Graceful Shutdown ---
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received. Initiating graceful shutdown...');
    await shutdown();
});

process.on('SIGINT', async () => {
    console.log('SIGINT signal received. Initiating graceful shutdown...');
    await shutdown();
});

async function shutdown() {
    console.log('Closing WebSocket connections...');
    wss.clients.forEach(ws => ws.close());

    console.log('Quitting Redis subscriber...');
    await redisSubscriber.quit().catch(err => console.error('Error quitting Redis subscriber:', err));

    console.log('Closing HTTP server...');
    httpServer.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Forcing shutdown after timeout.');
        process.exit(1);
    }, 5000);
}