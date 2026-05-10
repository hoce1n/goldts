import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCoin } from "@/services/coin.service";
import { CreateCoinRequest, CreateCoinResponse } from "@/types/coin.types";
import { ApiResponse } from "@/types/api.types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useCreateCoin = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<CreateCoinResponse>, AxiosError<ApiResponse<null>>, CreateCoinRequest>({
    mutationFn: createCoin,
    onSuccess: () => {
      toast.success('محصول با موفقیت اضافه شد.');
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
};
