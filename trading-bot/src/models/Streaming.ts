/*
 * File: Streaming.ts
 * Project: server
 * File Created: Monday, 25th March 2019 12:44:48 am
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Sunday, 14th April 2019 12:18:04 pm
 * Modified By: Licoffe (p1lgr11m@gmail.com>)
 * -----
 * License:
 * MIT License
 * 
 * Copyright (c) 2019 Licoffe
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
import { Constants } from '../constants';
import { BehaviorSubject } from 'rxjs';


export class Streaming {

    private static _socket:  WebSocket               = new WebSocket( Constants.DATA_URL );
    public static _data:     BehaviorSubject<any>    = new BehaviorSubject<any>( null );
    public static _messages: BehaviorSubject<string> = new BehaviorSubject<string>( '' );

    private static _authenticate(): void {
        const authMsg = {
            action: 'authenticate',
            data: {
              key_id:     Constants.KEY_ID,
              secret_key: Constants.KEY_SECRET
            }
        }
        Streaming._socket.send( JSON.stringify( authMsg ));
    }

    public static setup(): void {
        
        Streaming._socket.on( 'message', ( data: any ) => {
            this._messages.next( data.toString());
        });
        
        Streaming._socket.on( 'error', ( err:any ) => {
            console.log( err );
        });
        
        Streaming._socket.on( 'open', () => {
            console.log( 'Opened channel' );
            Streaming._authenticate();
        });
    }

}
