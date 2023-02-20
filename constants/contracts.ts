import {
  CONTROLLER,
  OSQUEETH,
  WETH,
  QUOTER,
  CRAB_STRATEGY_V2,
  SHORT_SQUEETH,
  UNI_NFT_MANAGER,
  SQUEETH_UNI_POOL
} from './address'
import controllerAbi from '../abis/controller.json'
import erc20Abi from '../abis/ERC20.json'
import quoterAbi from '../abis/quoter.json'
import crabV2Abi from '../abis/crabStrategyV2.json'
import shortSqueethAbi from '../abis/shortSqueeth.json'
import nonFungiblePositionManagerAbi from '../abis/nonFungiblePositionManager.json'
import uniswapPoolAbi from '../abis/uniswapPool.json'

// Need to implement for other contracts as well

export const CONTROLLER_CONTRACT = {
  address: CONTROLLER,
  abi: controllerAbi,
}

export const SQUEETH_UNI_POOL_CONTRACT = {
  address: SQUEETH_UNI_POOL,
  abi: uniswapPoolAbi,
}

export const OSQUEETH_CONTRACT = {
  addressOrName: OSQUEETH,
  contractInterface: erc20Abi,
}

export const WETH_CONTRACT = {
  addressOrName: WETH,
  contractInterface: erc20Abi,
}


export const SHORT_SQUEETH_CONTRACT = {
  address: SHORT_SQUEETH,
  abi: shortSqueethAbi,
}

export const UNI_NFT_MANAGER_CONTRACT = {
  address: UNI_NFT_MANAGER,
  abi: nonFungiblePositionManagerAbi,
}

export const QUOTER_CONTRACT = {
  address: QUOTER,
  abi: quoterAbi,
}

export const CRAB_V2_CONTRACT = {
  addressOrName: CRAB_STRATEGY_V2,
  contractInterface: crabV2Abi,
}

