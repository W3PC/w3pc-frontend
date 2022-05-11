import React, { useState } from 'react'
import Button from './Button'
import { useConnect, useNetwork } from 'wagmi'
import WalletModal from './WalletModal'
import AccountInfo from './AccountInfo'
import { useChainState } from '../hooks/useChainState'

const WalletConnect = () => {
  const [showModal, setShowModal] = useState(false)
  const { activeConnector } = useConnect({
    chainId: process.env.REACT_APP_CHAIN_ID,
  })
  const { account } = useChainState()
  const chainId = process.env.REACT_APP_CHAIN_ID
  const network = useNetwork()
  return (
    <>
      {activeConnector && network?.activeChain?.id !== +chainId && (
        <Button
          onClick={() => {
            //Using Wagmi hooks to switch to Polygon network was not functioning properly, So we have to do it the old fashion way until i can look into it
            window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId:
                    process.env.NODE_ENV === 'development' ? '0x7A69' : '0x89',
                  rpcUrls: [process.env.REACT_APP_RPC_URL],
                  chainName:
                    process.env.NODE_ENV === 'development'
                      ? 'Dev'
                      : 'Matic Mainnet',
                  nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18,
                  },
                },
              ],
            })
          }}
        >
          Please Switch to Polygon Chain
        </Button>
      )}
      {!activeConnector && (
        <Button onClick={() => setShowModal(true)}>Connect Wallet</Button>
      )}
      {showModal && <WalletModal setShowModal={setShowModal} />}
      {activeConnector && account.isSuccess && (
        <AccountInfo account={account} />
      )}
    </>
  )
}

export default WalletConnect
