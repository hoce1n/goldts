export interface GetLatestMarketPriceResponse {
    pricePerGram: number;
    priceTimestamp: string;
  } 

export type MarketPriceHistoryRange = "Day" | "Week" | "Month";

export interface MarketPriceHistoryPoint {
  timestamp: string;
  price: number;
}

export interface GetMarketPriceHistoryResponse {
  points: MarketPriceHistoryPoint[];
}
