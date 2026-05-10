export enum KaratType {
    K18 = 18,
    K21 = 21,
    K22 = 22,
    K24 = 24
}
  
export interface CreateCoinRequest {
    name: string;
    weightInSoot: number;
    karat: KaratType;
    mintingFee: number;
    stock: number;
    description?: string;
    imgaeUrl?: string;
}

export interface CreateCoinResponse {
    id: string;
    name: string;
    weightInSoot: number;
    karat: KaratType;
    mintingFee: number;
    stock: number;
    isActive: boolean;
}

export interface Coin {
    id: string;
    name: string;
    weightInSoot: number;
    karat: number;
    mintingFee: number;
    stock: number;
    isActive: boolean;
    imageUrl?: string;
    description?: string;
    createdAt: string;
    finalPrice: number;
    priceSnapshotTimeStamp: string;
}

export interface GetAllCoinsResponse {
    coins: Coin[]
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

export interface GetCoinsParams {
    isActive?: boolean;
    pageNumber?: number;
    pageSize?: number;
}

export interface UpdateCoinRequest {
    name: string;
    weightInSoot: number;
    karat: number;
    stock: number;
    mintingFee: number;
    imageUrl?: string | null;
    description?: string | null;
}

export interface UpdateCoinResponse {
    id: string;
    name: string;
    weightInSoot: number;
    karat: number;
    stock: number;
    mintingFee: number;
    imageUrl?: string | null;
    description?: string | null;
}

export type UpdateCoinStockPayload = {
    stock: number;
};

export type UpdateCoinStockResponse = {
    id: string;
    stock: number;
}

export type UpdateCoinMintingFeePayload = {
    mintingFee: number;
}

export type UpdateCoinMintingFeeResponse = {
    id: string;
    mintingFee: number;
}

export type ToggleCoinStatusResponse = {
    id: string;
    isActive: Boolean;
}