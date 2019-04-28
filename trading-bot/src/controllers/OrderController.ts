/*
 * File: AccountController.ts
 * Project: server
 * File Created: Tuesday, 26th March 2019 12:31:58 am
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Tuesday, 2nd April 2019 12:24:19 am
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



import { get, del } from 'request-promise-native';
import { v4 } from 'uuid';

import { Constants } from '../constants';
import { Order, OrderAdapter } from "../models/Order";
import { OrderStatus } from '../models/OrderStatus';
import { Direction } from '../models/Direction';
import { Helper } from '../Helper';
import { OperationState } from '../models/OperationState';

export class OrderController {

    /**
     * Get all orders
     * 
     * @public
     * @returns {Promise<Order[]>} Order[] Object
     */
    public static get(
        after:     number,
        until:     number,
        status:    OrderStatus = OrderStatus.NEW,
        limit:     number      = 50,
        direction: Direction   = Direction.DESC
    ): Promise<Order[]> {
        const lowerDate: Date = new Date( after );
        const upperDate: Date = new Date( until );
        const msg:   string = `Fetching order between ${lowerDate} and ${upperDate} widh status ${status}`;
        const uuid:  string = v4().replace( /^([^\-]*)\-.*/, '$1' );
        const route: string = `orders`;
        return new Promise( async ( resolve, reject ) => {
            get( `${Constants.API_URL}/v1/${route}`, {
                headers: Constants.defaultHeaders
            }).then(( data: any ) => {
                const response:     any          = JSON.parse( data );
                const orderAdapter: OrderAdapter = new OrderAdapter();
                const output:       Order[]      = [];
                
                for ( let i = 0 ; i < response.length; i++ ) {
                    const orderData: any = response[i];
                    output.push( orderAdapter.adapt( orderData ));
                }
                console.log( Helper.formatLog( route, msg, uuid, OperationState.SUCCESS ));
                resolve( output );
            }).catch(( err: any ) => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.FAILURE, { name: err.name, statusCode: err.statusCode }));
                reject( err );
            });
        });
    }

    /**
     * Get order by id
     * 
     * @public
     * @returns {Promise<Order>} Order Object
     */
    public static getById(
        orderId: string
    ): Promise<Order> {
        const msg:   string = `Fetching order by ID ${orderId}`;
        const uuid:  string = v4().replace( /^([^\-]*)\-.*/, '$1' );
        const route: string = `orders/${orderId}`;
        console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
        return new Promise( async ( resolve, reject ) => {
            get( `${Constants.API_URL}/v1/${route}`, {
                headers: Constants.defaultHeaders
            }).then(( data: any ) => {
                const response:     any          = JSON.parse( data );
                const orderAdapter: OrderAdapter = new OrderAdapter();
                console.log( Helper.formatLog( route, msg, uuid, OperationState.SUCCESS ));
                resolve( orderAdapter.adapt( response ));
            }).catch(( err: any ) => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.FAILURE, { name: err.name, statusCode: err.statusCode }));
                reject( err );
            });
        });
    }

    /**
     * Get order by client id
     * 
     * @public
     * @returns {Promise<Order>} Order Object
     */
    public static getByClientId(
        clientId: string
    ): Promise<Order> {
        return new Promise( async ( resolve, reject ) => {
            const msg:   string = `Fetching order using client ID ${clientId}`;
            const uuid:  string = v4().replace( /^([^\-]*)\-.*/, '$1' );
            const route: string = `orders:${clientId}`;
            console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
            get( `${Constants.API_URL}/v1/${route}`, {
                headers: Constants.defaultHeaders
            }).then(( data: any ) => {
                const response:     any          = JSON.parse( data );
                const orderAdapter: OrderAdapter = new OrderAdapter();
                console.log( Helper.formatLog( route, msg, uuid, OperationState.SUCCESS ));
                resolve( orderAdapter.adapt( response ));
            }).catch(( err: any ) => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.FAILURE, { name: err.name, statusCode: err.statusCode }));
                reject( err );
            });
        });
    }

    /**
     * Cancel an order
     * 
     * @public
     * @returns {Promise<void>} void
     */
    public static cancel(
        orderId: string
    ): Promise<void> {
        return new Promise( async ( resolve, reject ) => {
            const msg:   string = `Cancelling order ${orderId}`;
            const uuid:  string = v4().replace( /^([^\-]*)\-.*/, '$1' );
            const route: string = `orders/${orderId}`;
            console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
            del( `${Constants.API_URL}/v1/${route}`, {
                headers: Constants.defaultHeaders
            }).then(() => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
                resolve();
            }).catch(( err ) => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.FAILURE, { name: err.name, statusCode: err.statusCode }));
                reject( err );
            });
        });
    }

}