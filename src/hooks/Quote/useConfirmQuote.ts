import { confirmQuote } from "@/services/quote.service"
import { useMutation } from "@tanstack/react-query"

export const useConfirmQuote = () => {
    return useMutation({
        mutationFn: confirmQuote
    });
}