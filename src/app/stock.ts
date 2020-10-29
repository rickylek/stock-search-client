export interface Stock {
    name: string;
    ticker: string;
    description: string;
    endDate: string;
    exchangeCode: string;
    startDate: string;
    stockPrice: StockPrice;
}

export interface StockPrice {
    prevClose: number;
    mid: number;
    lastSaleTimestamp: string;
    open: number;
    askPrice: number;
    low: number;
    ticker: string;
    timestamp: string;
    lastSize: number;
    tngoLast: number;
    last: number;
    high: number;
    askSize: number;
    quoteTimestamp: string;
    bidPrice: number;
    bidSize: number;
    volume: number;
    change: number;
    changePercentage: number;
}
