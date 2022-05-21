import React, { useState } from 'react'
import { Button } from '@mantine/core'

const CopyButton = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false)

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    } else {
      return document.execCommand('copy', true, text)
    }
  }

  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(text)
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
    <Button onClick={() => handleCopyClick()} radius='xl' size='xs' compact>
      {isCopied ? 'Copied!' : 'Copy'}
    </Button>
  )
}

export default CopyButton
