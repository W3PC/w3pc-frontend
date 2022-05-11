import React from 'react'
import Button from './Button'
import { useConnect } from 'wagmi'
import styled from 'styled-components'

const WalletModal = ({ setShowModal }) => {
  const {
    activeConnector,
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
  } = useConnect()

  if (activeConnector) {
    setShowModal(false)
  }

  return (
    <Container onClick={() => setShowModal(false)}>
      <div onClick={(e) => e.stopPropagation()}>
        {connectors.map((x) => (
          <Button disabled={!x.ready} key={x.id} onClick={() => connect(x)}>
            {x.name}
            {isConnecting && pendingConnector?.id === x.id && ' (connecting)'}
          </Button>
        ))}
        {error && <div>{error.message}</div>}
      </div>
    </Container>
  )
}

const Container = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
`

export default WalletModal
