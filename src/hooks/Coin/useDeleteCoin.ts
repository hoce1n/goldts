import { deleteCoin } from "@/services/coin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteCoin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCoin(id),

        onSuccess: () => {
            toast.success("سکه حذف شد.");
            queryClient.invalidateQueries({ queryKey: ["coins"] });
        },

        onError: (err: any) => {
            const details = err?.response?.data?.error?.details as Record<string, string[]> | undefined;
      
            const message =
                details && Object.values(details)[0]?.[0]
                    ? Object.values(details)[0][0]
                    : err?.response?.data?.error?.message || "خطا در ایجاد محصول"
      
            toast.error(message)
        }
    });
}