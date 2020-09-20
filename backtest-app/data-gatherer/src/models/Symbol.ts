import { Adapter } from './IAdapter';
import { ISymbolAPI } from './ISymbolAPI';

export class StockSymbol {
    public readonly name: string;
    public readonly symbol: string;

    constructor({ name, symbol }: { name: string; symbol: string }) {
        this.name = name;
        this.symbol = symbol;
    }
}

// Build Symbol object out of API data
export class SymbolAdapter implements Adapter<ISymbolAPI, StockSymbol> {
    public adapt(symbolData: ISymbolAPI): StockSymbol {
        return new StockSymbol({
            symbol: symbolData.symbol,
            name: symbolData.name,
        });
    }
}
