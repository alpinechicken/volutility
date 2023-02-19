import * as React from 'react'
import { useContractReads, useProvider } from 'wagmi'
import { CONTROLLER_CONTRACT } from '../constants/contracts'
// import { CONTROLLER } from '../constants/address'
// import controllerAbi from '../abis/controller.json'
import useControllerStore from '../store/controllerStore'
import { INDEX_SCALE } from '../constants/numbers'

const useController = () => {
  const provider = useProvider()
  const setNf = useControllerStore(s => s.setNormFactor)
  const setIndexPrice = useControllerStore(s => s.setIndexPrice)
  const setMarkPrice = useControllerStore(s => s.setMarkPrice)
  const setLoaded = useControllerStore(s => s.setLoaded)
  const loaded = useControllerStore(state => state.loaded)


  const {refetch: getControllerData, data, isLoading } = useContractReads({
    contracts: [
      {
        ...CONTROLLER_CONTRACT,
        functionName: 'getExpectedNormalizationFactor',
      },
      {
        ...CONTROLLER_CONTRACT,
        functionName: 'getIndex',
        args: [1],
      },
      {
        ...CONTROLLER_CONTRACT,
        functionName: 'getDenormalizedMark',
        args: [1],
      },
    ],  enabled: false,

  })

  const updateControllerData = React.useCallback(async () => {
    console.log('reload controller state')
    const _nf = data[0] 
    const _index = data[1]
    const _mark = data[2]
    setNf(_nf)
    setIndexPrice(_index.mul(INDEX_SCALE).mul(INDEX_SCALE))
    setMarkPrice(_mark.mul(INDEX_SCALE).mul(INDEX_SCALE))
    setLoaded(true)
  }, [setIndexPrice, setLoaded, setMarkPrice, setNf])

  React.useEffect(() => {
    if (!loaded) updateControllerData()
  }, [loaded, updateControllerData])
 return { getControllerData, data, isLoading}

}

export default useController
