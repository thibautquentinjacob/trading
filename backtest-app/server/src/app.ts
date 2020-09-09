/*
 * File: server.ts
 * Project: server
 * File Created: Sunday, 14th April 2019 12:19:02 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Sunday, 23rd June 2019 9:55:45 pm
 * Modified By: Thibaut Jacob (thibautquentinjacob@gmail.com>)
 * -----
 * License:
 * MIT License
 *
 * Copyright (c) 2019 Thibaut Jacob
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { IncomingMessage } from 'http';
import * as WebSocket from 'ws';
import { Constants } from './constants';
import { Helper } from './Helper';
import { MessageHandler } from './message-handlers/message-handler';
import { OperationState } from './models/OperationState';
import { WebsocketCommand } from './models/WebsocketCommand';

export class App {
    private readonly _port!: number;
    private readonly _messageHandlers!: { [key: string]: MessageHandler };
    private readonly _webSocketServer!: WebSocket.Server;

    constructor({
        port,
        messageHandlers,
    }: {
        port: number;
        messageHandlers: { [key: string]: MessageHandler };
    }) {
        this._port = port;
        this._messageHandlers = messageHandlers;
        this._webSocketServer = this._createWebSocketServer(this._port);
        this._setMessageHandlers(this._webSocketServer, this._messageHandlers);
    }

    private _createWebSocketServer(port: number): WebSocket.Server {
        // Create new websocket server
        const server: WebSocket.Server = new WebSocket.Server({
            port: port,
        });
        console.log(
            Helper.formatLog(
                'Websocket server',
                `Server initialized on port ${Constants.WEBSERVER_PORT}\'`,
                '!',
                OperationState.SUCCESS
            )
        );

        return server;
    }

    private _setMessageHandlers(
        server: WebSocket.Server,
        messageHandlers: { [key: string]: MessageHandler }
    ): void {
        server.on('connection', (ws: WebSocket, req: IncomingMessage) => {
            console.log(
                Helper.formatLog(
                    'Websocket server',
                    `Connection established from ${req.connection.remoteAddress}`,
                    '!',
                    OperationState.SUCCESS
                )
            );

            ws.on('message', (message: WebSocket.Data) => {
                console.log(
                    Helper.formatLog(
                        'Websocket server',
                        `New message from ${req.connection.remoteAddress}: \'${message}\'`,
                        '!',
                        OperationState.SUCCESS
                    )
                );

                try {
                    const parsedMessage: any = JSON.parse(message.toString());
                    if (
                        !(
                            parsedMessage.command in
                            Object.keys(WebsocketCommand)
                        )
                    ) {
                        console.log(
                            Helper.formatLog(
                                'Websocket server',
                                `Unrecognized command ${parsedMessage.command}'`,
                                '!',
                                OperationState.FAILURE
                            )
                        );
                    }
                    this._messageHandlers[parsedMessage.command].processMessage(
                        ws,
                        message
                    );
                } catch {
                    console.log(
                        Helper.formatLog(
                            'Websocket server',
                            `Un-parsable message: ${message}'`,
                            '!',
                            OperationState.FAILURE
                        )
                    );
                }
            });

            ws.on('close', () => {
                console.log(
                    Helper.formatLog(
                        'Websocket server',
                        `${req.connection.remoteAddress} closed connection'`,
                        '!',
                        OperationState.SUCCESS
                    )
                );
            });
        });
    }
}
