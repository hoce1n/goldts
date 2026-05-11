import { completeRegistration } from '@/services/auth.service'
import { ApiResponse } from '@/types/api.types'
import {
  CompleteRegistrationRequest,
  CompleteRegistrationResponse,
} from '@/types/auth.types'
import { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCompleteRegistration() {
  return useMutation<
    ApiResponse<CompleteRegistrationResponse>,
    AxiosError<ApiResponse<null>>,
    CompleteRegistrationRequest
  >({
    mutationFn: completeRegistration,
    onError: (err: any) => {
      const details = err?.response?.data?.error?.details as Record<string, string[]> | undefined;

      const message =
          details && Object.values(details)[0]?.[0]
              ? Object.values(details)[0][0]
              : err?.response?.data?.error?.message || "خظا"

      toast.error(message)
    },
  })
}
