import { getLatestMarketPrice } from '@/services/market.service'
import { ApiResponse } from '@/types/api.types'
import { GetLatestMarketPriceResponse } from '@/types/market.types'
import { useQueries, useQuery } from '@tanstack/react-query'
import { ApiError } from 'next/dist/server/api-utils'

export const useGetLatestMarketPrice = () => {
  return useQuery<ApiResponse<GetLatestMarketPriceResponse>, ApiError>({
    queryKey: ['latest-market-price'],
    queryFn: getLatestMarketPrice,
  })
}
