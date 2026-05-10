'use client'

import { useQuery } from '@tanstack/react-query'
import { getMe } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { ApiResponse } from '@/types/api.types'
import { MeResponse } from '@/types/auth.types'
import { AxiosError } from 'axios'
import { useEffect } from 'react'

export const useMe = () => {
  const setUser = useAuthStore((s) => s.setUser)
  const setHydrated = useAuthStore((s) => s.setHydrated)

  const query = useQuery<
    ApiResponse<MeResponse>,
    AxiosError<ApiResponse<null>>,
    ApiResponse<MeResponse>,
    ['me']
  >({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
  })

  useEffect(() => {
    if (query.status === 'success') {
      setUser(query.data.data)
      setHydrated()
    }

    if (query.status === 'error') {
      setUser(null)
      setHydrated()
    }
  }, [query.status])

  return query
}
