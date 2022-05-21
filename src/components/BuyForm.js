import React, { useEffect, useState } from 'react'
import { erc20ABI, useContractWrite, useProvider } from 'wagmi'
import { BigNumber, constants } from 'ethers'
import cashierAbi from '../constants/abis/Cashier.json'
import { cashierAddress, usdcAddress } from '../constants'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { Title, NumberInput, Button, Group, Checkbox } from '@mantine/core'

const BuyForm = ({ userUsdc, update, allowance }) => {
  const [value, setValue] = useState(0)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('unapproved')
  const [unlimitedApproval, setUnlimitedApproval] = useState(false)
  const addRecentTransaction = useAddRecentTransaction()

  const provider = useProvider()

  useEffect(() => {
    if (allowance?.data && status === 'unapproved') {
      if (value > 0 && allowance.data.gt(value)) {
        setStatus('approved')
      }
    }
  }, [allowance?.data, value, status])

  const approveUsdc = useContractWrite(
    {
      addressOrName: usdcAddress,
      contractInterface: erc20ABI,
    },
    'approve',
    {
      onError(error) {
        console.log(error)
        setErrors({
          ...errors,
          buyTokens:
            'There was an error approving your transaction please try again',
        })
        setValue('')
        setStatus('unapproved')
      },
      onSuccess(data) {
        if (data) {
          addRecentTransaction({
            hash: data.hash,
            description: `Approved ${value} USDC to be spent on CHIPS`,
          })
          data
            .wait()
            .then((data) => {
              if (data) {
                setStatus('approved')
              }
            })
            .catch((e) => {
              setErrors({
                buyTokens:
                  'There was an error with your approval please try again',
              })
              setStatus('unapproved')
            })
        }
      },
    }
  )

  const buyChips = () => {
    if (value === '' || value === 0) {
      return
    }
    if (status === 'success') {
      setStatus('unapproved')
    }

    if (status === 'approved') {
      setStatus('buying')
      writeBuyChips.write({
        args: [value],
      })
    } else {
      setStatus('approving')
      if (unlimitedApproval) {
        approveUsdc.write({
          args: [cashierAddress, constants.MaxUint256],
        })
      }
      approveUsdc.write({
        args: [cashierAddress, BigNumber.from(value).mul(10 ** 6)],
      })
    }
  }

  const writeBuyChips = useContractWrite(
    {
      addressOrName: cashierAddress,
      contractInterface: cashierAbi,
      signerOrProvider: provider,
    },
    'getChips',
    {
      onSettled(data) {
        if (data) {
          addRecentTransaction({
            hash: data.hash,
            description: `Bought ${value} CHIPS`,
          })
          data
            .wait()
            .then((data) => {
              if (data) {
                setValue('')
                setErrors({})
                setStatus('success')
                update()
              }
            })
            .catch((error) => {
              setStatus('approved')
              setErrors({
                buyTokens:
                  'There was an error with your transaction Please try again',
              })
            })
        }
      },
      onError(error) {
        console.log(error)
        setErrors({
          ...errors,
          buyTokens:
            'There was an error completing your transaction please try again',
        })
        setStatus('approved')
      },
      overrides(data) {
        //Was going over gas estimations causing txn to fail. Quick fix but we may want to think of a better way to do this like if txn fails prompt the user to raise gas limits so we have more accurate estimations
        return { gasLimit: data.gasLimit.mul(1.5) }
      },
    }
  )

  return (
    <>
      <Title order={2} align='center'>
        Buy CHIPS with USDC
      </Title>
      <NumberInput
        onChange={(v) => setValue(v)}
        value={value}
        min={0}
        max={userUsdc?.data?.div(1000000).toNumber()}
        disabled={status === 'buying' && status === 'approving'}
        precision={0}
        hideControls
        error={errors?.buyTokens}
      />
      <Group>
        <Button
          onClick={buyChips}
          disabled={status === 'approving' || status === 'buying'}
        >
          {!value || status === 'approved' || status === 'success'
            ? 'Buy CHIPS'
            : status === 'unapproved' && value
            ? 'Approve'
            : status === 'approving'
            ? 'Approving'
            : 'Confirming Txn...'}
        </Button>
        {status === 'unapproved' && value > 0 && (
          <Checkbox
            label='Unlimited Approval'
            checked={unlimitedApproval}
            onChange={(event) =>
              setUnlimitedApproval(event.currentTarget.checked)
            }
          />
        )}
      </Group>
      {status === 'success' && (
        <div style={{ color: 'green' }}>Transaction was a success!</div>
      )}
    </>
  )
}

export default BuyForm
