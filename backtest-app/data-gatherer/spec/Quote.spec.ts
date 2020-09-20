import { IQuoteAPI } from '../src/models/IQuoteAPI';
import { Quote, QuoteAdapter } from '../src/models/Quote';
import { QuoteBuilder } from '../src/models/Quote.builder';

describe('Quote', () => {
    describe('constructor', () => {
        let quote: Quote;
        beforeEach(() => {
            quote = new QuoteBuilder().build();
        });

        it('should create a valid Quote', () => {
            expect(quote).toBeDefined();
        });
    });

    describe('QuoteAdapter', () => {
        it('should generate the right Quote from IQuoteAPI data', () => {
            const expectedQuote: Quote = new QuoteBuilder()
                .withDate(new Date('2020-09-11 09:30'))
                .build();
            const quoteData: IQuoteAPI = {
                symbol: expectedQuote.symbol,
                date: '2020-09-11',
                minute: '09:30',
                label: '09:30 AM',
                open: expectedQuote.open,
                high: expectedQuote.high,
                low: expectedQuote.low,
                close: expectedQuote.close,
                average: expectedQuote.average,
                volume: expectedQuote.volume,
                notional: expectedQuote.notional,
                numberOfTrades: expectedQuote.numberOfTrades,
                changeOverTime: expectedQuote.changeOverTime,
                marketOpen: expectedQuote.marketOpen,
                marketHigh: expectedQuote.marketHigh,
                marketLow: expectedQuote.marketLow,
                marketClose: expectedQuote.marketClose,
                marketAverage: expectedQuote.marketAverage,
                marketVolume: expectedQuote.marketVolume,
                marketNotional: expectedQuote.marketNotional,
                marketNumberOfTrades: expectedQuote.marketNumberOfTrades,
                marketChangeOverTime: expectedQuote.marketChangeOverTime,
            };

            expect(new QuoteAdapter().adapt(quoteData)).toEqual(expectedQuote);
        });
    });
});
