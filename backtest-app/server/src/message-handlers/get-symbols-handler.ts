import * as WebSocket from 'ws';
import { SymbolController } from '../controllers/SymbolController';
import { Symbol } from '../models/Symbol';
import { MessageHandler } from './message-handler';

export class GetSymbolsHandler extends MessageHandler {
    protected handle(ws: WebSocket, _: any): void {
        SymbolController.get()
            .then((symbols: Symbol[]) => {
                ws.send(JSON.stringify(symbols));
            })
            .catch((err: any) => {
                console.log(err);
            });
    }
}
