import {
    DocumentType,
    getModelForClass,
    prop,
    ReturnModelType,
} from '@typegoose/typegoose';

export class GatheredSymbol {
    @prop({ required: true, index: true })
    public symbol!: string;

    // Default: 1 min
    @prop({ default: 60000 })
    public refreshIntervalInMilliseconds?: number;

    /**
     * Find an entry by symbol
     *
     * @param {string} symbol - Symbol to find
     * @param {number} limit - (optional) Limit
     */
    public static async findBySymbol(
        this: ReturnModelType<typeof GatheredSymbol>,
        symbol: string,
        limit = 0
    ): Promise<DocumentType<GatheredSymbol>[]> {
        return this.find({ symbol }).limit(limit).exec();
    }

    /**
     * List all entries
     *
     * @param {number} limit - (Optional) Limit
     */
    public static async list(
        this: ReturnModelType<typeof GatheredSymbol>,
        limit = 0
    ): Promise<DocumentType<GatheredSymbol>[]> {
        return this.find().limit(limit).exec();
    }
}

export const GatheredSymbolSchema = getModelForClass(GatheredSymbol);
