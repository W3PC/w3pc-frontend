import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import useAccountCtx from '../hooks/useAccountCtx'
import { utils } from 'ethers'
import UserBalance from './UserBalance'
import { zeroAddress } from '../constants'

const AccountInfo = ({ account }) => {
  const history = useHistory()
  const location = useLocation()
  const accountCtx = useAccountCtx()
  const [username, setUsername] = useState('')

  useEffect(() => {
    const getName = async () => {
      if (account?.data?.address && accountCtx) {
        const name = await accountCtx.name(account.data.address)
        setUsername(name)
      }
    }
    getName()
  }, [account.data.address, accountCtx])
  useEffect(() => {
    // If they are connected with no registered name, take them to the register name page
    if (
      account &&
      username === zeroAddress &&
      history.location.pathname !== '/createAccount'
    ) {
      history.push('/createAccount')
    }
    //If they are on the createAccount page with an account already created take them to homepage
    if (
      username !== zeroAddress &&
      history.location.pathname === '/createAccount'
    ) {
      history.push('/cashier')
    }
  }, [username, location.pathname, account])

  return (
    <>
      {account.isLoading && <div>Loading Wallet...</div>}
      {account.isError && <div>Error Loading Wallet</div>}
      {account.data?.address && username === zeroAddress && (
        <div>Wallet: {account.data.address}</div>
      )}
      {username && username !== zeroAddress && (
        <div>
          <div>Account: {utils.parseBytes32String(username)}</div>
          <UserBalance account={account} />
        </div>
      )}
    </>
  )
}

export default AccountInfo
