import { ConnectButton } from '@rainbow-me/rainbowkit'
import styled from 'styled-components'
import { Button, Text } from '@mantine/core'
import { useChainState } from '../hooks/useChainState'
import { utils } from 'ethers'
import { zeroAddress } from '../constants'
import ClipLoader from 'react-spinners/ClipLoader'

export const RainbowConnect = () => {
  const { userName, userChips, userUsdc } = useChainState()
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button onClick={openConnectModal} type='button'>
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type='button'>
                    Wrong network
                  </Button>
                )
              }

              return (
                <Button onClick={openAccountModal} variant='subtle' size='lg'>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text>
                      Account:{' '}
                      {userName?.data && userName.data !== zeroAddress
                        ? utils.parseBytes32String(userName.data)
                        : account.displayName}
                    </Text>
                    <Text>
                      {`${userChips?.data?.toString()} CHIPS || ${userUsdc?.data
                        ?.div(1000000)
                        .toString()} USDC`}
                    </Text>
                  </div>
                </Button>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  font-size: 0.8rem;

  &:hover {
    background-color: #64748b;
    cursor: pointer;
  }

  @media (min-width: 576px) {
    font-size: 1rem;
  }
  @media (min-width: 768px) {
    font-size: 1rem;
  }
  @media (min-width: 992px) {
    font-size: 1rem;
  }
  @media (min-width: 1200px) {
    font-size: 1.5rem;
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export default RainbowConnect
