import { createQuote } from "@/services/quote.service"
import { ApiResponse } from "@/types/api.types";
import { CreateQuoteRequest, CreateQuoteResponse } from "@/types/quote.types";
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useCreateQuote = () => {
    return useMutation<
    ApiResponse<CreateQuoteResponse>,
    AxiosError<ApiResponse<null>>,
    CreateQuoteRequest
  >({
        mutationFn: createQuote,
        
        onError: (err: any) => {
            const details = err?.response?.data?.error?.details as Record<string, string[]> | undefined;
      
            const message =
                details && Object.values(details)[0]?.[0]
                    ? Object.values(details)[0][0]
                    : err?.response?.data?.error?.message || "خطا در دریافت قیمت"
      
            toast.error(message)
          }
          });
};