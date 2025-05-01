import { normalize } from '@/lib/bignumber'
import { useAccount, useBalance } from 'wagmi'

export const useAccountBalance = ({ decimal = 18 }: { token?: HexAddress, decimal?: number }) => {
  const { address } = useAccount()

  const { data: result, isLoading: bLoading, error: bError, refetch: bRefetch } = useBalance({
    address: address,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
      retryDelay: 5000,
      staleTime: 60000,
      refetchOnWindowFocus: false
    }
  })

  const bNormal = result?.value ? parseFloat(result.value.toString()).toFixed(3) : "0.00"
  const bNormalized = result?.value ? parseFloat(normalize(result.value.toString(), decimal)).toFixed(3) : "0.00"

  return {
    bNormal,
    bNormalized,
    bLoading,
    bError,
    bRefetch
  }
}