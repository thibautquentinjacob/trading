/*
 * File: QuoteController.ts
 * Project: server
 * File Created: Sunday, 14th April 2019 12:27:23 pm
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Wednesday, 17th April 2019 12:02:12 am
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



import { get } from 'request-promise-native';

import { Constants } from '../constants';
import { Quote, QuoteAdapter } from '../models/Quote';
import { v4 } from 'uuid';

import { Helper } from '../Helper';
import { OperationState } from '../models/OperationState';

export class QuoteController {

    /**
     * Get 1 day quotes with 1 min precision for input symbol
     * 
     * @public
     * @param {string} symbol - Quote symbol to fetch
     * @returns {Promise<Quote[]>} Quote[] Object
     */
    public static get( symbol: string ): Promise<Quote[]> {
        return new Promise( async ( resolve, reject ) => {
            const msg:   string = `Fetching quote data for ${symbol}`;
            const uuid:  string = v4().replace( /^([^\-]*)\-.*/, '$1' );
            const route: string = `stock/${symbol}/chart/1d`;
            console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
            get( `${Constants.API_URL}/${Constants.API_VERSION}/${route}` ).then(( data: any ) => {
                const response:     any          = JSON.parse( data );
                const output:       Quote[]      = [];
                const quoteAdapter: QuoteAdapter = new QuoteAdapter();

                for ( let i = 0 ; i < response.length; i++ ) {
                    const quoteData: any = response[i];
                    const quote: Quote   = quoteAdapter.adapt( quoteData );
                    if ( quote.open && quote.high && quote.low && quote.close ) {
                        output.push( quote );
                    }
                }
                console.log( Helper.formatLog( route, msg, uuid, OperationState.SUCCESS ));

                resolve( output );
            }).catch(( err: any ) => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.FAILURE, { name: err.name, statusCode: err.statusCode }));
                reject( err );
            });
        });
    }
}