import { completeRegistration } from '@/services/auth.service'
import { ApiResponse } from '@/types/api.types'
import {
  CompleteRegistrationRequest,
  CompleteRegistrationResponse,
} from '@/types/auth.types'
import { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'

export function useCompleteRegistration() {
  return useMutation<
    ApiResponse<CompleteRegistrationResponse>,
    AxiosError<ApiResponse<null>>,
    CompleteRegistrationRequest
  >({
    mutationFn: completeRegistration,
  })
}
