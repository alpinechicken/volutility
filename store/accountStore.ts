import { BigNumber } from 'ethers'
import create from 'zustand'
import { BIG_ZERO } from '../constants/numbers'

interface AccountState {
  address?: string
  ens?: string
  oSqthBalance: BigNumber
  wethBalance: BigNumber
  ethBalance: BigNumber
  crabBalance: BigNumber
  crabEth: BigNumber
  crabOsqth: BigNumber
  numberOfVaults: BigNumber
  vaultId: BigNumber
  vaultCollateral: BigNumber
  vaultDebt: BigNumber
  uniNftId: BigNumber
  tickLower: BigNumber
  tickUpper: BigNumber
  liquidity:  BigNumber
  uniswapEth: BigNumber
  uniswapOsqth: BigNumber
  setAddress: (addr: string) => void
  setEns: (ens: string) => void
  setOsqthBalance: (bal: BigNumber) => void
  setWethBalance: (bal: BigNumber) => void
  setEthBalance: (bal: BigNumber) => void
  setCrabBalance: (bal: BigNumber) => void
  setCrabEth: (ce: BigNumber) => void
  setCrabOsqth: (co: BigNumber) => void
  setNumberOfVaults: (nv: BigNumber) => void
  setVaultId: (vi: BigNumber) => void
  setVaultCollateral: (vc: BigNumber) => void
  setVaultDebt: (vd: BigNumber) => void
  setUniNftId: (ui: BigNumber) => void
  setTickLower: (tl: BigNumber) => void
  setTickUpper: (tu: BigNumber) => void
  setLiquidity: (l: BigNumber) => void
  setUniswapEth: (uw: BigNumber) => void
  setUniswapOsqth: (uo: BigNumber) => void
}

const useAccountStore = create<AccountState>(set => ({
  address: undefined,
  ens: undefined,
  oSqthBalance: BIG_ZERO,
  wethBalance: BIG_ZERO,
  ethBalance: BIG_ZERO, 
  crabBalance: BIG_ZERO,
  crabEth: BIG_ZERO,
  crabOsqth: BIG_ZERO,
  numberOfVaults: BIG_ZERO,
  vaultId: BIG_ZERO,
  vaultDebt: BIG_ZERO,
  vaultCollateral: BIG_ZERO,
  uniNftId: BIG_ZERO,
  tickLower: BIG_ZERO,
  tickUpper: BIG_ZERO,
  liquidity: BIG_ZERO,
  uniswapEth: BIG_ZERO,
  uniswapOsqth: BIG_ZERO,  
  setAddress: (addr: string) => set({ address: addr }),
  setEns: (ens: string) => set({ ens }),
  setOsqthBalance: bal => set({ oSqthBalance: bal }),
  setWethBalance: bal => set({ wethBalance: bal }),
  setEthBalance: ebal => set({ ethBalance: ebal }),
  setCrabBalance: bal => set({ crabBalance: bal }),
  setCrabEth: ce => set({crabEth: ce}),
  setCrabOsqth: co => set({crabOsqth: co}),
  setNumberOfVaults: nv => set({numberOfVaults: nv}),
  setVaultId: vi => set({vaultId: vi}),
  setVaultCollateral: vc => set({vaultCollateral: vc}),
  setVaultDebt: vd => set({vaultDebt: vd}),
  setUniNftId: ui => set({uniNftId: ui}),
  setTickLower: tl => set({tickLower: tl}),
  setTickUpper: tu => set({tickUpper: tu}),
  setLiquidity: l => set({liquidity: l}),
  setUniswapEth: ue => set({tickUpper: ue}),
  setUniswapOsqth: uo => set({liquidity: uo})
}))

export default useAccountStore
