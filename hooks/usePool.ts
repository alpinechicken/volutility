import * as React from 'react'
import { useContractReads, useProvider } from 'wagmi'
import { SQUEETH_UNI_POOL_CONTRACT } from '../constants/contracts'
import usePoolStore from '../store/poolStore'
// Use uni squeeth/eth pool 
const usePool = () => {
  const setLoaded = usePoolStore(s => s.setLoaded)
  const setToken0 = usePoolStore(s => s.setToken0)
  const setToken1 = usePoolStore(s => s.setToken1)
  const setFee = usePoolStore(s => s.setFee)
  const setTickSpacing = usePoolStore(state => state.setTickSpacing)
  const setMaxLiquidityPerTick = usePoolStore(state => state.setMaxLiquidityPerTick)
  const setTick = usePoolStore(state => state.setTick)
  const setLiquidity = usePoolStore(state => state.setLiquidity)
  const loaded = usePoolStore(s => s.loaded)

  const {refetch: getPoolData, data, isLoading } = useContractReads({
    contracts: [
        {
          ...SQUEETH_UNI_POOL_CONTRACT,
          functionName: 'token0',
        },
        {
          ...SQUEETH_UNI_POOL_CONTRACT,
          functionName: 'token1',
        },
        {
          ...SQUEETH_UNI_POOL_CONTRACT,
          functionName: 'fee',
        },
        {
          ...SQUEETH_UNI_POOL_CONTRACT,
          functionName: 'tickSpacing',
        },
        {
          ...SQUEETH_UNI_POOL_CONTRACT,
          functionName: 'maxLiquidityPerTick',
        },
        {
          ...SQUEETH_UNI_POOL_CONTRACT,
          functionName: 'liquidity',
        },
        {
          ...SQUEETH_UNI_POOL_CONTRACT,
          functionName: 'slot0',
        },
      ]})

  const updatePoolData = React.useCallback(async () => {
    console.log('reload pool state')
    setToken0(data[0] )
    setToken1(data[1])
    setFee(data[2])
    setTickSpacing(data[3])
    setMaxLiquidityPerTick(data[4])
    setLiquidity(data[5])
    setTick(data[6][1])
    setLoaded(true)
  }, [setToken0, setToken1, setFee, setTickSpacing, setMaxLiquidityPerTick, setLiquidity, setTick])

  React.useEffect(() => {
    if (!loaded) updatePoolData()
  }, [loaded, updatePoolData])
 return { getPoolData, data, isLoading}

}

export default usePool
