// ts_service/src/app.ts
import express from 'express';
import client from 'prom-client'; // Prometheus client library

// --- Express App Setup ---
const app = express();

// --- Prometheus Metrics Setup ---
// These metrics are defined here because they are part of the *application* behavior
export const register = new client.Registry(); // Export the registry to be used in server.ts for metrics endpoint

export const websocketConnections = new client.Gauge({
    name: 'websocket_connections_total',
    help: 'Total number of active WebSocket connections.',
    registers: [register],
});

export const redisPubSubMessagesTotal = new client.Counter({
    name: 'redis_pubsub_messages_total',
    help: 'Total number of messages received from Redis Pub/Sub.',
    labelNames: ['channel'],
    registers: [register],
});

client.collectDefaultMetrics({ register }); // Collect default Node.js metrics

// --- Express Middleware (e.g., JSON parsing, CORS, logging) ---
app.use(express.json()); // For parsing application/json

// --- Express Routes ---
app.get('/', (req, res) => {
    res.send('TypeScript Express Backend is running (configured in app.ts)!');
});

// Prometheus metrics endpoint (exposed here because it's an app route)
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Add your API routes here later:
// import apiRoutes from './routes';
// app.use('/api', apiRoutes);

export default app; // Export the configured Express app