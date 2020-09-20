import { StockSymbol, SymbolAdapter } from '../src/models/Symbol';

describe('Symbol', () => {
    describe('constructor', () => {
        let stockSymbol: StockSymbol;
        beforeEach(() => {
            stockSymbol = new StockSymbol({
                name: 'Apple Inc.',
                symbol: 'AAPL',
            });
        });

        it('should assign the right name', () => {
            expect(stockSymbol.name).toEqual('Apple Inc.');
        });

        it('should assign the right symbol', () => {
            expect(stockSymbol.symbol).toEqual('AAPL');
        });
    });

    describe('adapter', () => {
        it('should produce the right StockSymbol', () => {
            const expectedStockSymbol: StockSymbol = new StockSymbol({
                name: 'Apple Inc.',
                symbol: 'AAPL',
            });
            expect(
                new SymbolAdapter().adapt({
                    name: 'Apple Inc.',
                    symbol: 'AAPL',
                })
            ).toEqual(expectedStockSymbol);
        });
    });
});
