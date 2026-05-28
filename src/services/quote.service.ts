import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import { ConfirmQuoteResponse, CreateQuoteRequest, CreateQuoteResponse } from "@/types/quote.types";

export const createQuote = async (
    payload: CreateQuoteRequest
): Promise<ApiResponse<CreateQuoteResponse>> => {
    const { data } = await api.post(
        "/Quote",
        payload
    )

    return data;
}

export const confirmQuote = async (
    quoteId: string
): Promise<ApiResponse<ConfirmQuoteResponse>> => {
    const idempotencyKey = crypto.randomUUID();

    const { data } = await api.post(
        `Quote/${quoteId}/confirm`,
        {},
        {
            headers: {
                "Idempotency-Key": idempotencyKey
            }
        }
    )

    return data;
}