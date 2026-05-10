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

        onError: () => {
            toast.error("حذف انجام نشد.");
        },
    });
}