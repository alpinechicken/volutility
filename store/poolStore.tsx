import { BigNumber } from 'ethers'
import create from 'zustand'
import { BIG_ZERO } from '../constants/numbers'

interface PoolState {
  loaded: boolean
  token0: string
  token1: string
  fee: number
  tickSpacing: number
  maxLiquidityPerTick: BigNumber
  tick: number
  liquidity: BigNumber
  setLoaded: (ld: boolean) => void
  setToken0: (t0: string) => void
  setToken1: (t1: string) => void
  setFee: (f: number) => void
  setTickSpacing: (ts: number) => void
  setMaxLiquidityPerTick: (mlt: BigNumber) => void
  setTick: (t: number) => void
  setLiquidity: (l: BigNumber) => void

}

const usePoolStore = create<PoolState>(set => ({
    loaded: false,
    token0: '',
    token1: '',
    fee: 0,
    tickSpacing: 0,
    maxLiquidityPerTick: BIG_ZERO,
    tick: 0,
    liquidity: BIG_ZERO,
    setLoaded: ld => set({ loaded: ld }),
    setToken0: t0 => set({ token0: t0 }),
    setToken1: t1 => set({ token1: t1 }),
    setFee: f => set({ fee: f }),
    setTickSpacing: ts => set({ tickSpacing: ts }),
    setMaxLiquidityPerTick: mlt => set({ maxLiquidityPerTick: mlt }),
    setTick: t => set({ tick: t }),
    setLiquidity: l => set({ liquidity: l }),

}))

export default usePoolStore
