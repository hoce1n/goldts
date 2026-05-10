import { logout } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { ApiResponse } from '@/types/api.types'
import { LogoutResponse } from '@/types/auth.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((state) => state.clearAuth)

  return useMutation<ApiResponse<LogoutResponse>, Error, void>({
    mutationFn: logout,
    onSettled: () => {
      clearAuth()
      queryClient.clear()
      router.replace('/login')
    },
    onSuccess: (data) => {
      toast.info(data.data.message)
    },
  })
}
