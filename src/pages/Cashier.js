import React, { useEffect } from 'react'
import styled from 'styled-components'
import BuyForm from '../components/BuyForm'
import SellForm from '../components/SellForm'
import { useChainState } from '../hooks/useChainState'

const Cashier = () => {
  const chainState = useChainState()
  return (
    <Container>
      <DataContainer>
        <Data>
          <h2>TotalChips in Circulation</h2>
          <h1>{chainState?.totalChips?.data?.toNumber()} Chips</h1>
        </Data>

        <Data>
          <h2>Your CHIPS in Wallet</h2>
          {chainState.account.data ? (
            <h1>{chainState?.userChips?.data?.toNumber()} CHIPS</h1>
          ) : (
            <h1>????</h1>
          )}
        </Data>
        <Data>
          <BuyForm
            userUsdc={chainState?.userUsdc}
            update={chainState.refetchData}
          />
        </Data>
      </DataContainer>
      <DataContainer>
        <Data>
          <h2>USDC in the Cashier</h2>
          <h1>{chainState?.cashierUsdc?.data?.div(1000000).toNumber()} USDC</h1>
        </Data>
        <Data>
          <h2>USDC in Wallet</h2>
          {chainState.account.data ? (
            <h1>{chainState?.userUsdc?.data?.div(1000000).toNumber()} USDC</h1>
          ) : (
            <h1>????</h1>
          )}
        </Data>
        <Data>
          <SellForm
            userChips={chainState.userChips}
            update={chainState.refetchData}
          />
        </Data>
      </DataContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`
const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 5rem;
`
const Data = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export default Cashier
