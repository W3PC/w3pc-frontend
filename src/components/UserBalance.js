import React from 'react'
import styled from 'styled-components'
import { useChainState } from '../hooks/useChainState'

const UserBalance = ({ account }) => {
  const { userChips, userUsdc } = useChainState()

  return (
    <Container>
      <div>{userChips?.data?.toNumber()} CHIPS </div>
      <div> {' | '} </div>
      <div> {userUsdc?.data?.div(1000000).toNumber()} USDC</div>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
`

export default UserBalance
