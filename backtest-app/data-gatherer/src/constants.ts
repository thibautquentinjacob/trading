export type ConstantsValues = string | boolean | number | undefined;

export const Constants: { [key: string]: ConstantsValues } = {
    // App settings
    APP_NAME: 'Data Gatherer',
    GATHERED_SYMBOLS_REFRESH_RATE_IN_MS: process.env
        .GATHERED_SYMBOLS_REFRESH_RATE_IN_MS
        ? parseInt(process.env.GATHERED_SYMBOLS_REFRESH_RATE_IN_MS)
        : undefined,

    // IEX Cloud API settings
    IEX_CLOUD_DATA_URL: process.env.IEX_CLOUD_DATA_URL,
    IEX_CLOUD_VERSION: process.env.IEX_CLOUD_VERSION,
    IEX_CLOUD_PRIVATE_TOKEN: process.env.IEX_CLOUD_PRIVATE_TOKEN,

    // DB settings
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
};
