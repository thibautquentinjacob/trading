/*
 * File: PositionController.ts
 * Project: server
 * File Created: Tuesday, 2nd April 2019 12:29:49 am
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Tuesday, 2nd April 2019 1:24:03 am
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
import { v4 } from 'uuid';

import { Position, PositionAdapter } from '../models/Position';
import { Helper } from '../Helper';
import { OperationState } from '../models/OperationState';
import { Constants } from '../constants';

export class PositionController {
    
    /**
     * Get opened positions
     * 
     * @public
     * @returns {Promise<Position[]>} Position[]
     */
    public static get(): Promise<Position[]> {
        return new Promise( async ( resolve, reject ) => {
            const msg:   string = 'Fetching account state';
            const uuid:  string = v4().replace( /^([^\-]*)\-.*/, '$1' );
            const route: string = `account`;
            console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
            get( `${Constants.API_URL}/v1/${route}`, {
                headers: Constants.defaultHeaders
            }).then(( data: any ) => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.SUCCESS ));
                const response:        any             = JSON.parse( data );
                const positionAdapter: PositionAdapter = new PositionAdapter();
                const output:          Position[]      = [];
                
                for ( let i = 0 ; i < response.length; i++ ) {
                    const positionData: any = response[i];
                    output.push( positionAdapter.adapt( positionData ));
                }
                resolve( output );
            }).catch(( err: any ) => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.FAILURE, { name: err.name, statusCode: err.statusCode }));
                reject( err );
            });
        });
    }

    /**
     * Get open position corresponding to input symbol
     * 
     * @public
     * @param {string} symbol - Symbol to search for
     * @returns {Promise<Position>} Position
     */
    public static getBySymbol( symbol: string ): Promise<Position> {
        return new Promise( async ( resolve, reject ) => {
            const msg:   string = `Fetching opened position by symbol ${symbol}`;
            const uuid:  string = v4().replace( /^([^\-]*)\-.*/, '$1' );
            const route: string = `positions/${symbol}`;
            console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
            get( `${Constants.API_URL}/v1/${route}`, {
                headers: Constants.defaultHeaders
            }).then(( data: any ) => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.SUCCESS ));
                const response:        any             = JSON.parse( data );
                const positionAdapter: PositionAdapter = new PositionAdapter();
                resolve( positionAdapter.adapt( response ));
            }).catch(( err: any ) => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.FAILURE, { name: err.name, statusCode: err.statusCode }));
                reject( err );
            });
        });
    }

}
