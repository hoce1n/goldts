import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import { CreateQuoteRequest, CreateQuoteResponse } from "@/types/quote.types";

export const createQuote = async (
    payload: CreateQuoteRequest
): Promise<ApiResponse<CreateQuoteResponse>> => {
    const { data } = await api.post(
        "/Quote",
        payload
    )

    return data;
}