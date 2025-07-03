// src/app.ts
import express from 'express';
import { createServer } from 'http';
import apiRoutes from './routes/index.route';
import { config } from './config';
import { WebsocketService } from './services/websocket.service';
import { initializeRedis } from './services/redisPubSub.service';

export const app = express();
export const httpServer = createServer(app); // Ekspordime, et server.ts saaks kasutada

// Expressi middleware
app.use(express.json()); // JSON-i parsimiseks

// WebSocketService initsialiseerimine
const wsService = new WebsocketService(httpServer);

// Redise ja Pub/Sub teenuste initsialiseerimine
initializeRedis(wsService)
    .then(() => console.log('Redis services initialized.'))
    .catch(err => {
        console.error('Failed to initialize Redis services:', err);
        process.exit(1);
    });

// API ruuterid
app.use('/api', apiRoutes);

// Juurmarsruut
app.get('/', (req, res) => {
    res.send('TypeScript Express Backend is running with MVC and WebSockets!');
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});