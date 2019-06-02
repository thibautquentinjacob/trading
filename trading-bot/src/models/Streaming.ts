/*
 * File: Streaming.ts
 * Project: server
 * File Created: Monday, 25th March 2019 12:44:48 am
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Thursday, 23rd May 2019 1:01:52 am
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



// import * as WebSocket from 'ws';
import { Constants } from '../constants';
// import { BehaviorSubject } from 'rxjs';
// import { v4 } from 'uuid';
import { post } from 'request-promise-native';

// import { Helper } from '../Helper';
// import { OperationState } from './OperationState';


export class Streaming {

    public static connect() {
        const url: string = `${Constants.IEX_CLOUD_DATA_URL}/${Constants.IEX_CLOUD_VERSION}/${Constants.IEX_CLOUD_STREAM_PRECISION}?symbols=AAPL&token=${Constants.IEX_CLOUD_PRIVATE_TOKEN}`;
        console.log( url );
        post( `${Constants.IEX_CLOUD_DATA_URL}/${Constants.IEX_CLOUD_VERSION}/${Constants.IEX_CLOUD_STREAM_PRECISION}?symbols=AAPL&token=${Constants.IEX_CLOUD_PRIVATE_TOKEN}`, {
            headers: {
                'Content-Type': 'text/event-stream'
            }
        }).then(( data: any ) => {
            console.log( data );
        });
    }

    // private static _socket:        WebSocket               = new WebSocket( Constants.DATA_URL );
    // private static _authenticated: boolean                 = false;
    // public  static data:           BehaviorSubject<any>    = new BehaviorSubject<any>( null );
    // public  static messages:       BehaviorSubject<string> = new BehaviorSubject<string>( '' );

    // /**
    //  * Authenticate the user on the channel
    //  * 
    //  * @param {uuid} string - Operation UUID 
    //  */
    // private static _authenticate( uuid: string ): void {
    //     const uuid2: string = v4().replace( /^([^\-]*)\-.*/, '$1' );
    //     console.log( Helper.formatLog( 'WebSocket', 'Authenticating', uuid2, OperationState.PENDING ));
    //     const authMsg = {
    //         action: 'authenticate',
    //         data: {
    //           key_id:     Constants.KEY_ID,
    //           secret_key: Constants.KEY_SECRET
    //         }
    //     }
    //     Streaming._socket.send( JSON.stringify( authMsg ));
    //     console.log( Helper.formatLog( 'WebSocket', 'Opening channel', uuid, OperationState.SUCCESS ));
    // }

    // public static setup(): void {
        
    //     Streaming._socket.on( 'message', ( data: any ) => {
    //         const parsedMessage: any = JSON.parse( data.toString());
    //         console.log( parsedMessage );
    //         switch ( parsedMessage.stream ) {
    //             case 'authorization':
    //                 Streaming._authenticated = ( parsedMessage.data.status === 'authorized' );
    //                 // If authentication was successful, subscribe to trade updates and
    //                 // account updates.
    //                 if ( Streaming._authenticated ) {
    //                     console.log( Helper.formatLog( 'WebSocket', 'Authenticated', '', OperationState.SUCCESS ));
    //                     Streaming._socket.send(JSON.stringify({
    //                         action: 'listen',
    //                         data: {
    //                             streams: ['trade_updates']
    //                         }
    //                     }));
    //                 } else {
    //                     console.log( Helper.formatLog( 'WebSocket', 'Could not authenticate', '', OperationState.FAILURE ));
    //                 }
    //                 break;
    //             default:
    //                 console.log( Helper.formatLog( 'WebSocket', JSON.stringify( parsedMessage ), '', OperationState.SUCCESS ));
    //                 this.messages.next( data.toString());
    //         }
    //     });
        
    //     Streaming._socket.on( 'error', ( err:any ) => {
    //         console.log( err );
    //     });
        
    //     Streaming._socket.on( 'open', () => {
    //         const uuid:  string = v4().replace( /^([^\-]*)\-.*/, '$1' );
    //         console.log( Helper.formatLog( 'WebSocket', 'Opening channel', uuid, OperationState.PENDING ));
    //         Streaming._authenticate( uuid );
    //     });
    // }

}
