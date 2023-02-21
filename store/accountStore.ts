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
  vaultIds: BigNumber
  vaultCollateral: BigNumber
  vaultDebt: BigNumber
  uniNftIds: BigNumber
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
  setVaultIds: (vi: BigNumber) => void
  setVaultCollateral: (vc: BigNumber) => void
  setVaultDebt: (vd: BigNumber) => void
  setUniNftIds: (ui: BigNumber) => void
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
  vaultIds: BIG_ZERO,
  vaultDebt: BIG_ZERO,
  vaultCollateral: BIG_ZERO,
  uniNftIds: BIG_ZERO,
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
  setVaultIds: vi => set({vaultIds: vi}),
  setVaultCollateral: vc => set({vaultCollateral: vc}),
  setVaultDebt: vd => set({vaultDebt: vd}),
  setUniNftIds: ui => set({uniNftIds: ui}),
  setUniswapEth: ue => set({uniswapEth: ue}),
  setUniswapOsqth: uo => set({uniswapOsqth: uo})
}))

export default useAccountStore
