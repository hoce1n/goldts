import { updateCoin } from "@/services/coin.service";
import { UpdateCoinRequest } from "@/types/coin.types";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useUpdateCoin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateCoinRequest }) =>
            updateCoin(id, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coins"] });
            toast.success("محصول آپدیت شد.");
        },

        onError: (err: any) => {
            const details = err?.response?.data?.error?.details as Record<string, string[]> | undefined;
      
            const message =
                details && Object.values(details)[0]?.[0]
                    ? Object.values(details)[0][0]
                    : err?.response?.data?.error?.message || "خطا در آپدیت محصول"
      
            toast.error(message)
        },
    });
};