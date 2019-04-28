/*
 * File: server.js
 * Project: server
 * File Created: Tuesday, 19th March 2019 12:21:16 am
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Thursday, 11th April 2019 11:49:15 pm
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


import { AccountController } from './controllers/AccountController';
import { Account } from './models/Account';
// import { OrderController } from "./controllers/OrderController";
// import { Order } from "./models/Order";
import { yellow } from 'colors';
// import { PositionController } from "./controllers/PositionController";
// import { CalendarController } from "./controllers/CalendarController";
// import { Calendar } from "./models/Calendar";
// import { ClockController } from "./controllers/ClockController";
// import { Clock } from "./models/Clock";
// import { Constants } from "./constants";
// import { Streaming } from './models/Streaming';
import { indicators } from 'tulind';

console.log( yellow( `
.▄▄ · ▄▄▄▄▄      ▐▄• ▄ 
▐█ ▀. •██  ▪      █▌█▌▪
▄▀▀▀█▄ ▐█.▪ ▄█▀▄  ·██· 
▐█▄▪▐█ ▐█▌·▐█▌.▐▌▪▐█·█▌
 ▀▀▀▀  ▀▀▀  ▀█▄▀▪•▀▀ ▀▀
`));

// Streaming.setup();
// Streaming._messages.subscribe(( message: string ) => {
//     console.log( message );
// });

AccountController.get().then(( account: Account ) => {
    // console.log( account );
}).catch(( err: any ) => {
    console.log( err );
});

console.log( indicators );

indicators.sma.indicator( [[-1]], [3], ( err, results ) => {
    console.log( err );
    console.log( results );
});

// indicators.sma.indicator([close], [3], function(err, results) {
//     console.log("Result of sma is:");
//     console.log(results[0]);
//   });

// OrderController.get( 1554157280000, 1554167280000 ).then(( orders: Order[] ) => {
//     console.log( orders );
// }).catch(( err: any ) => {
//     console.log( err );
// });

// OrderController.cancel( '10' ).then(() => {
// }).catch(( err: any ) => {});

// OrderController.getByClientId( '10' ).then(() => {
// }).catch(( err: any ) => {});

// PositionController.getBySymbol( 'AAPL' ).then(() => {

// }).catch(( err: any ) => {});

// CalendarController.get( '2018-02-24', '2018-03-25' ).then(( calendar: Calendar[] ) => {
//     console.log( calendar );
// }).catch(( err: any ) => {});

// ClockController.get().then(( clock: Clock ) => {
//     console.log( clock );
// }).catch(( err: any ) => {});

