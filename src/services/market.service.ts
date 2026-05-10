import { api } from '@/lib/axios'
import { ApiResponse } from '@/types/api.types'
import { GetLatestMarketPriceResponse, GetMarketPriceHistoryResponse, MarketPriceHistoryRange } from '@/types/market.types'

export const getLatestMarketPrice = async (): Promise<
  ApiResponse<GetLatestMarketPriceResponse>
> => {
  const { data } =
    await api.get<ApiResponse<GetLatestMarketPriceResponse>>(
      'MarketPrice/latest',
    )
  return data
}

export const getMarketPriceHistory = async (
  range: MarketPriceHistoryRange = "Day"
): Promise<ApiResponse<GetMarketPriceHistoryResponse>> => {
  const { data } = await api.get<ApiResponse<GetMarketPriceHistoryResponse>>(
    `MarketPrice/history?range=${range}`
  );

  return data;
};