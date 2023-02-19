import { BigNumber } from 'ethers'
import { SocketAddress } from 'net'
import React from 'react'
import { useAccount, useBalance, useContractRead } from 'wagmi'
import{OSQUEETH, WETH, CRAB_STRATEGY_V2, SHORT_SQUEETH} from '../../constants/address'
import { CONTROLLER_CONTRACT, SHORT_SQUEETH_CONTRACT, UNI_NFT_MANAGER_CONTRACT } from '../../constants/contracts'
import { BIG_ZERO } from '../../constants/numbers'
import useAccountStore from '../../store/accountStore'
import shortSqueethAbi from '../../abis/shortSqueeth.json'

const useInitAccount = () => {
  // TODO: only handling one vault here. Need to hold aggregate if multiple short vaults exist
  const setOsqthBalance = useAccountStore(s => s.setOsqthBalance)
  const setWethBalance = useAccountStore(s => s.setWethBalance)
  const setCrabBalance = useAccountStore(s => s.setCrabBalance)
  const setNumberOfVaults = useAccountStore(s => s.setNumberOfVaults)
  const setVaultId = useAccountStore(s => s.setVaultId)
  const setVaultDebt = useAccountStore(s => s.setVaultDebt)
  const setVaultCollateral = useAccountStore(s => s.setVaultCollateral)
  const setUniNftId = useAccountStore(s => s.setUniNftId)
  const setTickLower = useAccountStore(s => s.setTickLower)
  const setTickUpper = useAccountStore(s => s.setTickUpper)
  const setLiquidity = useAccountStore(s => s.setLiquidity)

  const {isConnected, address: myAddr} = useAccount()

  const { data: squeethBalance } = useBalance({
    address: myAddr,
    token: OSQUEETH
  })

  const { data: wethBalance } = useBalance({
    address: myAddr,
    token: WETH
  })

  const { data: crabStrategyV2Balance } = useBalance({
    address: myAddr,
    token: CRAB_STRATEGY_V2
  })

  const { data: numOfVaults } = useContractRead({
    address: SHORT_SQUEETH,
    abi: shortSqueethAbi,
    functionName: 'balanceOf',
    args: [myAddr],
  })



  const { data: vaultId} = useContractRead({
    address: SHORT_SQUEETH,
    abi: shortSqueethAbi,
    functionName: 'tokenOfOwnerByIndex',
    args: [myAddr, 1],
    })

  const { data: vaultData} = useContractRead({
    ...CONTROLLER_CONTRACT,
    functionName: 'vaults',
    args: [vaultId],
    })

  const { data: uniNftData} = useContractRead({
    ...UNI_NFT_MANAGER_CONTRACT,
    functionName: 'positions',
    args: [vaultData?.NftCollateralId]
    })


  React.useEffect(() => {
    console.log('reload account state')
    setOsqthBalance((squeethBalance as unknown as BigNumber) || BIG_ZERO)
    setWethBalance((wethBalance as unknown as BigNumber) || BIG_ZERO)
    setCrabBalance((crabStrategyV2Balance as unknown as BigNumber) || BIG_ZERO)
    setNumberOfVaults((numOfVaults as unknown as BigNumber) || BIG_ZERO)
    setVaultId((vaultId as unknown as BigNumber) || BIG_ZERO)
    setVaultDebt((vaultData?.shortAmount as unknown as BigNumber) || BIG_ZERO)
    setVaultCollateral((vaultData?.collateralAmount as unknown as BigNumber) || BIG_ZERO)
    setUniNftId((vaultData?.NftCollateralId as unknown as BigNumber) || BIG_ZERO)
    setTickLower((uniNftData?.tickLower as unknown as BigNumber) || BIG_ZERO)
    setTickUpper((uniNftData?.tickUpper as unknown as BigNumber) || BIG_ZERO)
    setLiquidity((uniNftData?.liquidity as unknown as BigNumber) || BIG_ZERO)

    // [setOsqthBalance, setWethBalance, setCrabBalance, setNumberOfVaults, setVaultId, setVaultDebt, setVaultCollateral, setUniNftId]
  }, [])
}

export default useInitAccount
