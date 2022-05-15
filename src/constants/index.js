export const zeroAddress = '0x0000000000000000000000000000000000000000'
export const zeroUserAddress =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
export const cashierAddress = process.env.REACT_APP_CASHIER_ADDRESS
export const gameDirectoryAddress = process.env.REACT_APP_GAME_DIRECTORY_ADDRESS
export const accountAddress = process.env.REACT_APP_ACCOUNT_ADDRESS
export const usdcAddress = process.env.REACT_APP_USDC_ADDRESS

export const deductCreditsErr =
  'Error: VM Exception while processing transaction: reverted with panic code 0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)'
export const addCreditsErr =
  "Error: VM Exception while processing transaction: reverted with custom error 'NotEnoughCredits()'"
