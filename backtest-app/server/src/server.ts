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



import * as WebSocket from 'ws';
import { Quote } from './models/Quote';
import { QuoteController } from './controllers/QuoteController';
import { QuoteCollection } from './models/QuoteCollection';
import { Constants } from './constants';
import { Helper } from './Helper';
import { OperationState } from './models/OperationState';
import { IncomingMessage } from 'http';
import { WebsocketCommand } from './models/WebsocketCommand';
import { SymbolController } from './controllers/SymbolController';
import { Symbol } from './models/Symbol';

// Create new websocket server
const webSocketServer: WebSocket.Server = new WebSocket.Server({
    port: Constants.WEBSERVER_PORT
});
console.log( Helper.formatLog( 
    'Websocket server',
    `Server initialized on port ${Constants.WEBSERVER_PORT}\'`,
    '!', OperationState.SUCCESS
));

webSocketServer.on( 'connection', ( ws: WebSocket, req: IncomingMessage ) => {
    console.log( Helper.formatLog( 'Websocket server', `Connection established from ${req.connection.remoteAddress}`, '!', OperationState.SUCCESS ));

    ws.on( 'message', ( message: WebSocket.Data,  ) => {
        console.log( Helper.formatLog( 
            'Websocket server',
            `New message from ${req.connection.remoteAddress}: \'${message}\'`,
            '!', OperationState.SUCCESS
        ));

        try {
            const parsedMessage: any = JSON.parse( message.toString());
            if ( parsedMessage.command === WebsocketCommand.GET_QUOTE ) {
                QuoteController.getQuotes( parsedMessage.options['quote']).then(( quotes: Quote[] ) => {
                    const indicators:       {[key: string]: string }   = {};
                    const indicatorOptions: {[key: string]: number[]}  = {};
                    const dataColumns:      {[key: string]: string[] } = {};

                    const indicatorKeys:    string[]                   = Object.keys(
                         parsedMessage.options.strategy.indicators
                    );
                    for ( let i = 0, size = indicatorKeys.length ; i < size ; i++ ) {
                        const indicator: string       = indicatorKeys[i];
                        indicators[indicator]         = parsedMessage.options.strategy.indicators[indicator].name;
                        indicatorOptions[indicator]   = parsedMessage.options.strategy.indicators[indicator].options;
                        dataColumns[indicator]        = parsedMessage.options.strategy.indicators[indicator].metrics;
                    }
                    const quoteCollection = new QuoteCollection(
                        quotes,
                        indicators,
                        indicatorOptions,
                        dataColumns
                    );
                    ws.send( JSON.stringify( quoteCollection ));
                }).catch(( err: any ) => {
                    console.log( err );
                });
            } else if ( parsedMessage.command === WebsocketCommand.GET_SYMBOLS ) {
                SymbolController.get().then(( symbols: Symbol[]) => {
                    ws.send( JSON.stringify( symbols ));
                }).catch(( err: any ) => {
                    console.log( err );
                });
            } else {
                console.log( Helper.formatLog(
                    'Websocket server',
                    `Unrecognized command ${parsedMessage.command}'`,
                    '!', OperationState.FAILURE
                ));
            }
        } catch ( e ) {
            console.log( Helper.formatLog(
                'Websocket server',
                e,
                '!', OperationState.FAILURE
            ));
        }
    });

    ws.on( 'close', () => {
        console.log( Helper.formatLog( 'Websocket server', `${req.connection.remoteAddress} closed connection'`, '!', OperationState.SUCCESS ));
    });
});
