import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button, Text } from '@mantine/core'
import { useChainState } from '../hooks/useChainState'
import { utils } from 'ethers'
import { zeroAddress } from '../constants'

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
export default RainbowConnect
