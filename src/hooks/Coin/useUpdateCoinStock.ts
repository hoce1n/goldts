import { updateCoinStock } from "@/services/coin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateCoinStock() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, stock }: { id: string; stock: number }) =>
            updateCoinStock(id, { stock }),
        
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["coins"] });

            toast.success("موجودی با موفقیت آپدیت شد.")
        },
        onError: (err: any) => {
            const details = err?.response?.data?.error?.details as Record<string, string[]> | undefined;
      
            const message =
                details && Object.values(details)[0]?.[0]
                    ? Object.values(details)[0][0]
                    : err?.response?.data?.error?.message || "خطا در آپدیت موجودی محصول"
      
            toast.error(message)
        },
    });
}