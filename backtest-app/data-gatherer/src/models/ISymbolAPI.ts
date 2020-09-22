export interface ISymbolAPI {
    symbol: string; // Symbol name
    exchange?: string; // Stock exchange
    name: string; // Full company name
    date?: string; // Date
    type?: string; // ADR, Limited Partnerships, Open Ended Fund, etc.
    iexId?: string; // unique ID applied by IEX to track securities through symbol changes
    region?: string; // Region
    currency?: string; // Currency the symbol is traded in
    isEnabled?: boolean; // Enabled for trading on IEX
    figi?: string; // FIGI id
    cik?: string; // CIK number
}
