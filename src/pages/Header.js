import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import RainbowConnect from '../components/RainbowConnect'
import { useHistory } from 'react-router-dom'

const Header = () => {
  const history = useHistory()
  return (
    <Container>
      <InnerContainer>
        <Logo>W3PC</Logo>
        <Links>
          <PageRoute onClick={() => history.push('/')}>Cashier</PageRoute>
          <PageRoute onClick={() => history.push('/join')}>Join Game</PageRoute>
          <PageRoute onClick={() => history.push('/host')}>Host Game</PageRoute>
        </Links>
        <Wallet>
          <RainbowConnect />
        </Wallet>
      </InnerContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 10vh;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  background-color: #334155;
`

const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;

  @media (min-width: 576px) {
    width: 100%;
    justify-content: space-around;
  }
  @media (min-width: 768px) {
    width: 100%;
  }
  @media (min-width: 992px) {
    width: 100%;
  }
  @media (min-width: 1200px) {
    width: 65%;
  }
`

const PageRoute = styled.button`
  color: white;
  background-color: #101826;
  border: 1px solid #101826;
  border-radius: 5px;
  padding: 0.2rem;

  &:hover {
    background-color: #64748b;
    border-color: #64748b;
    cursor: pointer;
  }

  @media (min-width: 576px) {
    font-size: 1rem;
  }
  @media (min-width: 768px) {
    font-size: 1.5rem;
    padding: 0.5rem;
  }
  @media (min-width: 992px) {
  }
`

const Logo = styled.div`
  color: white;
  font-weight: bold;
  font-size: 1rem;
  @media (min-width: 576px) {
    font-size: 1.5rem;
  }
  @media (min-width: 768px) {
    width: 33%;
    font-size: 2rem;
  }
  @media (min-width: 992px) {
    width: 33%;
  }
`
const Wallet = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  @media (min-width: 768px) {
    width: 33%;
  }
  @media (min-width: 992px) {
    width: 33%;
  }
`
const Links = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  @media (min-width: 768px) {
    width: 33%;
  }
  @media (min-width: 992px) {
    width: 33%;
  }
`

export default Header
