import { BigNumber } from 'ethers'
import { Quoter } from '../types/contracts'

export async function quoteExactIn(
  quoter: Quoter,
  tokenIn: string,
  tokenOut: string,
  amountIn: BigNumber,
  poolFee: number
) {
  const { amountOut } = await quoter.callStatic.quoteExactInputSingle({
    tokenIn,
    tokenOut,
    amountIn: amountIn,
    fee: poolFee,
    sqrtPriceLimitX96: 0,
  })

  return amountOut
}

export async function quoteExactOut(
  quoter: Quoter,
  tokenIn: string,
  tokenOut: string,
  amountOut: BigNumber,
  poolFee: number
) {
  const { amountIn } = await quoter.callStatic.quoteExactOutputSingle({
    tokenIn,
    tokenOut,
    amount: amountOut,
    fee: poolFee,
    sqrtPriceLimitX96: 0,
  })

  return amountIn
}
