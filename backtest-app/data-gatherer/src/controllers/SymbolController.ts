import { get } from 'request-promise-native';
import { v4 } from 'uuid';
import { Constants } from '../constants';
import { Helper } from '../Helper';
import { ISymbolAPI } from '../models/ISymbolAPI';
import { StockSymbol, SymbolAdapter } from '../models/Symbol';

export class SymbolController {
    /**
     * Get all supported symbols
     *
     * @public
     * @returns {Promise<StockSymbol[]>} StockSymbol[]
     */
    public static get(): Promise<StockSymbol[]> {
        return new Promise((resolve, reject) => {
            const msg = `Fetching all symbols`;
            const uuid: string = v4().replace(/^([^-]*)-.*/, '$1');
            const route = `ref-data/symbols`;
            Helper.pending(route, msg, uuid);
            get(
                `${Constants.IEX_CLOUD_DATA_URL}/${Constants.IEX_CLOUD_VERSION}/${route}?token=${Constants.IEX_CLOUD_PRIVATE_TOKEN}`
            )
                .then((data: string) => {
                    const response: ISymbolAPI[] = JSON.parse(data);
                    const output: StockSymbol[] = [];
                    const symbolAdapter: SymbolAdapter = new SymbolAdapter();

                    for (let i = 0; i < response.length; i++) {
                        const symbolData: ISymbolAPI = response[i];
                        const symbol: StockSymbol = symbolAdapter.adapt(
                            symbolData
                        );
                        output.push(symbol);
                    }
                    Helper.success(route, msg, uuid);

                    resolve(output);
                })
                .catch((err) => {
                    Helper.failure(route, msg, uuid, {
                        name: err.name,
                        statusCode: err.statusCode,
                    });
                    reject(err);
                });
        });
    }
}
