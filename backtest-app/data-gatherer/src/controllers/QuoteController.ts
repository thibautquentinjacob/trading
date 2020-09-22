import { get } from 'request-promise-native';
import { v4 } from 'uuid';
import { Constants } from '../constants';
import { Helper } from '../Helper';
import { IQuoteAPI } from '../models/IQuoteAPI';
import { Quote, QuoteAdapter } from '../models/Quote';

export class QuoteController {
    /**
     * Get all quotes for input symbol.
     *
     * @public
     * @param {symbol} string - Symbol to get a quote of
     * @returns {Promise<Quote[]>} Quote Object array
     */
    public static getQuotes(symbol: string): Promise<Quote[]> {
        return new Promise((resolve, reject) => {
            const msg = `Fetching all quotes for symbol ${symbol}`;
            const uuid: string = v4().replace(/^([^-]*)-.*/, '$1');
            const route = `quote`;
            Helper.pending(route, msg, uuid);
            get(
                `${Constants.IEX_CLOUD_DATA_URL}/${Constants.IEX_CLOUD_VERSION}/stock/${symbol}/intraday-prices?token=${Constants.IEX_CLOUD_PRIVATE_TOKEN}`
            )
                .then(async (data: string) => {
                    Helper.success(route, msg, uuid);
                    const output: Quote[] = [];
                    const response: IQuoteAPI[] = JSON.parse(data);
                    const quoteAdapter: QuoteAdapter = new QuoteAdapter();
                    for (let i = 0, size = response.length; i < size; i++) {
                        response[i].symbol = symbol;
                        const quote: Quote = quoteAdapter.adapt(response[i]);
                        output.push(quote);
                    }
                    resolve(output);
                })
                .catch((err) => {
                    Helper.failure(route, msg, uuid, {
                        name: err.name,
                        statusCode: err.statusCode,
                    });
                    reject(err);
                });
        });
    }

    /**
     * Get last quote for input symbol.
     *
     * @public
     * @param {symbol} string - Symbol to get a quote of
     * @returns {Promise<Quote>} Quote Object
     */
    public static getLastQuote(symbol: string): Promise<Quote> {
        return new Promise((resolve, reject) => {
            const msg = `Fetching last quote for symbol ${symbol}`;
            const uuid: string = v4().replace(/^([^-]*)-.*/, '$1');
            const route = `quote`;
            Helper.pending(route, msg, uuid);
            get(
                `${Constants.IEX_CLOUD_DATA_URL}/${Constants.IEX_CLOUD_VERSION}/stock/${symbol}/intraday-prices?chartLast=1&token=${Constants.IEX_CLOUD_PRIVATE_TOKEN}`
            )
                .then((data: string) => {
                    Helper.success(route, msg, uuid);
                    const response: IQuoteAPI[] = JSON.parse(data);
                    response[0].symbol = symbol;
                    const quoteAdapter: QuoteAdapter = new QuoteAdapter();
                    resolve(quoteAdapter.adapt(response[0]));
                })
                .catch((err) => {
                    Helper.failure(route, msg, uuid, {
                        name: err.name,
                        statusCode: err.statusCode,
                    });
                    reject(err);
                });
        });
    }
}
