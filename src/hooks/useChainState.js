import React, { useContext, createContext } from 'react'
import { useAccount, erc20ABI, useContractRead } from 'wagmi'
import cashierAbi from '../constants/abis/Cashier.json'
import accountAbi from '../constants/abis/Account.json'
import { usdcAddress, cashierAddress, accountAddress } from '../constants'

//Cant think of a better name for this hook
//This hook is for contract reads that we want to keep track of when they change, without following every txn
//Also for keeping track of the who is authenticated with their wallet
//Using it as context with a wrapper so these reads stay active

export const ChainContext = createContext()

export const ChainContextProvider = (props) => {
  const account = useAccount()

  const userName = useContractRead(
    {
      addressOrName: accountAddress,
      contractInterface: accountAbi,
    },
    'name',
    {
      args: [account?.data?.address],
      enabled: account?.data?.address ? true : false,
      watch: true,
    }
  )
  const cashierUsdc = useContractRead(
    {
      addressOrName: usdcAddress,
      contractInterface: erc20ABI,
    },
    'balanceOf',
    {
      args: cashierAddress,
      onError(error) {
        console.log(error)
      },
    }
  )
  const usdcAllowance = useContractRead(
    {
      addressOrName: usdcAddress,
      contractInterface: erc20ABI,
    },
    'allowance',
    {
      enabled: account?.data?.address ? true : false,
      args: [account?.data?.address, cashierAddress],
      onError(error) {
        console.log(error)
      },
    }
  )
  const totalChips = useContractRead(
    {
      addressOrName: cashierAddress,
      contractInterface: cashierAbi,
    },
    'totalSupply',
    {
      onError(error) {
        console.log(error)
      },
    }
  )

  const userChips = useContractRead(
    {
      addressOrName: cashierAddress,
      contractInterface: cashierAbi,
    },
    'balanceOf',
    {
      enabled: account?.data?.address ? true : false,
      args: account?.data?.address,
      onError(error) {
        console.log(error)
      },
    }
  )

  const userUsdc = useContractRead(
    {
      addressOrName: usdcAddress,
      contractInterface: erc20ABI,
    },
    'balanceOf',
    {
      enabled: account?.data?.address ? true : false,
      args: account?.data?.address,
      onError(error) {
        console.log(error)
      },
    }
  )

  const refetchData = () => {
    userUsdc.refetch()
    cashierUsdc.refetch()
    totalChips.refetch()
    userChips.refetch()
    userName.refetch()
    account.refetch()
    usdcAllowance.refetch()
  }

  return (
    <ChainContext.Provider
      value={{
        userUsdc,
        userChips,
        totalChips,
        cashierUsdc,
        account,
        userName,
        refetchData,
        usdcAllowance,
      }}
      {...props}
    />
  )
}

export const useChainState = () => {
  const chain = useContext(ChainContext)
  return { ...chain }
}
