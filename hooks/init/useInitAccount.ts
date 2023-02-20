import { BigNumber } from 'ethers'
import { SocketAddress } from 'net'
import React from 'react'
import { ContractResultDecodeError, useAccount, useBalance, useContractRead } from 'wagmi'
import{OSQUEETH, WETH, CRAB_STRATEGY_V2, SHORT_SQUEETH} from '../../constants/address'
import { CONTROLLER_CONTRACT, SHORT_SQUEETH_CONTRACT, UNI_NFT_MANAGER_CONTRACT } from '../../constants/contracts'
import { BIG_ZERO } from '../../constants/numbers'
import useAccountStore from '../../store/accountStore'
import shortSqueethAbi from '../../abis/shortSqueeth.json'
import crabStrategyV2Abi from '../../abis/crabStrategyV2.json'

const useInitAccount = () => {
  // TODO: only handling one vault here. For multiple vaults use subgraph 
  
  
  const setOsqthBalance = useAccountStore(s => s.setOsqthBalance)
  const setWethBalance = useAccountStore(s => s.setWethBalance)
  const setEthBalance = useAccountStore(s => s.setEthBalance)
  const setCrabBalance = useAccountStore(s => s.setCrabBalance)
  const setCrabEth = useAccountStore(s => s.setCrabEth)
  const setCrabOsqth = useAccountStore(s => s.setCrabOsqth)
  const setNumberOfVaults = useAccountStore(s => s.setNumberOfVaults)
  const setVaultId = useAccountStore(s => s.setVaultId)
  const setVaultCollateral = useAccountStore(s => s.setVaultCollateral)
  const setVaultDebt = useAccountStore(s => s.setVaultDebt)

  const setUniNftId = useAccountStore(s => s.setUniNftId)
  const setTickLower = useAccountStore(s => s.setTickLower)
  const setTickUpper = useAccountStore(s => s.setTickUpper)
  const setLiquidity = useAccountStore(s => s.setLiquidity)
  const setUniswapEth = useAccountStore(s => s.setUniswapEth)
  const setUniswapOsqth = useAccountStore(s => s.setUniswapOsqth)

  const {isConnected, address: myAddr} = useAccount()

  const { data: squeethBalance } = useBalance({
    address: myAddr,
    token: OSQUEETH
  })

  const { data: wethBalance } = useBalance({
    address: myAddr,
    token: WETH
  })

  const { data: ethBalance } = useBalance({
    address: myAddr
  })

  const { data: crabBalance } = useBalance({
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
    args: [myAddr, 0],
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

    const { data: crabVaultDetails } = useContractRead({
      address: CRAB_STRATEGY_V2,
      abi: crabStrategyV2Abi,
      functionName: 'getVaultDetails',
    })

    const { data: crabTotalSupply } = useContractRead({
      address: CRAB_STRATEGY_V2,
      abi: crabStrategyV2Abi,
      functionName: 'totalSupply',
    })

  console.log(crabVaultDetails)
  // Look through crab holdings to eth and squeeth 
  const crabVaultEth = crabVaultDetails[2]
  const crabVaultOsqth = crabVaultDetails[3]
  // console.log(crabVaultOsqth?.toString())
  // const crabVaultEth = BIG_ZERO
  // const crabVaultOsqth = BIG_ZERO
  const crabEth = crabBalance?.value.mul(crabVaultEth).div(crabTotalSupply)
  const crabOsqth = crabBalance?.value.mul(crabVaultOsqth).div(crabTotalSupply)

  const uniswapEth = BIG_ZERO
  const uniswapOsqth = BIG_ZERO
  console.log('crabBalance')
  console.log(crabBalance?.value.toString())
  console.log(crabTotalSupply?.toString())
  console.log(crabVaultEth?.toString())
  console.log(crabVaultOsqth?.toString())
  console.log(crabEth?.toString())
  console.log(crabOsqth?.toString())

  React.useEffect(() => {
    console.log('reload account state')
    setOsqthBalance((squeethBalance as unknown as BigNumber) || BIG_ZERO)
    setWethBalance((wethBalance as unknown as BigNumber) || BIG_ZERO)
    setEthBalance((ethBalance as unknown as BigNumber) || BIG_ZERO)
    setCrabBalance((crabBalance as unknown as BigNumber) || BIG_ZERO)
    console.log('setting crabEth')
    console.log(crabEth?.toString())
    setCrabEth((crabEth as unknown as BigNumber) || BIG_ZERO)
    setCrabOsqth((crabOsqth as unknown as BigNumber) || BIG_ZERO)
    setNumberOfVaults((numOfVaults as unknown as BigNumber) || BIG_ZERO)
    setVaultId((vaultId as unknown as BigNumber) || BIG_ZERO)
    setVaultDebt((vaultData?.shortAmount as unknown as BigNumber) || BIG_ZERO)
    setVaultCollateral((vaultData?.collateralAmount as unknown as BigNumber) || BIG_ZERO)
    setUniNftId((vaultData?.NftCollateralId as unknown as BigNumber) || BIG_ZERO)
    setTickLower((uniNftData?.tickLower as unknown as BigNumber) || BIG_ZERO)
    setTickUpper((uniNftData?.tickUpper as unknown as BigNumber) || BIG_ZERO)
    setLiquidity((uniNftData?.liquidity as unknown as BigNumber) || BIG_ZERO)
    setUniswapEth((uniswapEth as unknown as BigNumber) || BIG_ZERO)
    setUniswapOsqth((uniswapOsqth as unknown as BigNumber) || BIG_ZERO)
    // [setOsqthBalance, setWethBalance, setCrabBalance, setNumberOfVaults, setVaultId, setVaultDebt, setVaultCollateral, setUniNftId]
  }, [])
}

export default useInitAccount
