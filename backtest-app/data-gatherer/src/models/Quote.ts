import {
    getModelForClass,
    index,
    mongoose,
    prop,
    ReturnModelType,
} from '@typegoose/typegoose';
import { Adapter } from './IAdapter';
import { IQuoteAPI } from './IQuoteAPI';

@index({ symbol: 1, date: 1 }, { unique: true })
export class Quote {
    @prop({ required: true, index: true })
    public symbol!: string;

    @prop({ required: true })
    public date!: Date;

    @prop()
    public high!: number;

    @prop()
    public low!: number;

    @prop()
    public average!: number;

    @prop()
    public volume!: number;

    @prop()
    public notional!: number;

    @prop()
    public numberOfTrades!: number;

    @prop()
    public marketHigh!: number;

    @prop()
    public marketLow!: number;

    @prop()
    public marketAverage!: number;

    @prop()
    public marketVolume!: number;

    @prop()
    public marketNotional!: number;

    @prop()
    public marketNumberOfTrades!: number;

    @prop()
    public open!: number;

    @prop()
    public close!: number;

    @prop()
    public marketOpen!: number;

    @prop()
    public marketClose!: number;

    @prop()
    public changeOverTime!: number;

    @prop()
    public marketChangeOverTime!: number;

    @prop({ type: mongoose.Schema.Types.Mixed })
    public customProperties!: { [key: string]: number | Date };

    public constructor({
        symbol,
        date,
        open,
        high,
        low,
        close,
        average,
        volume,
        notional,
        numberOfTrades,
        changeOverTime,
        marketOpen,
        marketHigh,
        marketLow,
        marketClose,
        marketAverage,
        marketVolume,
        marketNotional,
        marketNumberOfTrades,
        marketChangeOverTime,
    }: {
        symbol: string;
        date: Date;
        open: number;
        high: number;
        low: number;
        close: number;
        average: number;
        volume: number;
        notional: number;
        numberOfTrades: number;
        changeOverTime: number;
        marketOpen: number;
        marketHigh: number;
        marketLow: number;
        marketClose: number;
        marketAverage: number;
        marketVolume: number;
        marketNotional: number;
        marketNumberOfTrades: number;
        marketChangeOverTime: number;
    }) {
        this.symbol = symbol;
        this.date = date;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.average = average;
        this.volume = volume;
        this.notional = notional;
        this.numberOfTrades = numberOfTrades;
        this.changeOverTime = changeOverTime;
        this.marketOpen = marketOpen;
        this.marketHigh = marketHigh;
        this.marketLow = marketLow;
        this.marketClose = marketClose;
        this.marketAverage = marketAverage;
        this.marketVolume = marketVolume;
        this.marketNotional = marketNotional;
        this.marketNumberOfTrades = marketNumberOfTrades;
        this.marketChangeOverTime = marketChangeOverTime;
    }

    public static async findBySymbol(
        this: ReturnModelType<typeof Quote>,
        symbol: string,
        limit = 0
    ): Promise<Quote[]> {
        return this.find({ symbol }).limit(limit).exec();
    }

    public static async exists(
        this: ReturnModelType<typeof Quote>,
        symbol: string,
        date: Date
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.find({
                symbol: symbol,
                date: date,
            })
                .limit(1)
                .exec()
                .then((res: Quote[]) => {
                    resolve(res.length === 1);
                });
        });
    }
}

// Build Quote object out of API data
export class QuoteAdapter implements Adapter<IQuoteAPI, Quote> {
    public adapt(quoteData: IQuoteAPI): Quote {
        const quote: Quote = new Quote({
            symbol: quoteData.symbol,
            date: new Date(`${quoteData.date} ${quoteData.minute}`),
            open: quoteData.open,
            high: quoteData.high,
            low: quoteData.low,
            close: quoteData.close,
            average: quoteData.average,
            volume: quoteData.volume,
            notional: quoteData.notional,
            numberOfTrades: quoteData.numberOfTrades,
            changeOverTime: quoteData.changeOverTime,
            marketOpen: quoteData.marketOpen,
            marketHigh: quoteData.marketHigh,
            marketLow: quoteData.marketLow,
            marketClose: quoteData.marketClose,
            marketAverage: quoteData.marketAverage,
            marketVolume: quoteData.marketVolume,
            marketNotional: quoteData.marketNotional,
            marketNumberOfTrades: quoteData.marketNumberOfTrades,
            marketChangeOverTime: quoteData.marketChangeOverTime,
        });

        return quote;
    }
}

export const QuoteSchema = getModelForClass(Quote);
