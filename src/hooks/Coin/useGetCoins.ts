import { getCoins } from "@/services/coin.service";
import { GetCoinsParams } from "@/types/coin.types";
import { useQuery } from "@tanstack/react-query";

export const useGetCoins = (params: GetCoinsParams) => {
    return useQuery({
        queryKey: ["coins", params],
        queryFn: () => getCoins(params),
        staleTime: 1000 * 60 * 5
    });
}