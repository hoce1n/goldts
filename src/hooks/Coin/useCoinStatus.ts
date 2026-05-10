import { activateCoin, deactivateCoin } from "@/services/coin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ToggleCoinStatusParams = {
    id: string;
    activate: boolean;
  };
  
export function useToggleCoinStatus() {
const queryClient = useQueryClient();

return useMutation({
    mutationFn: ({ id, activate }: ToggleCoinStatusParams) =>
    activate ? activateCoin(id) : deactivateCoin(id),

    onSuccess: (_, variables) => {
    toast.info(
        variables.activate ? "سکه فعال شد" : "سکه غیرفعال شد"
    );
    queryClient.invalidateQueries({ queryKey: ["coins"] });
    },

    onError: (_, variables) => {
    toast.error(
        variables.activate ? "فعال‌سازی انجام نشد" : "غیرفعال‌سازی انجام نشد"
    );
    },
});
}