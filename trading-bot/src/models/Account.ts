/*
 * File: Account.ts
 * Project: server
 * File Created: Monday, 25th March 2019 12:44:00 am
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Tuesday, 2nd April 2019 12:33:55 am
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



import { Adapter } from './Adapter';

export interface Account {

    id:               string;
    status:           string;
    currency:         string;
    buyingPower:      number;
    cash:             number;
    cashWithdrawable: number;
    portfolioValue:   number;
    patternDayTrader: boolean;
    tradingBlocked:   boolean;
    transfersBlocked: boolean;
    accountBlocked:   boolean;
    createdAt:        Date;

}

// Build Account object out of API data
export class AccountAdapter implements Adapter<Account> {

    public adapt( accountData: any ): Account {

        return {
            id:               accountData.id,
            status:           accountData.status,
            currency:         accountData.currency,
            buyingPower:      parseFloat( accountData.buying_power ),
            cash:             parseFloat( accountData.cash ),
            cashWithdrawable: parseFloat( accountData.cash_withdrawable ),
            portfolioValue:   parseFloat( accountData.portfolio_value ),
            patternDayTrader: accountData.pattern_day_trader,
            tradingBlocked:   accountData.trading_blocked,
            transfersBlocked: accountData.transfers_blocked,
            accountBlocked:   accountData.account_blocked,
            createdAt:        new Date( accountData.created_at )
        };
    }

}