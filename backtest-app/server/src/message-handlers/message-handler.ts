import * as WebSocket from 'ws';
import { Helper } from '../Helper';
import { OperationState } from '../models/OperationState';

export abstract class MessageHandler {
    public processMessage(ws: WebSocket, message: WebSocket.Data): void {
        console.log(
            Helper.formatLog(
                'Websocket server',
                `New message: ${message}`,
                '!',
                OperationState.SUCCESS
            )
        );
        const parsedMessage: object = this.parseMessage(message);
        this.handle(ws, parsedMessage);
    }

    protected parseMessage(message: WebSocket.Data): any {
        return JSON.parse(message.toString());
    }

    // Override this method in children
    protected handle(ws: WebSocket, message: any): void {
        throw new Error('Do not instantiate directly');
    }
}
