import * as Faker from 'faker';
import { Quote } from './Quote';

export class QuoteBuilder {
    private symbol!: string;
    private date!: Date;
    private open!: number;
    private high!: number;
    private low!: number;
    private close!: number;
    private average!: number;
    private volume!: number;
    private notional!: number;
    private numberOfTrades!: number;
    private changeOverTime!: number;
    private marketOpen!: number;
    private marketHigh!: number;
    private marketLow!: number;
    private marketClose!: number;
    private marketAverage!: number;
    private marketVolume!: number;
    private marketNotional!: number;
    private marketNumberOfTrades!: number;
    private marketChangeOverTime!: number;

    public withSymbol(value: string): QuoteBuilder {
        this.symbol = value;
        return this;
    }

    public withDate(value: Date): QuoteBuilder {
        this.date = value;
        return this;
    }

    public withOpen(value: number): QuoteBuilder {
        this.open = value;
        return this;
    }

    public withHigh(value: number): QuoteBuilder {
        this.high = value;
        return this;
    }

    public withLow(value: number): QuoteBuilder {
        this.low = value;
        return this;
    }

    public withClose(value: number): QuoteBuilder {
        this.close = value;
        return this;
    }

    public withAverage(value: number): QuoteBuilder {
        this.average = value;
        return this;
    }

    public withVolume(value: number): QuoteBuilder {
        this.open = value;
        return this;
    }

    public withNotional(value: number): QuoteBuilder {
        this.notional = value;
        return this;
    }

    public withNumberOfTrades(value: number): QuoteBuilder {
        this.numberOfTrades = value;
        return this;
    }

    public withChangeOverTime(value: number): QuoteBuilder {
        this.numberOfTrades = value;
        return this;
    }

    public withMarketOpen(value: number): QuoteBuilder {
        this.marketOpen = value;
        return this;
    }

    public withMarketHigh(value: number): QuoteBuilder {
        this.numberOfTrades = value;
        return this;
    }

    public withMarketLow(value: number): QuoteBuilder {
        this.marketLow = value;
        return this;
    }

    public withMarketClose(value: number): QuoteBuilder {
        this.marketClose = value;
        return this;
    }

    public withMarketAverage(value: number): QuoteBuilder {
        this.marketAverage = value;
        return this;
    }

    public withMarketVolume(value: number): QuoteBuilder {
        this.marketVolume = value;
        return this;
    }

    public withMarketNotional(value: number): QuoteBuilder {
        this.marketNotional = value;
        return this;
    }

    public withMarketNumberOfTrades(value: number): QuoteBuilder {
        this.marketNumberOfTrades = value;
        return this;
    }

    public withMarketChangeOverTime(value: number): QuoteBuilder {
        this.marketChangeOverTime = value;
        return this;
    }

    public getSymbolOrDefault(): string {
        return this.symbol || Faker.random.word();
    }

    public getDateOrDefault(): Date {
        return this.date || Faker.date.recent();
    }

    public getOpenOrDefault(): number {
        return this.open !== undefined ? this.open : Faker.random.number();
    }

    public getHighOrDefault(): number {
        return this.high !== undefined ? this.high : Faker.random.number();
    }

    public getLowOrDefault(): number {
        return this.low !== undefined ? this.low : Faker.random.number();
    }

    public getCloseOrDefault(): number {
        return this.close !== undefined ? this.close : Faker.random.number();
    }

    public getAverageOrDefault(): number {
        return this.average !== undefined
            ? this.average
            : Faker.random.number();
    }

    public getVolumeOrDefault(): number {
        return this.volume !== undefined ? this.volume : Faker.random.number();
    }

    public getNotionalOrDefault(): number {
        return this.notional !== undefined
            ? this.notional
            : Faker.random.number();
    }

    public getNumberOfTradesOrDefault(): number {
        return this.numberOfTrades !== undefined
            ? this.numberOfTrades
            : Faker.random.number();
    }

    public getChangeOverTimeOrDefault(): number {
        return this.changeOverTime !== undefined
            ? this.changeOverTime
            : Faker.random.number();
    }

    public getMarketOpenOrDefault(): number {
        return this.marketOpen !== undefined
            ? this.marketOpen
            : Faker.random.number();
    }

    public getMarketHighOrDefault(): number {
        return this.marketHigh !== undefined
            ? this.marketHigh
            : Faker.random.number();
    }

    public getMarketLowOrDefault(): number {
        return this.marketLow !== undefined
            ? this.marketLow
            : Faker.random.number();
    }

    public getMarketCloseOrDefault(): number {
        return this.marketClose !== undefined
            ? this.marketClose
            : Faker.random.number();
    }

    public getMarketAverageOrDefault(): number {
        return this.marketAverage !== undefined
            ? this.marketAverage
            : Faker.random.number();
    }

    public getMarketVolumeOrDefault(): number {
        return this.marketVolume !== undefined
            ? this.marketVolume
            : Faker.random.number();
    }

    public getMarketNotionalOrDefault(): number {
        return this.marketNotional !== undefined
            ? this.marketNotional
            : Faker.random.number();
    }

    public getMarketNumberOfTradesOrDefault(): number {
        return this.marketNumberOfTrades !== undefined
            ? this.marketNumberOfTrades
            : Faker.random.number();
    }

    public getMarketChangeOverTimeOrDefault(): number {
        return this.marketChangeOverTime !== undefined
            ? this.marketChangeOverTime
            : Faker.random.number();
    }

    build(): Quote {
        return new Quote({
            symbol: this.getSymbolOrDefault(),
            date: this.getDateOrDefault(),
            open: this.getOpenOrDefault(),
            high: this.getHighOrDefault(),
            low: this.getLowOrDefault(),
            close: this.getCloseOrDefault(),
            average: this.getAverageOrDefault(),
            volume: this.getVolumeOrDefault(),
            notional: this.getNotionalOrDefault(),
            numberOfTrades: this.getNumberOfTradesOrDefault(),
            changeOverTime: this.getChangeOverTimeOrDefault(),
            marketOpen: this.getMarketOpenOrDefault(),
            marketHigh: this.getMarketHighOrDefault(),
            marketLow: this.getMarketLowOrDefault(),
            marketClose: this.getMarketCloseOrDefault(),
            marketAverage: this.getMarketAverageOrDefault(),
            marketVolume: this.getMarketVolumeOrDefault(),
            marketNotional: this.getMarketNotionalOrDefault(),
            marketNumberOfTrades: this.getMarketNumberOfTradesOrDefault(),
            marketChangeOverTime: this.getMarketChangeOverTimeOrDefault(),
        });
    }
}
