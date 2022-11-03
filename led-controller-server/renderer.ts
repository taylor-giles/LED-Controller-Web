import WebSocket from "ws";
import { WebSocketServer } from 'ws';
import { IDisplay } from "./schemas";

export function handleWSConnection(ws: WebSocket){
    ws.on('message', function message(data: WebSocket.RawData) {
        ws.send("I received your message");
        console.log('received: %s', data);
    });
}