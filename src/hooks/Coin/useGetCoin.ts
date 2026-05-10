import { getCoinsById } from "@/services/coin.service"
import { useQuery } from "@tanstack/react-query"

export const useGetCoin = (id: string) => {
    return useQuery({
        queryKey: ["coins", id],
        queryFn: () => getCoinsById(id!),
        enabled: !!id,
        staleTime: 0
    });
}