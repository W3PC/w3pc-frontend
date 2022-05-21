import { showNotification, updateNotification } from '@mantine/notifications'

export const showPendingTxn = (hash) => {
  showNotification({
    id: hash,
    autoClose: false,
    title: 'Transaction pending',
    message: `Transaction: ${hash} is pending...`,
    color: 'yellow',
    loading: true,
  })
}

export const updatePendingTxn = (hash, isError) => {
  if (isError) {
    updateNotification({
      id: hash,
      autoClose: 4000,
      title: 'There was an error with your transaction',
      message: `There was an error completing transaction: ${hash}`,
      color: 'red',
      loading: false,
    })
  } else {
    updateNotification({
      id: hash,
      autoClose: 4000,
      title: 'Transaction Confirmed',
      message: `Transaction: ${hash} was confirmed!`,
      color: 'green',
      loading: false,
    })
  }
}
