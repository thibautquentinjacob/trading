import { Stock } from '../src/models/Stock';

describe('Stock', () => {
    describe('constructor', () => {
        let stock: Stock;
        beforeEach(() => {
            stock = new Stock({
                symbol: 'AAPL',
                amount: 20,
            });
        });

        it('should create a valid Stock', () => {
            expect(stock).toBeDefined();
        });

        it('should create a Stock with symbol as expected', () => {
            expect(stock.symbol).toEqual('AAPL');
        });

        it('should create a Stock with amount as expected', () => {
            expect(stock.amount).toEqual(20);
        });

        it('should throw an error if amount < 0', () => {
            expect(() => {
                stock.amount = -1;
            }).toThrowError("Amount can't be inferior to 0: -1");
        });
    });
});
