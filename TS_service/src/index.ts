import  express from "express";
import client from "prom-client";
import { createServer } from "http";
import { redisSubscriber } from './redis/redisClient';

const app = express();
const port = 3030;

// registri instant mõõdikute haldamiseks
const register = new client.Registry();
const Server = createServer(app)
const wss = new WebSocketServer({Server});



wss.on('connection', ws => {
    console.log('Websocket client connected');

    ws.on('message', message: String => {
        console.log(`Received message from client: ${message}`);
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });

    ws.on('error', error => {
        console.log('Websocket error: ', error);
    });
})

app.get('/', (req,res) => {
    res.send('Typescript express running with websockets succesfully ')
})

Server.listen(port, () => {
    console.log(`server running on htpp://localhost:${port}`)
})

// graceful shutdown 

process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received. Closing server...');
    wss.clients.forEach(ws => ws.close());
    await redisSubscriber.quit()
    Server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    })

});