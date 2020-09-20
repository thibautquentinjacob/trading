import { SymbolWatcher } from '../src/models/SymbolWatcher';

describe('SymbolWatcher', () => {
    describe('constructor', () => {
        it('should create valid instance', () => {
            const symbolWatcher: SymbolWatcher = new SymbolWatcher({
                symbol: 'AAPL',
                refreshRate: 123456,
            });
            expect(symbolWatcher.symbol).toEqual('AAPL');
            expect(symbolWatcher.refreshRate).toEqual(123456);
        });
    });

    describe('refreshRate', () => {
        let symbolWatcher: SymbolWatcher;
        let watchSpy: jasmine.Spy;
        let unwatchSpy: jasmine.Spy;
        beforeEach(() => {
            symbolWatcher = new SymbolWatcher({
                symbol: 'AAPL',
                refreshRate: 123456,
            });
            watchSpy = spyOn(symbolWatcher, 'watch').and.callThrough();
            unwatchSpy = spyOn(symbolWatcher, 'unwatch').and.callThrough();
        });

        it('should not change refresh rate if < 0', () => {
            symbolWatcher.refreshRate = -123456;
            expect(watchSpy).not.toHaveBeenCalled();
            expect(unwatchSpy).not.toHaveBeenCalled();
        });

        it('should not change refresh rate if the value is identical', () => {
            symbolWatcher.refreshRate = 123456;
            expect(watchSpy).not.toHaveBeenCalled();
            expect(unwatchSpy).not.toHaveBeenCalled();
        });

        it('should change refresh rate if the value is different and > 0 and not update watch', () => {
            symbolWatcher.refreshRate = 234561;
            expect(watchSpy).not.toHaveBeenCalled();
            expect(unwatchSpy).not.toHaveBeenCalled();
        });

        it('should change refresh rate if the value is different and > 0 and update watch', () => {
            symbolWatcher.watch();
            symbolWatcher.refreshRate = 234561;
            expect(watchSpy).toHaveBeenCalledTimes(2);
            expect(unwatchSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('watched', () => {
        let symbolWatcher: SymbolWatcher;
        beforeEach(() => {
            symbolWatcher = new SymbolWatcher({
                symbol: 'AAPL',
                refreshRate: 123456,
            });
        });

        it('should return true if interval is set', () => {
            symbolWatcher.watch();
            expect(symbolWatcher.watched).toBeTruthy();
        });

        it('should return false if interval is not set', () => {
            expect(symbolWatcher.watched).toBeFalsy();
            symbolWatcher.watch();
            symbolWatcher.unwatch();
            expect(symbolWatcher.watched).toBeFalsy();
        });
    });

    describe('watch', () => {
        let symbolWatcher: SymbolWatcher;
        beforeEach(() => {
            spyOn<any>(global, 'setInterval').and.callThrough();
            symbolWatcher = new SymbolWatcher({
                symbol: 'AAPL',
                refreshRate: 123456,
            });
        });

        it('should setup a new interval', () => {
            symbolWatcher.watch();
            expect(symbolWatcher['_interval']).toBeDefined();
        });

        it('should not setup a new interval if it already exists', () => {
            symbolWatcher.watch();
            symbolWatcher.watch();
            expect(setInterval).toHaveBeenCalledTimes(1);
        });
    });

    describe('unwatch', () => {
        let symbolWatcher: SymbolWatcher;
        beforeEach(() => {
            spyOn<any>(global, 'clearInterval').and.callThrough();
            symbolWatcher = new SymbolWatcher({
                symbol: 'AAPL',
                refreshRate: 123456,
            });
        });

        it('should clear interval if it exists', () => {
            symbolWatcher.watch();
            symbolWatcher.unwatch();
            expect(clearInterval).toHaveBeenCalledTimes(1);
            expect(symbolWatcher['_interval']).toBeUndefined();
        });

        it("should not clear interval if it doesn't exist", () => {
            symbolWatcher.unwatch();
            expect(clearInterval).not.toHaveBeenCalled();
        });
    });
});
