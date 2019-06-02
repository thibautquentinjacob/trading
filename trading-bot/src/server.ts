/*
 * File: server.js
 * Project: server
 * File Created: Tuesday, 19th March 2019 12:21:16 am
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Thursday, 23rd May 2019 1:00:58 am
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
import { OrderController } from "./controllers/OrderController";
// import { Order } from "./models/Order";
import { yellow } from 'colors';
// import { PositionController } from "./controllers/PositionController";
// import { CalendarController } from "./controllers/CalendarController";
// import { Calendar } from "./models/Calendar";
import { ClockController } from "./controllers/ClockController";
import { Clock } from "./models/Clock";
// import { Constants } from "./constants";
import { Streaming } from './models/Streaming';
// import { Side } from './models/Side';
// import { OrderType } from './models/OrderType';
// import { TimeInForce } from './models/TimeInForce';
import { Order } from './models/Order';
// import { OrderStatus } from './models/OrderStatus';
// import { onErrorResumeNext } from 'rxjs';
// import { indicators } from 'tulind';

console.log( yellow( `
.▄▄ · ▄▄▄▄▄      ▐▄• ▄ 
▐█ ▀. •██  ▪      █▌█▌▪
▄▀▀▀█▄ ▐█.▪ ▄█▀▄  ·██· 
▐█▄▪▐█ ▐█▌·▐█▌.▐▌▪▐█·█▌
 ▀▀▀▀  ▀▀▀  ▀█▄▀▪•▀▀ ▀▀
`));

// // Create a screen object.
// const app = screen({
//     smartCSR: true,
//     dockBorders: true
// });

// app.title = 'my window title';

// // Top box containing the KPIs
// const kpisBox = box({
//     left: 'left',
//     width: '100%',
//     shrink: true,
//     align: 'center',
//     content: `{bold}TOTAL:{/bold} {grey-fg}$5000 {${ColorTheme.emphasizedValue}-fg}(+23%){/}\
//     {bold}ASSET:{/bold} {grey-fg}$5000 {${ColorTheme.emphasizedValue}-fg}(+23%){/}\
//     {bold}CASH:{/bold} {grey-fg}$5000 {${ColorTheme.emphasizedValue}-fg}(+23%){/}\
//     {bold}SUCCESS RATE:{/bold} {grey-fg}$5000 {${ColorTheme.emphasizedValue}-fg}(+23%){/}\
//     {bold}STRATEGY:{/bold} {${ColorTheme.importantValue}-fg}SMA + MAC-D{/}`,
//     tags: true,
//     border: {
//         type: 'line'
//     },
//     style: {
//         fg: ColorTheme.title,
//         border: {
//             fg: ColorTheme.boxEdges
//         },
//         hover: {
//             bg: 'green'
//         }
//     }
// });
  
// // Append our box to the screen.
// app.append( kpisBox );

// // Top box containing the KPIs
// const transactionLogsBox = box({
//     top: 2,
//     left: 'left',
//     height: '40%',
//     width: '100%',
//     shrink: true,
//     valign: 'top',
//     align: 'center',
//     content: `{bold}TRANSACTION LOGS{/bold}`,
//     tags: true,
//     border: {
//         type: 'line'
//     },
//     style: {
//         fg: ColorTheme.title,
//         border: {
//             fg: ColorTheme.boxEdges
//         },
//         hover: {
//             bg: 'green'
//         }
//     }
// });

// // Top box containing the KPIs
// const transactionLogsTable = table({
//     top: 1,
//     width: '99%',
//     shrink: true,
//     tags: true,
//     border: {
//         type: 'bg'
//     },
//     scrollable: true,
//     scrollbar: {
//         style: {
//             bg: '#FF0000'
//         }
//     },
//     // noCellBorders: true,
//     // fillCellBorders: true,
//     style: {
//         fg: ColorTheme.title,
//         border: {
//             fg: '#333'
//         },
//         header: {
//             bg: '#005544',
//             border: {
//                 fg: 'blue',
//             },
//             align: 'left'
//         }
//     }
// });

// transactionLogsTable.setData([
//     [ '{bold}{#005544-bg}Date',  'Operation', 'Volume', 'Price', 'Order', 'Time in Force', 'Order add. options', 'Trigger', 'Status', 'Profit{/}' ],
//     [ '2017-02-01 12:01:23', `{${ColorTheme.emphasizedValue}-fg}BUY{/}`, '12', `{${ColorTheme.negativeValue}-fg}-$242{/}`, 'STOP-LIMIT', 'DAY', 'LIMIT = $43', 'Open < SMA', 'FILLED', '...'  ],
//     [ '2017-02-01 12:01:23', 'BUY', '12', '-$242', 'STOP-LIMIT', 'DAY', 'LIMIT = $43', 'Open < SMA', 'FILLED', '...'  ],
//     [ '2017-02-01 12:01:23', 'BUY', '12', '-$242', 'STOP-LIMIT', 'DAY', 'LIMIT = $43', 'Open < SMA', 'FILLED', '...'  ],
//     [ '2017-02-01 12:01:23', 'BUY', '12', '-$242', 'STOP-LIMIT', 'DAY', 'LIMIT = $43', 'Open < SMA', 'FILLED', '...'  ],
//     [ '2017-02-01 12:01:23', 'BUY', '12', '-$242', 'STOP-LIMIT', 'DAY', 'LIMIT = $43', 'Open < SMA', 'FILLED', '...'  ],
//     [ '2017-02-01 12:01:23', 'BUY', '12', '-$242', 'STOP-LIMIT', 'DAY', 'LIMIT = $43', 'Open < SMA', 'FILLED', '...'  ],
//     [ '2017-02-01 12:01:23', 'BUY', '12', '-$242', 'STOP-LIMIT', 'DAY', 'LIMIT = $43', 'Open < SMA', 'FILLED', '...'  ],
//     [ '2017-02-01 12:01:23', 'BUY', '12', '-$242', 'STOP-LIMIT', 'DAY', 'LIMIT = $43', 'Open < SMA', 'FILLED', '...'  ],
//     [ '2017-02-01 12:01:23', 'BUY', '12', '-$242', 'STOP-LIMIT', 'DAY', 'LIMIT = $43', 'Open < SMA', 'FILLED', '...'  ],
//     [ '2017-02-01 12:01:23', 'BUY', '12', '-$242', 'STOP-LIMIT', 'DAY', 'LIMIT = $43', 'Open < SMA', 'FILLED', '...'  ],
//     [ '2017-02-01 12:01:23', 'BUY', '12', '-$242', 'STOP-LIMIT', 'DAY', 'LIMIT = $43', 'Open < SMA', 'FILLED', '...'  ],
//     [ '2017-02-01 12:01:23', 'BUY', '12', '-$242', 'STOP-LIMIT', 'DAY', 'LIMIT = $43', 'Open < SMA', 'FILLED', '...'  ],
//     [ '2017-02-01 12:01:23', 'BUY', '12', '-$242', 'STOP-LIMIT', 'DAY', 'LIMIT = $43', 'Open < SMA', 'FILLED', '...'  ],
//   ]);
  
// // Append our box to the screen.
// transactionLogsBox.append( transactionLogsTable );
// app.append( transactionLogsBox );

// // Quit on Escape, q, or Control-C.
// app.key(['escape', 'q', 'C-c'], function( ch: any, key: any ) {
//     console.log( ch, key );
//     return process.exit(0);
// });

// // Render the screen.
// app.render();

// OrderController.request( 'AAPL', 2, Side.BUY, OrderType.MARKET, TimeInForce.DAY ).then(( order: Order ) => {
//     console.log( order );
// }).catch(( err: any ) => {
//     console.log( err );
// });


OrderController.get( '2019-05-10T15:00:00Z', '2019-05-10T23:00:00Z' ).then(( orders: Order[] ) => {
    // console.log( orders[orders.length - 1] );
}).catch(( err: any ) => {
    console.log( err );
});

Streaming.connect();

// indicators.sma.indicator( [[-1]], [3], ( err: string, results: number[] ) => {
//     console.log( err );
//     console.log( results );
// });




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


// Use the clock controller to check for opening time
// let marketOpened: boolean = false;

// Check if the market is open or close
ClockController.get().then(( clock: Clock ) => {
    // marketOpened = clock.isOpen
    // console.log( marketOpened );
}).catch(( err: any ) => {
    console.log( err );
});

// Setup websocket communications
// Streaming.setup();
// Streaming.messages.subscribe(( message: string ) => {
//     console.log( 'Got', message );
// });

// Refresh market status every minute
setInterval(() => {
    ClockController.get().then(( clock: Clock ) => {
        // marketOpened = clock.isOpen
    }).catch(( err: any ) => {
        console.log( err );
    });
}, 60 * 1000 );

// Refresh account state every minute
AccountController.get().then(( account: Account ) => {
    console.log( account );
}).catch(( err: any ) => {
    console.log( err );
});