/*
 * File: Quote.ts
 * Project: server
 * File Created: Sunday, 14th April 2019 12:21:51 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Friday, 7th June 2019 9:30:07 pm
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



import { Quote } from './Quote';
import { indicators, Indicator } from 'tulind';

export class QuoteCollection {

    private _quotes:                     Quote[];
    private _technicalIndicators:        {[key: string]: string };
    private _technicalIndicatorsOptions: {[key: string]: number[]}
    // Which columns to use for each indicator
    private _dataColumns:                {[key: string]: string };

    constructor(
        quotes:            Quote[],
        indicators:        {[key: string]: string }  = {},
        indicatorsOptions: {[key: string]: number[]} = {},
        dataColumns:       {[key: string]: string }  = {}
    ) {
        this._quotes                     = quotes;
        this._technicalIndicators        = indicators;
        this._technicalIndicatorsOptions = indicatorsOptions;
        this._dataColumns                = dataColumns;

        this._computeIndicatorValues();
    }

    private _computeIndicatorValues(): void {
        const dataColumnsKeys:   string[]                    = Object.keys( this._dataColumns )
        const dataColumnsAmount: number                      = dataColumnsKeys.length;
        const quotesAmount:      number                      = this._quotes.length;
        const indicatorKeys:     string[]                    = Object.keys( this._technicalIndicators );
        const indicatorsAmount:  number                      = indicatorKeys.length;
        const Tulind:            {[key: string]: Indicator } = indicators;
        const dataRows:          {[key: string]: number[] }  = {};

        // For each data columns, extract values from quotes and store them
        for ( let i = 0 ; i < dataColumnsAmount ; i++ ) {
            const column: string   = this._dataColumns[dataColumnsKeys[i]];
            const row:    number[] = [];
            
            // For each quote, get data corresponding to the column
            for ( let j = 0 ; j < quotesAmount ; j++ ) {
                const quote: Quote = this._quotes[j];
                row.push( quote[column] as number );
            }

            dataRows[column] = row;
        }

        // For each indicators, compute values
        for ( let i = 0 ; i < indicatorsAmount ; i++ ) {
            const indicator: string = this._technicalIndicators[indicatorKeys[i]];
            const offset:    number = Tulind[indicator].start( this._technicalIndicatorsOptions[indicatorKeys[i]]);
            Tulind[indicator].indicator(
                [dataRows[this._dataColumns[indicatorKeys[i]]]],
                this._technicalIndicatorsOptions[indicatorKeys[i]], ( err: string, results: number[][]) => {
                // Insert indicator data back into quotes
                if ( !err ) {
                    const indicatorNameWithOptions: string = `${indicator}_${this._technicalIndicatorsOptions[indicatorKeys[i]].join( '_' )}`;
                    const resultsAmount:            number = results[0].length;
                    // For each result entry, add it to the corresponding quote
                    for ( let j = 0 ; j < resultsAmount ; j++ ) {
                        for ( let k = 0 ; k < results.length ; k++ ) {
                            this._quotes[j + offset][`${indicatorNameWithOptions}_${k}`] = results[k][j];
                        }
                    }
                } else {
                    console.log( err );
                }
            });
        }
    }

    get quotes (): Quote[] {
        return this._quotes;
    }

    set quotes ( quotes: Quote[]) {
        this._quotes = quotes;
    }

    get technicalIndicators (): {[key: string]: string } {
        return this._technicalIndicators;
    }

    set technicalIndicators ( technicalIndicators: {[key: string]: string }) {
        this._technicalIndicators = technicalIndicators;
    }

    get technicalIndicatorsOptions (): {[key: string]: number[]} {
        return this._technicalIndicatorsOptions;
    }

    set technicalIndicatorsOptions ( technicalIndicatorsOptions: {[key: string]: number[]}) {
        this._technicalIndicatorsOptions = technicalIndicatorsOptions;
    }

    get dataColumns (): {[key: string]: string } {
        return this._dataColumns;
    }

    set dataColumns ( dataColumns: {[key: string]: string }) {
        this._dataColumns = dataColumns;
    }

}
