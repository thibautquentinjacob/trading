import { getModelForClass } from '@typegoose/typegoose';
import { Constants } from '../constants';
import { QuoteController } from '../controllers/QuoteController';
import { Helper } from '../Helper';
import { Quote } from './Quote';

export class SymbolWatcher {
    public readonly symbol!: string;
    private _refreshRate!: number;
    private _interval!: NodeJS.Timeout | undefined;

    constructor({
        symbol,
        refreshRate,
    }: {
        symbol: string;
        refreshRate: number;
    }) {
        this.symbol = symbol;
        this.refreshRate = refreshRate;
    }

    public set refreshRate(refreshRate: number) {
        if (refreshRate > 0 && this._refreshRate !== refreshRate) {
            this._refreshRate = refreshRate;
            if (this._interval) {
                this.unwatch();
                this.watch();
            }
        }
    }

    public get refreshRate(): number {
        return this._refreshRate;
    }

    public get watched(): boolean {
        return this._interval !== undefined;
    }

    public watch(): void {
        const QuoteModel = getModelForClass(Quote);
        if (!this._interval) {
            this._interval = setInterval(() => {
                QuoteController.getLastQuote(this.symbol)
                    .then(async (quote: Quote) => {
                        const doc = new QuoteModel(quote);
                        const exists: boolean = await QuoteModel.exists(
                            quote.symbol,
                            quote.date
                        );
                        if (!exists) {
                            await doc.save();
                        }
                    })
                    .catch((err) => {
                        Helper.failure(
                            Constants.APP_NAME as string,
                            'watch',
                            '!',
                            {
                                name: err,
                                statusCode: '-1',
                            }
                        );
                    });
            }, this._refreshRate);
        }
    }

    public unwatch(): void {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = undefined;
        }
    }
}
