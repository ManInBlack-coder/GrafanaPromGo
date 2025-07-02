import { WebSocketServer, WebSocket } from "ws";
import {Server as HttpServer} from 'http';

interface TaxiUpdateMessage {
    id: string;
    latitude: number;
    longitude: number;
    status: string;
}

export class WebsocketSerivce {
    private wss: WebSocketServer;

    constructor(httpServer: HttpServer) {
        this.wss = new WebSocketServer({ server: httpServer});
        this.setupConnectionHandlers();
    }

    private setupConnectionHandlers() {
        this.wss.on('connection', ws => {
            console.log('WebSocket client connected');
        
            ws.on('message', message => {
            console.log(`Received message from client: ${message}`);
        });

        ws.on('close', () => {
            console.log('WebSocket client disconnected');
        });

        ws.on('error', error => {
            console.error('WebSocket error:', error);
        
        });
    });
}

public sendTaxiUpdate(message:string): void {
    try {
        const taxiUpdate: TaxiUpdateMessage = JSON.parse(message);

        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
            }
        });
    } catch (error) {
        console.error('Failed to parse or broadcast taxi update message:', message, error);
    }
}
public close(): void {
    this.wss.clients.forEach(ws => ws.close());
    this.wss.close(() => console.log('ws server closed'));
}

}