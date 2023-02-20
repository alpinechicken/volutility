import { ConnectButton } from '@rainbow-me/rainbowkit';
import { BigNumber } from 'ethers/lib/ethers';
import { useCallback, useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useContract, useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useProvider } from 'wagmi';
import swapRouterAbi from '../abis/swapRouter.json';
import quoterAbi from '../abis/quoter.json';

import { INDEX_SCALE, FUNDING_PERIOD, MAX_UINT, ETH_OSQTH_FEE } from '../constants/numbers';
import { OSQUEETH, WETH, CONTROLLER, SQUEETH_UNI_POOL, WETH_USDC_POOL, SHORT_SQUEETH, SWAP_ROUTER, UNI_NFT_MANAGER, QUOTER } from '../constants/address';
// import { CONTROLLER_CONTRACT, OSQUEETH_CONTRACT, WETH_CONTRACT, CRAB_V2_CONTRACT } from '../constants/contracts'

import { CHAIN_ID } from '../constants/numbers';
import { useContractReads } from 'wagmi';
import { convertBigNumber, formatBigNumber, toBigNumber, calculateIV, formatNumber, wdiv } from '../utils/math'

import useController from '../hooks/useController';
import useInitAccount from '../hooks/init/useInitAccount';
import useControllerStore from '../store/controllerStore';
import useAccountStore from '../store/accountStore';
import useQuoter from '../hooks/useQuoter';
import { quoteExactIn, quoteExactOut } from '../utils/quoter';
import usePool from '../hooks/usePool';


import usePoolStore from '../store/poolStore';

const Home: NextPage = () => {

  // // Start controller
  useController()
  useInitAccount()
  usePool()

  const tick = usePoolStore(s => s.tick)
  const oSqthEthPrice = 1.0001**-tick


  const quoter = useQuoter()
  // console.log('quoter address is')
  // console.log(quoter?.address)
  // const outAmt = quoteExactOut(quoter, WETH, OSQUEETH, 100000, 3000)

  const nf = useControllerStore(s => s.normFactor)
  const ind = useControllerStore(s => s.indexPrice)
  const dnmark = useControllerStore(s => s.markPrice)
  const wethBal_ = useAccountStore(s => s.wethBalance)
  const osqBal_ = useAccountStore(s => s.oSqthBalance)
  const crabBal_ = useAccountStore(s => s.crabBalance)
  const vaultDebt_ = useAccountStore(s => s.vaultDebt)
  const vaultCollateral_ = useAccountStore(s => s.vaultCollateral)
  const numOfVaults_ = useAccountStore(s => s.numberOfVaults)
  const vaultId_ = useAccountStore(s => s.vaultId)
  const uniNftId_ = useAccountStore(s => s.uniNftId)
  const tickLower_ = useAccountStore(s => s.tickLower)
  const tickUpper_ = useAccountStore(s => s.tickUpper)
  const liquidity_ = useAccountStore(s => s.liquidity)

  // This account
  const {isConnected, address: myAddr} = useAccount();

  // Vega buy amount
  const [buyAmount, setBuyAmount] = useState(BigNumber.from(0));
  const [inputAmount, setInputAmount] = useState(BigNumber.from(0))
  const [outputAmount, setOutputAmount] = useState(BigNumber.from(0))
  const [quotePrice, setQuotePrice] = useState(BigNumber.from(0))
  const [toggleDetail, setToggleDetail] = useState(true)

  // Expand detail
  const toggleDetailClick = () => setToggleDetail(!toggleDetail)


  useEffect(()=> {
    setQuotePrice(inputAmount/outputAmount)
  }, [inputAmount])

  const handleChange = useCallback(async (event) => {
    setBuyAmount(event.target.value);
    setOutputAmount(1e18*buyAmount/(oSqthEthPrice*  vega   * ethPrice));
    // console.log('current exactOut')
    // console.log(outputAmount.toString())
    //TODO: add check for valid input before sending to quoter
    if (outputAmount.toString()!= '0' ) {
      setInputAmount(await quoteExactOut(quoter, WETH, OSQUEETH, outputAmount.toString(), 3000))
    }
  }, [buyAmount])

  // Things from controller
  const normFactor = nf/1e18
  const ethPrice = Math.sqrt(ind/1e18);
  // const oSqthEthPrice = dnmark*nf/(Math.sqrt(ind)*1e31);
  // const dailyFunding = Math.log(dnmark/ind)/(FUNDING_PERIOD);
  // const vol = Math.sqrt(Math.log(dnmark/ind)/(FUNDING_PERIOD/365.25))
  const vol = calculateIV(oSqthEthPrice, normFactor, ethPrice) 
  const quoteVol = calculateIV(quotePrice, normFactor, ethPrice) 

  const dailyFunding = vol**2/365.25
  const vega = 2*vol*FUNDING_PERIOD/365.25 /100


  const oSqthBalance = osqBal_?.formatted 
  // Just using one vault (TODO: add multiple vaults and LP)
  const netOsqth = oSqthBalance- (vaultDebt_|| 0)/1e18
  // TODO: add LP weth and eth. Deal with number types
  const netWeth = (wethBal_?.value*1 + (vaultCollateral_ || 0)*1)/1e18

  const slippage = 0.01
  // const amountOfSqueethToBuy = buyAmount/(  vega  * oSqthEthPrice * ethPrice);
  // const amountOfWethToPay = buyAmount/(  vega   * ethPrice) ;

  
  // Exact out swap
  const exactOutputSingleParams = {
    tokenIn: WETH,
    tokenOut: OSQUEETH,
    fee: ETH_OSQTH_FEE,
    recipient: myAddr,
    deadline: BigNumber.from(Math.floor(Date.now() / 1000 + 86400)).toString(),
    amountOut: outputAmount.toString(),
    amountInMaximum: ((1+slippage)*1e18*buyAmount/( vega   * ethPrice) ||0).toString() ,
    sqrtPriceLimitX96: BigNumber.from(0).toString(),
  }

  const { config } = usePrepareContractWrite({
    address: SWAP_ROUTER,
    abi: swapRouterAbi,
    functionName: 'exactOutputSingle',
    args: [exactOutputSingleParams],
  });

  const {write: buyVega, isSuccess} = useContractWrite(config)

  const detailView = () => (

    <div>
          <br></br>
    <div>Balance: {osqBal_?.formatted} </div>
    <div> weth bal storage: {wethBal_?.formatted}</div>
    <div> CHAIN_ID: {CHAIN_ID}</div>
    <div> normFactor: {normFactor}</div>
    <div> eth price (from controller): {ethPrice}</div>
    <div> osqth price (from slot0): {oSqthEthPrice} </div>
    <div> daily funding (from slot0): {dailyFunding} </div>
    <div>vega (from slot0): {vega} </div>
    <div>number of vaults: {numOfVaults_?.toString()} </div>
    <div>vaultId: {vaultId_?.toString()} </div>
    <div>vault collateral: {vaultCollateral_.toString()} </div>
    <div>vault debt: {vaultDebt_.toString()} </div>
    <div>vault uni nft: {uniNftId_.toString()} </div>
    <div>net osqth: {netOsqth.toString()} </div>
    <div>net weth: {netWeth.toString()} </div>
    <div> Long squeeth dollar vega: {vega * oSqthBalance * oSqthEthPrice * ethPrice}</div>
    <div> Uni nft tickLower: {tickLower_.toString()} </div>
    <div> Uni nft tickUpper: {tickUpper_.toString()} </div>
    <div> Uni nft liquidity: {liquidity_.toString()} </div>
    <div> Quote in amount: {inputAmount?.toString()} </div>
    <div> Quote price: {(quotePrice).toString()} </div>
    <div> Amount of osqth to buy: {outputAmount.toString()} </div>
    <div> Current loaded amountOut : {inputAmount.toString()}</div>
    </div>
  )
  



  return (
    <div className={styles.container}>
      <Head>
        <title>Volutility</title>
        <meta
          name="Volutility"
          content="Generated by two cats and a chicken"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>
          Volutility: A utility for your vol!
        </h1>
        <h2></h2>


          <h2>Your squeeth vega: ${(vega * netOsqth * oSqthEthPrice * ethPrice).toFixed(2)}</h2>
          <br></br>
          <div> How much more vega would you like?</div>
          <br></br>

          <input suppressHydrationWarning
            type="text"
            id="buyAmount"
            name="buyAmount"
            onChange={handleChange}
            value={buyAmount}
          />

          <div> <button suppressHydrationWarning
                  style ={{ marginTop: 24}}
                  className="button"
                  onClick={() => buyVega?.()}
                >
                  Buy some vega
                </button> 
          </div>


          <br></br>
          <div> Vol on uniswap : {(vol*100).toFixed(1)}% </div>
          <div> Vol to trade this size: {(quoteVol*100).toFixed(1)}% </div>
          <div> Vol impact: {((quoteVol-vol)*100).toFixed(1).toString()}% </div>


          <br></br>

          <div>
          <input type="submit" value="Toggle detailed view" onClick={toggleDetailClick} />
          </div>
            { toggleDetail ? detailView() : null }
        
          {/* <div> <button
                  style ={{ marginTop: 24}}
                  className="button"
                  onClick={() => quoteOut?.()}
                >
                  Get quote
                </button> 
          </div> */}


          {/* <ul>
                {people.map(p => (
                    <li> {p} </li>
                ))}
            </ul> */}
          {/* <div>short power perp {shortSqueethAddr.toString()} </div> */}

        {/* <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p> 

        <div className={styles.grid}>
          <a href="https://rainbowkit.com" className={styles.card}>
            <h2>RainbowKit Documentation &rarr;</h2>
            <p>Learn how to customize your wallet connection flow.</p>
          </a>

          <a href="https://wagmi.sh" className={styles.card}>
            <h2>wagmi Documentation &rarr;</h2>
            <p>Learn how to interact with Ethereum.</p>
          </a>

          <a
            href="https://github.com/rainbow-me/rainbowkit/tree/main/examples"
            className={styles.card}
          >
            <h2>RainbowKit Examples &rarr;</h2>
            <p>Discover boilerplate example RainbowKit projects.</p>
          </a>

          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Next.js Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Next.js Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}
      </main>

      <footer className={styles.footer}>
          Made with 🐱 🐱 + 🐔  
      </footer>
    </div>
  );
};

export default Home;
