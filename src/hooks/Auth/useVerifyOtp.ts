'use client'

import { useMutation } from '@tanstack/react-query'
import { verifyOtp } from '@/services/auth.service'
import { ApiResponse } from '@/types/api.types'
import { VerifyOtpRequest, VerifyOtpResponse } from '@/types/auth.types'
import { AxiosError } from 'axios'

export function useVerifyOtp() {
  return useMutation<
    ApiResponse<VerifyOtpResponse>,
    AxiosError<ApiResponse<null>>,
    VerifyOtpRequest
  >({
    mutationFn: verifyOtp,
  })
}
