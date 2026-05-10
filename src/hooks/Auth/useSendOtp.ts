'use client'

import { useMutation } from '@tanstack/react-query'
import { sendOtp } from '@/services/auth.service'
import { ApiResponse } from '@/types/api.types'
import { SendOtpRequest, SendOtpResponse } from '@/types/auth.types'
import { AxiosError } from 'axios'

export const useSendOtp = () => {
  return useMutation<
    ApiResponse<SendOtpResponse>,
    AxiosError<ApiResponse<null>>,
    SendOtpRequest
  >({
    mutationFn: sendOtp,
  })
}
