import * as WebSocket from 'ws';
import { QuoteController } from '../controllers/QuoteController';
import { Quote } from '../models/Quote';
import { QuoteCollection } from '../models/QuoteCollection';
import { MessageHandler } from './message-handler';

export class GetQuoteHandler extends MessageHandler {
    protected handle(ws: WebSocket, message: any): void {
        QuoteController.getQuotes(message.options.quote)
            .then((quotes: Quote[]) => {
                const indicators: {
                    [key: string]: string;
                } = {};
                const indicatorOptions: {
                    [key: string]: number[];
                } = {};
                const dataColumns: {
                    [key: string]: string[];
                } = {};

                const indicatorKeys: string[] = Object.keys(
                    message.options.strategy.indicators
                );
                for (let i = 0, size = indicatorKeys.length; i < size; i++) {
                    const indicator: string = indicatorKeys[i];
                    indicators[indicator] =
                        message.options.strategy.indicators[indicator].name;
                    indicatorOptions[indicator] =
                        message.options.strategy.indicators[indicator].options;
                    dataColumns[indicator] =
                        message.options.strategy.indicators[indicator].metrics;
                }
                const quoteCollection = new QuoteCollection(
                    quotes,
                    indicators,
                    indicatorOptions,
                    dataColumns
                );
                ws.send(JSON.stringify(quoteCollection));
            })
            .catch((err: any) => {
                console.log(err);
            });
    }
}
