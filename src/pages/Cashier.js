import React, { useEffect } from 'react'
import styled from 'styled-components'
import BuyForm from '../components/BuyForm'
import SellForm from '../components/SellForm'
import { useChainState } from '../hooks/useChainState'
import { useHistory } from 'react-router-dom'
import { zeroAddress, zeroUserAddress } from '../constants'

const Cashier = () => {
  const chainState = useChainState()
  const history = useHistory()
  useEffect(() => {
    if (
      chainState.account?.data?.address &&
      chainState.account.data.address !== zeroAddress &&
      (!chainState.userName?.data ||
        chainState.userName.data === zeroUserAddress) &&
      chainState.userName?.isFetched
    ) {
      history.push('/createAccount')
    }
  }, [chainState.userName, chainState.account])
  return (
    <Container>
      <DataContainer>
        <Data>
          <div>Total Chips in Circulation</div>
          <div style={{ fontWeight: 'bold' }}>
            {chainState?.totalChips?.data?.toNumber()} Chips
          </div>
        </Data>

        <Data>
          <div>Your CHIPS in Wallet</div>
          {chainState.account.data ? (
            <div style={{ fontWeight: 'bold' }}>
              {chainState?.userChips?.data?.toNumber()} CHIPS
            </div>
          ) : (
            <div style={{ fontWeight: 'bold' }}>????</div>
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
          <div>USDC in the Cashier</div>
          <div style={{ fontWeight: 'bold' }}>
            {chainState?.cashierUsdc?.data?.div(1000000).toNumber()} USDC
          </div>
        </Data>
        <Data>
          <div>USDC in Wallet</div>
          {chainState.account.data ? (
            <div style={{ fontWeight: 'bold' }}>
              {chainState?.userUsdc?.data?.div(1000000).toNumber()} USDC
            </div>
          ) : (
            <div style={{ fontWeight: 'bold' }}>????</div>
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
  font-size: 1rem;
  font-weight: 500;
  @media (min-width: 576px) {
    font-size: 1.5rem;
  }
  @media (min-width: 768px) {
    font-size: 2rem;
  }
  @media (min-width: 992px) {
    font-size: 2.5rem;
  }
  @media (min-width: 1200px) {
    font-size: 2.5rem;
  }
`
const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 1rem;
  @media (min-width: 576px) {
    margin: 2rem;
  }
  @media (min-width: 768px) {
    margin: 4rem;
  }
  @media (min-width: 992px) {
    margin: 5rem;
  }
`
const Data = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 5rem;
  text-align: center;
`

export default Cashier
