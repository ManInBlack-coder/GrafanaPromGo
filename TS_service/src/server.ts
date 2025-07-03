// src/server.ts
import { httpServer } from './app';
import { config } from './config';
import { closeRedis } from './services/redisPubSub.service'; // Impordi sulgemisfunktsioon

const port = config.port;

httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`WebSocket server running on ws://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received. Closing server...');
    await closeRedis(); 
    httpServer.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('SIGINT signal received. Closing server...');
    await closeRedis(); 
    httpServer.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
});