import { BigNumber } from 'ethers'
import create from 'zustand'
import { BIG_ZERO } from '../constants/numbers'

interface AccountState {
  address?: string
  ens?: string
  oSqthBalance: BigNumber
  wethBalance: BigNumber
  crabBalance: BigNumber
  numberOfVaults: BigNumber
  vaultId: BigNumber
  vaultCollateral: BigNumber
  vaultDebt: BigNumber
  uniNftId: BigNumber
  tickLower: BigNumber
  tickUpper: BigNumber
  liquidity:  BigNumber
  setAddress: (addr: string) => void
  setEns: (ens: string) => void
  setOsqthBalance: (bal: BigNumber) => void
  setWethBalance: (bal: BigNumber) => void
  setCrabBalance: (bal: BigNumber) => void
  setNumberOfVaults: (nv: BigNumber) => void
  setVaultId: (vi: BigNumber) => void
  setVaultDebt: (vd: BigNumber) => void
  setVaultCollateral: (vc: BigNumber) => void
  setUniNftId: (ui: BigNumber) => void
  setTickLower: (tl: BigNumber) => void
  setTickUpper: (tu: BigNumber) => void
  setLiquidity: (l: BigNumber) => void

}

const useAccountStore = create<AccountState>(set => ({
  address: undefined,
  ens: undefined,
  oSqthBalance: BIG_ZERO,
  wethBalance: BIG_ZERO,
  crabBalance: BIG_ZERO,
  numberOfVaults: BIG_ZERO,
  vaultId: BIG_ZERO,
  vaultDebt: BIG_ZERO,
  vaultCollateral: BIG_ZERO,
  uniNftId: BIG_ZERO,
  tickLower: BIG_ZERO,
  tickUpper: BIG_ZERO,
  liquidity: BIG_ZERO,
  setAddress: (addr: string) => set({ address: addr }),
  setEns: (ens: string) => set({ ens }),
  setOsqthBalance: bal => set({ oSqthBalance: bal }),
  setWethBalance: bal => set({ wethBalance: bal }),
  setCrabBalance: bal => set({ crabBalance: bal }),
  setNumberOfVaults: nv => set({numberOfVaults: nv}),
  setVaultId: vi => set({vaultId: vi}),
  setVaultDebt: vd => set({vaultDebt: vd}),
  setVaultCollateral: vc => set({vaultCollateral: vc}),
  setUniNftId: ui => set({uniNftId: ui}),
  setTickLower: tl => set({tickLower: tl}),
  setTickUpper: tu => set({tickUpper: tu}),
  setLiquidity: l => set({liquidity: l})

}))

export default useAccountStore
