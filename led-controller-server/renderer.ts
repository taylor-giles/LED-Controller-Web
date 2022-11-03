import { IDisplay } from "./schemas";

export function handleWSConnection(ws){
    ws.on('message', function message(data) {
        ws.send("I received your message");
        console.log('received: %s', data);
    });
}