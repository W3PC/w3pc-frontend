import React, { useState } from 'react'
import { utils } from 'ethers'
import Button from './Button'
import { useSigner } from 'wagmi'
import styled from 'styled-components'
import Tooltip from './Tooltip/Tooltip'

const VerifyButton = ({}) => {
  const [signed, setSigned] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const signer = useSigner()

  const tooltipText = `Sign a message that you can send to the game host to verify this is your account`

  const handleClick = (e) => {
    e.preventDefault()
    if (signed) {
      handleCopyClick()
    } else {
      signMessage()
    }
  }

  const signMessage = async () => {
    const date = new Date()
    date.setUTCMinutes(0, 0, 0)
    const rounded = date / 1000

    const signedMessage = await signer.data.signMessage(
      `Hey I am who I say I am-${rounded}`
    )
    setSigned(signedMessage)
  }

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    } else {
      return document.execCommand('copy', true, text)
    }
  }

  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(signed)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 1500)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Tooltip content={tooltipText} direction='left'>
      <Button copy onClick={(e) => handleClick(e)}>
        {!signed ? 'Verify' : isCopied ? 'Copied' : 'Copy signed msg'}
      </Button>
    </Tooltip>
  )
}

export default VerifyButton
