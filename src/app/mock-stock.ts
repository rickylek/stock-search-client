import { Stock, StockPrice } from './stock';

export const EMPTY_STOCK: Stock = {
    name: '',
    ticker: '',
    description: '',
    endDate: '',
    exchangeCode: '',
    startDate: '',
    stockPrice: null
};

export const EMPTY_STOCK_PRICE: StockPrice = {
    prevClose: 0,
    mid: 0,
    lastSaleTimestamp: '',
    open: 0,
    askPrice: 0,
    low: 0,
    ticker: '',
    timestamp: '',
    lastSize: 0,
    tngoLast: 0,
    last: 0,
    high: 0,
    askSize: 0,
    quoteTimestamp: '',
    bidPrice: 0,
    bidSize: 0,
    volume: 0,
    change: 0,
    changePercentage: 0,
};
