import { BigNumber } from 'ethers'
import { SocketAddress } from 'net'
import React from 'react'
import { ContractResultDecodeError, useAccount, useBalance, useContractRead } from 'wagmi'
import{OSQUEETH, WETH, CRAB_STRATEGY_V2, SHORT_SQUEETH} from '../../constants/address'
import { CONTROLLER_CONTRACT, SHORT_SQUEETH_CONTRACT, UNI_NFT_MANAGER_CONTRACT } from '../../constants/contracts'
import { BIG_ZERO } from '../../constants/numbers'
import useAccountStore from '../../store/accountStore'
import usePoolStore from '../../store/poolStore'
import shortSqueethAbi from '../../abis/shortSqueeth.json'
import crabStrategyV2Abi from '../../abis/crabStrategyV2.json'

const useInitAccount = () => {
  // TODO: only handling one vault here. For multiple vaults use subgraph 
  // TODO: add in bull
  // TODO: add in crab/$ LPs ( careful with decimals and token0/token1)
  usePoolStore()
  
  const setOsqthBalance = useAccountStore(s => s.setOsqthBalance)
  const setWethBalance = useAccountStore(s => s.setWethBalance)
  const setEthBalance = useAccountStore(s => s.setEthBalance)
  const setCrabBalance = useAccountStore(s => s.setCrabBalance)
  const setCrabEth = useAccountStore(s => s.setCrabEth)
  const setCrabOsqth = useAccountStore(s => s.setCrabOsqth)
  const setNumberOfVaults = useAccountStore(s => s.setNumberOfVaults)
  const setVaultIds = useAccountStore(s => s.setVaultIds)
  const setVaultCollateral = useAccountStore(s => s.setVaultCollateral)
  const setVaultDebt = useAccountStore(s => s.setVaultDebt)
  const setUniNftIds = useAccountStore(s => s.setUniNftIds)
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

  // console.log(crabVaultDetails)
  // Look through crab holdings to eth and squeeth 
  let crabVaultEth = BIG_ZERO
  let crabVaultOsqth = BIG_ZERO
  if (crabVaultDetails !== undefined){
      crabVaultEth = crabVaultDetails[2] 
      crabVaultOsqth = crabVaultDetails[3]
    } else {
      console.log('No crab :/')
    }

  const crabEth = crabBalance?.value.mul(crabVaultEth).div(crabTotalSupply)
  const crabOsqth = crabBalance?.value.mul(crabVaultOsqth).div(crabTotalSupply)

  let uniswapEth = BIG_ZERO
  let uniswapOsqth = BIG_ZERO
  if (uniNftData !== undefined){
    const currentTick = usePoolStore(s => s.tick)
    // TODO: switch this for isWethToken0 (but same direction for goerli and mainnet currently)
    const p = 1.0001**-currentTick  
    const pa = 1.0001**-uniNftData?.tickUpper
    const pb = 1.0001**-uniNftData?.tickLower
    // console.log('p, pa, pb')
    // console.log(p, pa, pb)
    uniswapEth = uniNftData?.liquidity * (Math.sqrt(p) - Math.sqrt(pa))
    uniswapOsqth = uniNftData?.liquidity * (Math.sqrt(pb) - Math.sqrt(p))/(Math.sqrt(p)* Math.sqrt(pb))
    console.log('uni osqth')
    console.log(uniswapOsqth.toString())
  } else {
    console.log('No uni nft :/')
  }

  // console.log('crabBalance')
  // console.log(crabBalance?.value.toString())
  // console.log(crabTotalSupply?.toString())
  // console.log(crabVaultEth?.toString())
  // console.log(crabVaultOsqth?.toString())
  // console.log(crabEth?.toString())
  // console.log(crabOsqth?.toString())

  React.useEffect(() => {
    console.log('reload account state')
    setOsqthBalance((squeethBalance as unknown as BigNumber) || BIG_ZERO)
    setWethBalance((wethBalance as unknown as BigNumber) || BIG_ZERO)
    setEthBalance((ethBalance as unknown as BigNumber) || BIG_ZERO)
    setCrabBalance((crabBalance as unknown as BigNumber) || BIG_ZERO)
    setCrabEth((crabEth as unknown as BigNumber) || BIG_ZERO)
    setCrabOsqth((crabOsqth as unknown as BigNumber) || BIG_ZERO)
    setNumberOfVaults((numOfVaults as unknown as BigNumber) || BIG_ZERO)
    // TODO: make this an array
    setVaultIds((vaultId as unknown as BigNumber) || BIG_ZERO)
    setVaultDebt((vaultData?.shortAmount as unknown as BigNumber) || BIG_ZERO)
    setVaultCollateral((vaultData?.collateralAmount as unknown as BigNumber) || BIG_ZERO)
    // TODO: make this an array
    setUniNftIds((vaultData?.NftCollateralId as unknown as BigNumber) || BIG_ZERO)
    setUniswapEth((uniswapEth as unknown as BigNumber) || BIG_ZERO)
    setUniswapOsqth((uniswapOsqth as unknown as BigNumber) || BIG_ZERO)
    // [setOsqthBalance, setWethBalance, setCrabBalance, setNumberOfVaults, setVaultId, setVaultDebt, setVaultCollateral, setUniNftId]
  }, [])
}

export default useInitAccount
