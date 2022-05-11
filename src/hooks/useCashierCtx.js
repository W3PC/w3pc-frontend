import { useContract, useProvider } from 'wagmi'
import { cashierAddress } from '../constants'
import cashierAbi from '../constants/abis/Cashier.json'

const useCashierCtx = () => {
  const provider = useProvider()

  const cashierCtx = useContract({
    addressOrName: cashierAddress,
    contractInterface: cashierAbi,
    signerOrProvider: provider,
  })

  return cashierCtx
}

export default useCashierCtx
