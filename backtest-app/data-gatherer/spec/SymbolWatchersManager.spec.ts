import { SymbolWatcher } from '../src/models/SymbolWatcher';
import { SymbolWatchersManager } from '../src/models/SymbolWatchersManager';

describe('SymbolWatchersManager', () => {
    function areSymbolWatchersEqual(
        symbolWatcherA: SymbolWatcher,
        symbolWatcherB: SymbolWatcher
    ) {
        return (
            symbolWatcherA.symbol === symbolWatcherB.symbol &&
            symbolWatcherA.refreshRate === symbolWatcherB.refreshRate
        );
    }

    describe('constructor', () => {
        it('should add all the watchers', () => {
            const symbolWatchers: SymbolWatcher[] = [
                new SymbolWatcher({
                    symbol: 'AAPL',
                    refreshRate: 23456,
                }),
                new SymbolWatcher({
                    symbol: 'MSFT',
                    refreshRate: 34567,
                }),
            ];
            const symbolWatchersManager: SymbolWatchersManager = new SymbolWatchersManager(
                {
                    symbolWatchers: symbolWatchers,
                }
            );
            expect(
                Object.keys(symbolWatchersManager.symbolWatchers).length
            ).toEqual(symbolWatchers.length);
            symbolWatchers.forEach((symbolWatcher: SymbolWatcher) => {
                expect(
                    areSymbolWatchersEqual(
                        symbolWatchersManager.symbolWatchers[
                            symbolWatcher.symbol
                        ],
                        symbolWatcher
                    )
                ).toBeTruthy();
            });
        });
    });

    describe('addWatcher', () => {
        let symbolWatchersManager: SymbolWatchersManager;
        beforeEach(() => {
            symbolWatchersManager = new SymbolWatchersManager({
                symbolWatchers: [],
            });
        });

        it('should add new watcher', () => {
            symbolWatchersManager.addWatcher({
                symbol: 'AAPL',
                refreshRate: 23456,
            });
            expect(
                areSymbolWatchersEqual(
                    symbolWatchersManager.symbolWatchers['AAPL'],
                    new SymbolWatcher({
                        symbol: 'AAPL',
                        refreshRate: 23456,
                    })
                )
            ).toBeTruthy();
            expect(
                Object.keys(symbolWatchersManager.symbolWatchers).length
            ).toEqual(1);
        });

        it('should not add new watcher if it already exists and should throw SymbolWatchersManagerSymbolAlreadyMonitored', () => {
            symbolWatchersManager.addWatcher({
                symbol: 'AAPL',
                refreshRate: 23456,
            });
            expect(() => {
                symbolWatchersManager.addWatcher({
                    symbol: 'AAPL',
                    refreshRate: 23456,
                });
            }).toThrowError('Symbol is already being monitored: AAPL');
            expect(
                Object.keys(symbolWatchersManager.symbolWatchers).length
            ).toEqual(1);
        });
    });

    describe('updateWatcher', () => {
        let symbolWatchersManager: SymbolWatchersManager;
        beforeEach(() => {
            symbolWatchersManager = new SymbolWatchersManager({
                symbolWatchers: [],
            });
        });

        it('should add new watcher if it does not exist', () => {
            symbolWatchersManager.updateWatcher({
                symbol: 'AAPL',
                refreshRate: 23456,
            });
            expect(
                areSymbolWatchersEqual(
                    symbolWatchersManager.symbolWatchers['AAPL'],
                    new SymbolWatcher({
                        symbol: 'AAPL',
                        refreshRate: 23456,
                    })
                )
            ).toBeTruthy();
            expect(
                Object.keys(symbolWatchersManager.symbolWatchers).length
            ).toEqual(1);
        });

        it('should update watcher if it exists', () => {
            symbolWatchersManager.updateWatcher({
                symbol: 'AAPL',
                refreshRate: 23456,
            });
            symbolWatchersManager.updateWatcher({
                symbol: 'AAPL',
                refreshRate: 34567,
            });
            expect(
                areSymbolWatchersEqual(
                    symbolWatchersManager.symbolWatchers['AAPL'],
                    new SymbolWatcher({
                        symbol: 'AAPL',
                        refreshRate: 34567,
                    })
                )
            ).toBeTruthy();
            expect(
                Object.keys(symbolWatchersManager.symbolWatchers).length
            ).toEqual(1);
        });
    });

    describe('removeWatcher', () => {
        let symbolWatchersManager: SymbolWatchersManager;
        beforeEach(() => {
            symbolWatchersManager = new SymbolWatchersManager({
                symbolWatchers: [
                    new SymbolWatcher({
                        symbol: 'AAPL',
                        refreshRate: 23456,
                    }),
                    new SymbolWatcher({
                        symbol: 'MSFT',
                        refreshRate: 23456,
                    }),
                ],
            });
        });

        it('should remove watcher if it exists', () => {
            symbolWatchersManager.removeWatcher({
                symbol: 'AAPL',
            });
            expect(
                Object.keys(symbolWatchersManager.symbolWatchers).length
            ).toEqual(1);
        });

        it('should throw SymbolWatchersManagerSymbolNotMonitored if watcher does not exist', () => {
            expect(() => {
                symbolWatchersManager.removeWatcher({
                    symbol: 'ABCD',
                });
            }).toThrowError('Symbol not monitored: ABCD');
            expect(
                Object.keys(symbolWatchersManager.symbolWatchers).length
            ).toEqual(2);
        });
    });
});
