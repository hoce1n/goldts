import { getMarketPriceHistory } from "@/services/market.service";
import { ApiResponse } from "@/types/api.types";
import { GetMarketPriceHistoryResponse, MarketPriceHistoryRange } from "@/types/market.types";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";

export const useGetMarketPriceHistory = (
    range: MarketPriceHistoryRange = "Day"
) => {
    return useQuery<ApiResponse<GetMarketPriceHistoryResponse>, ApiError>({
        queryKey: ["marketPriceHistory", range],
        queryFn: () => getMarketPriceHistory(range),
    });
};