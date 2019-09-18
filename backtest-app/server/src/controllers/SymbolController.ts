/*
 * File: QuoteController.ts
 * Project: server
 * File Created: Sunday, 14th April 2019 12:27:23 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Tuesday, 4th June 2019 12:35:29 am
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



import { get } from 'request-promise-native';

import { Constants } from '../constants';
import { v4 } from 'uuid';

import { Helper } from '../Helper';
import { OperationState } from '../models/OperationState';
import { Symbol, SymbolAdapter } from '../models/Symbol';

export class SymbolController {

    /**
     * Get all supported symbols
     * 
     * @public
     * @returns {Promise<Symbol[]>} Symbol[]
     */
    public static get(): Promise<Symbol[]> {
        return new Promise( async ( resolve, reject ) => {
            const msg:   string = `Fetching all symbols`;
            const uuid:  string = v4().replace( /^([^\-]*)\-.*/, '$1' );
            const route: string = `ref-data/symbols`;
            console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
            get( `${Constants.ALPACA_API_URL}/${Constants.API_VERSION}/${route}` ).then(( data: any ) => {
                const response:      any            = JSON.parse( data );
                const output:        Symbol[]       = [];
                const symbolAdapter: SymbolAdapter  = new SymbolAdapter();

                for ( let i = 0 ; i < response.length; i++ ) {
                    const symbolData: any    = response[i];
                    const symbol:     Symbol = symbolAdapter.adapt( symbolData );
                    output.push( symbol );
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