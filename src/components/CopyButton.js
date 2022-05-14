import React, { useState } from 'react'
import styled from 'styled-components'

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
    <Button onClick={() => handleCopyClick()}>
      {isCopied ? 'Copied!' : 'Copy to Clipboard'}
    </Button>
  )
}

const Button = styled.button`
  color: white;
  background: #4786ff;
  border: 1px solid #4786ff;
  border-radius: 5px;
  font-size: 1rem;
  margin-top: 0.5em;
`

export default CopyButton
