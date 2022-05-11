import { useContract, useProvider, useSigner } from 'wagmi'
import { accountAddress } from '../constants'
import accountAbi from '../constants/abis/Account.json'

const useAccountCtx = () => {
  const provider = useProvider()

  const accountCtx = useContract({
    addressOrName: accountAddress,
    contractInterface: accountAbi,
    signerOrProvider: provider,
  })

  return accountCtx
}

export default useAccountCtx
