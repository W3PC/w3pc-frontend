import React, { useState } from 'react'
import accountAbi from '../constants/abis/Account.json'
import { useContractWrite } from 'wagmi'
import { utils } from 'ethers'
import { accountAddress } from '../constants'
import { useChainState } from '../hooks/useChainState'
import { Text, TextInput, Container, Title, Button, Stack } from '@mantine/core'

const CreateAccount = () => {
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)
  const { refetchData } = useChainState()

  const register = useContractWrite(
    {
      addressOrName: accountAddress,
      contractInterface: accountAbi,
    },
    'register',
    {
      onSettled(data) {
        if (data) {
          data.wait().then((data) => {
            refetchData()
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
      <Stack align='center'>
        <Title order={3} align='center'>
          No account detected.
        </Title>
        <Title order={4} align='center'>
          To use this app, please choose a name:{' '}
        </Title>
        <TextInput
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          error={error}
        />
        <Text align='center'>This can only be done once. Choose wisely!</Text>
        <Button onClick={(e) => registerName(e)} disabled={register.isLoading}>
          {register.isLoading || register.isSuccess
            ? 'Registering...'
            : 'Set Name'}
        </Button>
        {register.isError && (
          <Text align='center' color='red'>
            There was an error registering your name please try again
          </Text>
        )}
      </Stack>
    </Container>
  )
}

export default CreateAccount
