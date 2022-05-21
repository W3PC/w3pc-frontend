import React, { useState } from 'react'
import accountAbi from '../constants/abis/Account.json'
import { useContractWrite } from 'wagmi'
import { utils } from 'ethers'
import { accountAddress } from '../constants'
import { useChainState } from '../hooks/useChainState'
import { Text, TextInput, Container, Title, Button, Stack } from '@mantine/core'
import {
  showPendingTxn,
  updatePendingTxn,
} from '../notifications/txnNotification'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'

const CreateAccount = () => {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const { refetchData } = useChainState()
  const addRecentTransaction = useAddRecentTransaction()

  const register = useContractWrite(
    {
      addressOrName: accountAddress,
      contractInterface: accountAbi,
    },
    'register',
    {
      onSettled(data) {
        if (data) {
          const hash = data.hash
          showPendingTxn(hash)
          addRecentTransaction({
            hash: hash,
            description: `Set ${input} as account name`,
          })
          data
            .wait()
            .then((data) => {
              updatePendingTxn(hash)
              refetchData()
            })
            .catch((e) => {
              console.log(e)
              updatePendingTxn(hash, true)
              setError('There was an error with your transaction')
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
        <Button onClick={(e) => registerName(e)} loading={register.isLoading}>
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
