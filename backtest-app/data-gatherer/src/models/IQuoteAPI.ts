export interface IQuoteAPI {
    symbol: string; // Not from API, added in controller
    date: string;
    minute: string;
    label: string; // e.g. '09:30 AM'
    high: number;
    low: number;
    open: number;
    close: number;
    average: number; // Average price during the minute for trades on IEX
    volume: number; // Total volume during the minute on IEX
    notional: number; // Total notional value during the minute for trades on IEX
    numberOfTrades: number; // Number of trades during the minute on IEX
    marketHigh: number; // Highest price during the minute across all markets
    marketLow: number; // Lowest price during the minute across all markets
    marketAverage: number; // Average price during the minute across all markets
    marketVolume: number; // Total volume of trades during the minute across all markets
    marketNotional: number; // Total notional value during the minute for trades across all markets
    marketNumberOfTrades: number; // Number of trades during the minute across all markets
    marketOpen: number; // First price during the minute across all markets
    marketClose: number; // Last price during the minute across all markets
    changeOverTime: number; // Percent change of each interval relative to first value
    marketChangeOverTime: number; // Percent change of each interval relative to first value
}
