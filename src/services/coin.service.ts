import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import { Coin, CreateCoinRequest, CreateCoinResponse, GetAllCoinsResponse, GetCoinsParams, ToggleCoinStatusResponse, UpdateCoinMintingFeePayload, UpdateCoinMintingFeeResponse, UpdateCoinRequest, UpdateCoinResponse, UpdateCoinStockPayload, UpdateCoinStockResponse } from "@/types/coin.types";

export const createCoin = async (
    payload: CreateCoinRequest
): Promise<ApiResponse<CreateCoinResponse>> => {
    const { data } = await api.post("/Coins", payload);
    return data;
}

export const getCoins = async (
    params: GetCoinsParams
): Promise<ApiResponse<GetAllCoinsResponse>> => {
    const { data } = await api.get("/Coins", {
        params
    });

    return data;
}

export const getCoinsById = async (
    id: string
): Promise<ApiResponse<Coin>> => { 
    const { data } = await api.get(`/Coins/${id}`)
    return data;
}

export const updateCoin = async (
    id: string,
    payload: UpdateCoinRequest
): Promise<ApiResponse<UpdateCoinResponse>> => {
    const { data } = await api.put(`/Coins/${id}`, payload)
    return data;
}

export const updateCoinStock = async (
    id: string,
    payload: UpdateCoinStockPayload
): Promise<ApiResponse<UpdateCoinStockResponse>> => {
    const { data } = await api.patch(
        `/Coins/${id}/stock`,
        payload
    );

    return data;
}

export const updateCoinMintingFee = async (
    id: string,
    payload: UpdateCoinMintingFeePayload
): Promise<ApiResponse<UpdateCoinMintingFeeResponse>> => {
    const { data } = await api.patch(
        `/Coins/${id}/minting-fee`,
        payload
    );

    return data;
}

export const activateCoin = async (id: string) => {
    const { data } = await api.patch(`/coins/${id}/activate`);
    return data.data;
  };
  
export const deactivateCoin = async (id: string) => {
    const { data } = await api.patch(`/coins/${id}/deactivate`);
    return data.data;
};
  
export const deleteCoin = async (id: string): Promise<void> => {
    await api.delete(`/coins/${id}`);
};