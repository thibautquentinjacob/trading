import { connect, Mongoose } from 'mongoose';
import { Constants } from './constants';
import { Helper } from './Helper';
import { GatheredSymbol, GatheredSymbolSchema } from './models/GatheredSymbol';
import { SymbolWatchersManager } from './models/SymbolWatchersManager';

export class App {
    private readonly _dbHost!: string | undefined;
    private readonly _dbPort!: number | undefined;
    // private _dbConnection!: Connection;
    private _gatheredSymbols!: GatheredSymbol[];
    private _symbolWatchersManager!: SymbolWatchersManager;

    constructor({ dbHost, dbPort }: { dbHost?: string; dbPort?: number }) {
        // Check that all required environment variables have been set
        this._checkEnvironmentVariables();

        this._dbHost = dbHost;
        this._dbPort = dbPort;
        this._symbolWatchersManager = new SymbolWatchersManager({
            symbolWatchers: [],
        });

        // Env variables are checked are runtime: dbHost and dbPort can't be null
        // eslint-disable-next-line
        this._connectToDb(this._dbHost!, this._dbPort!, 'Backtesting')
            .then(() => {
                // this._dbConnection = mongoose.connection;
                setInterval(async () => {
                    console.log('Refreshing list of of monitored symbols');
                    this._gatheredSymbols = await this._listGatheredSymbols();
                    this._updateSymbolWatchers(this._gatheredSymbols);
                }, Constants.GATHERED_SYMBOLS_REFRESH_RATE_IN_MS as number);
            })
            .catch((error) => {
                throw new Error(
                    `Could not initialize connection to mongodb://${dbHost}:${dbPort}: ${error}`
                );
            });
    }

    /**
     * Check that all environment variables are properly set
     *
     * @throws {Error} Throw error if not all set
     */
    private _checkEnvironmentVariables(): void {
        const variables: string[] = Object.keys(Constants);
        const undefinedVariables: string[] = variables.filter(
            (variable: string) => !Constants[variable]
        );

        if (undefinedVariables.length === 0) {
            return;
        }

        Helper.failure(
            Constants.APP_NAME as string,
            'checkEnvironmentVariables',
            '!',
            {
                name: `The following environment variables should be defined: ${undefinedVariables.join(
                    ', '
                )}`,
                statusCode: '-1',
            }
        );

        throw new Error(
            `Required environment variables have not been defined: ${undefinedVariables.join(
                ', '
            )}`
        );
    }

    /**
     * Setup connection to database using the provided parameters.
     *
     * @param {string} host - DB Hostname
     * @param {number} port - DB Port
     * @param {string} database - Database name
     * @returns {Promise<Mongoose>} Returns established DB connection or error
     */
    private async _connectToDb(
        host: string,
        port: number,
        database: string
    ): Promise<Mongoose> {
        return new Promise((resolve, reject) => {
            connect(`mongodb://${host}:${port}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                dbName: database,
            })
                .then((mongoose) => {
                    Helper.success(
                        Constants.APP_NAME as string,
                        `Successfully connected to DB at '${host}:${port}'`,
                        '!'
                    );
                    resolve(mongoose);
                })
                .catch((error) => {
                    Helper.failure(
                        Constants.APP_NAME as string,
                        'connectToDb',
                        '!',
                        {
                            name: `Could not connect to DB at '${host}:${port}'`,
                            statusCode: '-1',
                        }
                    );
                    reject(error);
                });
        });
    }

    private async _listGatheredSymbols(): Promise<GatheredSymbol[]> {
        return await GatheredSymbolSchema.list();
    }

    private _updateSymbolWatchers(gatheredSymbols: GatheredSymbol[]): void {
        gatheredSymbols.forEach((gatheredSymbol: GatheredSymbol) => {
            // FIXME: Rate default value should come from the default Schema value
            this._symbolWatchersManager.updateWatcher({
                symbol: gatheredSymbol.symbol,
                refreshRate: gatheredSymbol.refreshIntervalInMilliseconds || 0,
            });
        });
    }
}
