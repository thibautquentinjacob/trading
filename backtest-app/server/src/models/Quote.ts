/*
 * File: Quote.ts
 * Project: server
 * File Created: Sunday, 14th April 2019 12:21:51 pm
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



import { Adapter } from './Adapter';

export interface Quote {

    date:                 number;
    open:                 number;
    high:                 number;
    low:                  number;
    close:                number;
    average:              number;
    volume:               number;
    changeOverTime:       number;
    numberOfTrades:       number;
    marketOpen:           number;
    marketHigh:           number;
    marketLow:            number;
    marketClose:          number;
    marketAverage:        number;
    marketVolume:         number;
    marketNumberOfTrades: number;
    marketChangeOverTime: number;
    [key: string]:        number;
}

// Build Quote object out of API data
export class QuoteAdapter implements Adapter<Quote> {

    public adapt( quoteData: any ): Quote {
        const regexp: RegExp = /(\d{4})(\d{2})(\d{2})/;
        const date:   Date   = new Date( `${quoteData.date.replace( regexp, '$1-$2-$3' )} ${quoteData.minute}` );

        return {
            date:                 date.getTime(),
            open:                 quoteData.open,
            high:                 quoteData.high,                
            low:                  quoteData.low,                 
            close:                quoteData.close,               
            average:              quoteData.average,             
            volume:               quoteData.volume,              
            changeOverTime:       quoteData.changeOverTime,      
            numberOfTrades:       quoteData.numberOfTrades,      
            marketOpen:           quoteData.marketOpen,          
            marketHigh:           quoteData.marketHigh,          
            marketLow:            quoteData.marketLow,           
            marketClose:          quoteData.marketClose,         
            marketAverage:        quoteData.marketAverage,       
            marketVolume:         quoteData.marketVolume,        
            marketNumberOfTrades: quoteData.marketNumberOfTrades,
            marketChangeOverTime: quoteData.marketChangeOverTime
        };
    }

}
