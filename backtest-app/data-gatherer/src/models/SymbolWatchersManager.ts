import { SymbolWatcher } from './SymbolWatcher';

/**
 * Throw when trying to access a symbol which is not monitored
 */
export class SymbolWatchersManagerSymbolNotMonitored extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(
            this,
            SymbolWatchersManagerSymbolNotMonitored.prototype
        );
    }
}

/**
 * Throw when trying to access a symbol which is already monitored
 */
export class SymbolWatchersManagerSymbolAlreadyMonitored extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(
            this,
            SymbolWatchersManagerSymbolAlreadyMonitored.prototype
        );
    }
}

export class SymbolWatchersManager {
    public symbolWatchers!: { [key: string]: SymbolWatcher };

    public constructor({
        symbolWatchers,
    }: {
        symbolWatchers: SymbolWatcher[];
    }) {
        // Add symbol watchers to the inner collection
        this.symbolWatchers = {};
        symbolWatchers.forEach((symbolWatcher: SymbolWatcher) =>
            this.addWatcher(symbolWatcher)
        );
    }

    /**
     * If symbol is not being watched, add new watcher. Otherwise, throw
     * SymbolWatchersManagerSymbolAlreadyMonitored error.
     *
     * @param {string} symbol - Symbol to watch
     * @param {number} refreshRate - Refresh interval
     */
    public addWatcher({
        symbol,
        refreshRate,
    }: {
        symbol: string;
        refreshRate: number;
    }): void {
        if (symbol in this.symbolWatchers) {
            throw new SymbolWatchersManagerSymbolAlreadyMonitored(
                `Symbol is already being monitored: ${symbol}`
            );
        }
        this.symbolWatchers[symbol] = new SymbolWatcher({
            symbol: symbol,
            refreshRate: refreshRate,
        });
        this.symbolWatchers[symbol].watch();
    }

    /**
     * Update SymbolWatcher properties. If symbol is not watched, add it to the
     * list.
     *
     * @param {string} symbol - Symbol to update
     * @param {refreshRate} number - Refresh rate to update
     */
    public updateWatcher({
        symbol,
        refreshRate,
    }: {
        symbol: string;
        refreshRate: number;
    }): void {
        if (!(symbol in this.symbolWatchers)) {
            this.addWatcher({
                symbol: symbol,
                refreshRate: refreshRate,
            });
        }
        this.symbolWatchers[symbol].refreshRate = refreshRate;
    }

    /**
     * If symbol is being watched, unwatch and delete it. Otherwise, throw
     * SymbolWatchersManagerSymbolNotMonitored error.
     *
     * @param {string} symbol - Symbol to remove
     * @throws {SymbolWatchersManagerSymbolNotMonitored} If symbol not watched
     */
    public removeWatcher({ symbol }: { symbol: string }): void {
        if (!(symbol in this.symbolWatchers)) {
            throw new SymbolWatchersManagerSymbolNotMonitored(
                `Symbol not monitored: ${symbol}`
            );
        }
        this.symbolWatchers[symbol].unwatch();
        delete this.symbolWatchers[symbol];
    }
}
