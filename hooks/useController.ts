import * as React from 'react'
import { useContractReads, useProvider } from 'wagmi'
import { CONTROLLER_CONTRACT } from '../constants/contracts'
// import { CONTROLLER } from '../constants/address'
// import controllerAbi from '../abis/controller.json'
import useControllerStore from '../store/controllerStore'
import { BIG_ZERO, INDEX_SCALE } from '../constants/numbers'

const useController = () => {
  const setNf = useControllerStore(s => s.setNormFactor)
  const setIndexPrice = useControllerStore(s => s.setIndexPrice)
  const setMarkPrice = useControllerStore(s => s.setMarkPrice)
  const setLoaded = useControllerStore(s => s.setLoaded)
  const loaded = useControllerStore(s => s.loaded)


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
    ],  enabled: true,

  })

  const updateControllerData = React.useCallback(async () => {
    // console.log('reload controller state')
    // console.log(CONTROLLER_CONTRACT.address)
    // console.log(data)
    // console.log(isLoading)
    let _nf = BIG_ZERO
    let _index = BIG_ZERO
    let _mark = BIG_ZERO
    if (data !== undefined){
       _nf = data[0] 
       _index = data[1]
       _mark = data[2]
    } else{
      console.log('cant load controller')
    }
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
