export enum ProductType {
    Coin = 1,
    MeltedGold = 2,
}
  
export enum QuoteSide {
    Buy = 1,
    Sell = 2,
}
  
export interface CreateQuoteRequest {
    productType: ProductType;
    amount: number;
    side: QuoteSide;
    productId?: string;
}

export interface CreateQuoteResponse {
    id: string;
    unitPrice: number;
    totalPrice: number;
    expiresAtUtc: string;
}

export interface ConfirmQuoteResponse {
    orderId: string;
    unitPrice: number;
    totalPrice: number;
    requiresPayment?: boolean;
    paymentUrl?: string;
}