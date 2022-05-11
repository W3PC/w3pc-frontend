import React, { useState } from 'react'
import styled from 'styled-components'
import accountAbi from '../constants/abis/Account.json'
import { useContractWrite } from 'wagmi'
import { useHistory } from 'react-router-dom'
import { utils } from 'ethers'

const CreateAccount = () => {
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)
  const history = useHistory()
  const register = useContractWrite(
    {
      addressOrName: '0x8CEe8e37E03B0384daF5836fbD22b3678b0E0a3c',
      contractInterface: accountAbi,
    },
    'register',
    {
      onSettled(data) {
        if (data) {
          data.wait().then((data) => {
            history.push('/')
          })
        }
      },
    }
  )

  const registerName = (e) => {
    e.preventDefault()
    if (input === '') {
      return
    }
    try {
      const formattedName = utils.formatBytes32String(input)
      register.write({ args: formattedName })
    } catch (error) {
      setError(
        'You have inputed an invalid name. Name must be able to be converted to byte32'
      )
    }
  }

  return (
    <Container>
      <div>No account detected.</div>
      <div>To use this app, please choose a name: </div>
      <Form onSubmit={(e) => registerName(e)}>
        <Input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <br />
        <div>This can only be done once. Choose wisely!</div>
        <Button type='submit' disabled={register.isLoading}>
          {register.isLoading || register.isSuccess
            ? 'Registering...'
            : 'Set Name'}
        </Button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {register.isError && (
          <div style={{ color: 'red' }}>
            There was an error registering your name please try again
          </div>
        )}
      </Form>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10%;
  height: 80%;
  width: 100%;
  font-size: 1.5rem;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const Input = styled.input`
  font-size: 1.5rem;
`
const Button = styled.button`
  background: #4786ff;
  color: white;
  border: 1px solid #4786ff;
  border-radius: 5px;
  font-size: 1.5rem;
  margin-top: 20px;
  padding: 10px;
`

export default CreateAccount
