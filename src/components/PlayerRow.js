import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { useContractWrite, useContractRead } from 'wagmi'
import gameAbi from '../constants/abis/Game.json'
import { utils, BigNumber } from 'ethers'
import { addCreditsErr, deductCreditsErr } from '../constants'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import {
  NumberInput,
  Stack,
  Slider,
  Group,
  Text,
  Accordion,
  Button,
} from '@mantine/core'

const PlayerRow = ({ id, gameAddress, totalGameCredits, totalGameChips }) => {
  const [inputValue, setInputValue] = useState(0)
  const [errors, setErrors] = useState('')
  const [loading, setLoading] = useState(false)
  const [verify, setVerify] = useState('blue')
  const addRecentTransaction = useAddRecentTransaction()

  const gameCredits = useContractRead(
    {
      addressOrName: gameAddress,
      contractInterface: gameAbi,
    },
    'gameCredits',
    {
      args: [id],
      enabled: id && gameAddress ? true : false,
    }
  )

  const addCreditsWrite = useContractWrite(
    {
      addressOrName: gameAddress,
      contractInterface: gameAbi,
    },
    'addCredits',
    {
      onSuccess(data) {
        console.log('here')
        if (data) {
          addRecentTransaction({
            hash: data.hash,
            description: `Added ${inputValue} game credits to ${id}`,
          })
          data
            .wait()
            .then((data) => {
              if (data) {
                console.log(data)
                gameCredits.refetch()
                setLoading(false)
                setInputValue('')
              }
            })
            .catch((error) => {
              console.log(error)
              setErrors('There was an error adding credits please try again')
            })
        }
      },
      onError(error) {
        console.log(error)
        if (error.message === addCreditsErr) {
          setErrors(
            'There is not enough credits in the game contract to add that many credits.'
          )
        } else {
          setErrors('There was an error adding credits please try again')
        }
        setLoading(false)
      },
    }
  )
  const deductCreditsWrite = useContractWrite(
    {
      addressOrName: gameAddress,
      contractInterface: gameAbi,
    },
    'deductCredits',
    {
      onSuccess(data) {
        if (data) {
          addRecentTransaction({
            hash: data.hash,
            description: `Deducted ${inputValue} game credits from ${id}`,
          })
          data
            .wait()
            .then((data) => {
              if (data) {
                console.log(data)
                gameCredits.refetch()
                setLoading(false)
                setInputValue('')
              }
            })
            .catch((error) => {
              console.log(error)
              setLoading(false)
              setErrors(
                'There was an error subtracting credits, please try again'
              )
            })
        }
      },
      onError(error) {
        console.log(error)
        if (error.message === deductCreditsErr) {
          setErrors('You cannot deduct more than a player has')
        } else {
          setErrors('There was an error deducting credits please try again')
        }
        setLoading(false)
      },
    }
  )

  const verifyPlayer = (e) => {
    e.preventDefault()

    const signedMsg = window.prompt(
      'Please enter the signed message you recieved from the player'
    )

    if (signedMsg) {
      try {
        const date = new Date()
        date.setUTCMinutes(0, 0, 0)
        const rounded = date / 1000
        const signersAddress = utils.verifyMessage(
          `Hey I am who I say I am-${rounded}`,
          signedMsg
        )
        if (signersAddress === utils.getAddress(id)) {
          setVerify('green')
        } else {
          // check for the previous hour timestamp incase they got the code towards the end of an hour
          const previousHour = rounded - 3600
          const newSignersAddress = utils.verifyMessage(
            `Hey I am who I say I am-${rounded}`,
            signedMsg
          )
          if (newSignersAddress === utils.getAddress(id)) {
            setVerify('green')
          } else {
            setVerify('red')
          }
        }
      } catch {
        setVerify('red')
      }
    }
  }

  const handleClick = (e) => {
    e.preventDefault()
    if (!inputValue || window.isNaN(inputValue)) {
      setErrors('Please input a valid amount')
      return
    }
    if (inputValue === 0) {
      setErrors('Please input an amount to adjust the credits')
    }
    setErrors('')
    setLoading(true)
    if (inputValue > 0) {
      addCreditsWrite.write({
        args: [utils.getAddress(id), BigNumber.from(inputValue)],
      })
    }
    if (inputValue < 0) {
      deductCreditsWrite.write({
        args: [utils.getAddress(id), BigNumber.from(inputValue).abs()],
      })
    }
  }

  return (
    <Stack align='flex-start'>
      <Text>Address: {id}</Text>
      <Button compact color={verify} onClick={(e) => verifyPlayer(e)}>
        {verify === 'green'
          ? 'Verified'
          : verify === 'red'
          ? 'Failed'
          : 'Verify'}
      </Button>
      <NumberInput
        hideControls
        precision={0}
        value={inputValue}
        onChange={(v) => setInputValue(v)}
        max={totalGameChips?.data.sub(totalGameCredits?.data).toNumber()}
        min={-gameCredits?.data?.toNumber()}
        error={errors}
      />

      <Slider
        value={inputValue}
        onChange={(v) => setInputValue(v)}
        marks={[{ value: 0, label: 0 }]}
        max={totalGameChips?.data.sub(totalGameCredits?.data).toNumber()}
        min={-gameCredits?.data?.toNumber()}
        precision={0}
        style={{ minWidth: 300 }}
      />
      <Button
        color={inputValue > 0 ? 'green' : inputValue < 0 ? 'violet' : 'blue'}
        onClick={(e) => handleClick(e)}
        disabled={loading}
      >
        {loading
          ? 'Completing...'
          : inputValue > 0
          ? 'Add Credits'
          : inputValue < 0
          ? 'Deduct Credits'
          : 'Adjust Credits'}
      </Button>
    </Stack>
  )
}

export default PlayerRow
