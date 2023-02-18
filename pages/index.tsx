import { ConnectButton } from '@rainbow-me/rainbowkit';
import { BigNumber } from 'ethers/lib/ethers';
import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useBalance, useContract, erc20ABI } from 'wagmi';
import erc20Abi from '../abis/ERC20.json';
import controllerAbi from '../abis/controller.json';
import shortSqueethAbi from '../abis/shortSqueeth.json';
import swapRouterAbi from '../abis/swapRouter.json';
import weth9Abi from '../abis/weth9.json';
import nftPositionManager  from '../abis/nonFungiblePositionManager.json';

// import { erc20ABI } from 'wagmi';
import { INDEX_SCALE, FUNDING_PERIOD, MAX_UINT, ETH_OSQTH_FEE } from '../constants/numbers';
import { OSQUEETH, WETH, CONTROLLER, SQUEETH_UNI_POOL, WETH_USDC_POOL, SHORT_SQUEETH, SWAP_ROUTER, UNI_NFT_MANAGER } from '../constants/address';

import { CHAIN_ID } from '../constants/numbers';

import { convertBigNumber, formatBigNumber, toBigNumber, calculateIV, formatNumber, wdiv } from '../utils/math'

const Home: NextPage = () => {
  // This account
  const {isConnected, address: myAddr} = useAccount();

  // ERC20 balance
  const { data: squeethBalance, isLoading } = useBalance({
    address: myAddr,
    token: OSQUEETH
  })

  // ERC20 balance
  const { data: wethBalance } = useBalance({
    address: myAddr,
    token: WETH
  })

  // // Controller read
  const { data: nf } = useContractRead({
    address: CONTROLLER,
    abi: controllerAbi,
    functionName: 'getExpectedNormalizationFactor',
  })

  const { data: ind } = useContractRead({
    address: CONTROLLER,
    abi: controllerAbi,
    functionName: 'getIndex',
    args: [1],
  })

  const { data: dnmark } = useContractRead({
    address: CONTROLLER,
    abi: controllerAbi,
    functionName: 'getDenormalizedMark',
    args: [7],
  })

  // const [shortSqueethAddr, setShortSqueethAddr] = useState(0)

  // Get all short vaults
  // const { data: SHORT_SQUEETH } = useContractRead({
  //   address: CONTROLLER,
  //   abi: controllerAbi,
  //   functionName: 'shortPowerPerp',
  // })
//  setShortSqueethAddr(SHORT_SQUEETH)
  // // Get all short vaults
  // const { data: decim_ } = useContractRead({
  //   address: SHORT_SQUEETH,
  //   abi: shortSqueethAbi,
  //   functionName: 'tokenByIndex',
  //   args: [1]
  // })

  const { data: numOfVaults } = useContractRead({
    address: SHORT_SQUEETH,
    abi: shortSqueethAbi,
    functionName: 'balanceOf',
    args: [myAddr],
  })

  const { data: vaultInd} = useContractRead({
    address: SHORT_SQUEETH,
    abi: shortSqueethAbi,
    functionName: 'tokenOfOwnerByIndex',
    args: [myAddr, 1],
    })

    const { data: vaultData} = useContractRead({
      address: CONTROLLER,
      abi: controllerAbi,
      functionName: 'vaults',
      args: [vaultInd],
      })

    const { data: uniNftData} = useContractRead({
      address: UNI_NFT_MANAGER,
      abi: nftPositionManager,
      functionName: 'positions',
      args: [vaultData?.NftCollateralId]
      })


      const { data: swapRouterRead} = useContractRead({
        address: SWAP_ROUTER,
        abi: swapRouterAbi,
        functionName: 'factory',
        })

  // NonfungiblePositionManager: https://goerli.etherscan.io/address/0x24a66308bab3bebc2821480ada395bf1c4ff8bf2#readContract

  // Button to handle buys
  const [buyAmount, setAmount] = useState(0);
  const handleChange = (event) => {
    setAmount(event.target.value);
  };

  // make readble things
  const normFactor = nf/1e18
  const ethPrice = Math.sqrt(ind/1e10);
  const oSqthEthPrice = dnmark*nf/(Math.sqrt(ind)*1e27);
  const dailyFunding = Math.log(dnmark/ind)/(FUNDING_PERIOD);
  const vol = Math.sqrt(Math.log(dnmark/ind)/(FUNDING_PERIOD/365.25))
  const vega = 2*vol*FUNDING_PERIOD/365.25 /100
  const oSqthBalance = squeethBalance?.formatted 
  // Just using one vault (TODO: add multiple vaults and LP)
  const netOsqth = oSqthBalance- (vaultData?.shortAmount || 0)/1e18
  // TODO: add LP weth and eth. Deal with number types
  const netWeth = (wethBalance?.value*1 + (vaultData?.collateralAmount || 0)*1)/1e18

  const slippage = 0.01
  // const amountOfSqueethToBuy = buyAmount/(  vega  * oSqthEthPrice * ethPrice);
  // const amountOfWethToPay = buyAmount/(  vega   * ethPrice) ;

  // test write
  const exactOutputSingleParams = {
    tokenIn: WETH,
    tokenOut: OSQUEETH,
    fee: BigNumber.from(3000).toString(),
    recipient: myAddr,
    deadline: BigNumber.from(Math.floor(Date.now() / 1000 + 86400)).toString(),
    amountOut: (1e18*buyAmount/(oSqthEthPrice*  vega   * ethPrice) ||0).toString(),
    // amountIn: BigNumber.from(1000).toString(),
    amountInMaximum: ((1+slippage)*1e18*buyAmount/( vega   * ethPrice) ||0).toString() ,
    sqrtPriceLimitX96: BigNumber.from(0).toString(),
  }
// console.log(exactInputSingleParams);
  const { config } = usePrepareContractWrite({
    address: SWAP_ROUTER,
    abi: swapRouterAbi,
    functionName: 'exactOutputSingle',
    args: [exactOutputSingleParams],
  });

  const {write: buyVega, isSuccess} = useContractWrite(config)




  // test write: unwrap some weth to eth
  // const { config } = usePrepareContractWrite({
  //   address: WETH,
  //   abi: weth9Abi,
  //   functionName: 'withdraw',
  //   args: [parseInt(1000)],
  // });

  // const {write: testWethWithdraw, isSuccess} = useContractWrite(config)


  return (
    <div className={styles.container}>
      <Head>
        <title>Volutility</title>
        <meta
          name="Volutility"
          content="Generated by two cats"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>
          Welcome to volutility 
        </h1>
        <h2>A utility for your vol!</h2>
        <div>Balance: {squeethBalance?.formatted} {squeethBalance?.symbol}</div>
          <div> CHAIN_ID: {CHAIN_ID}</div>
          <div> normFactor: {normFactor}</div>
          <div> eth price (from controller): {ethPrice}</div>
          <div> osqth price (from controller): {oSqthEthPrice} </div>
          <div> daily funding (from controller): {dailyFunding} </div>
          <div>vol (from controller): {vol} </div>
          <div>vega (from controller): {vega} </div>


          <div>number of vaults: {numOfVaults?.toString()} </div>

          <div>vault index: {vaultInd?.toString()} </div>
          <div>vault collateral: {vaultData?.collateralAmount.toString()} </div>
          <div>vault debt: {vaultData?.shortAmount.toString()} </div>
          <div>vault uni nft: {vaultData?.NftCollateralId.toString()} </div>

          <div>net osqth: {netOsqth.toString()} </div>
          <div>net weth: {netWeth.toString()} </div>
          <div> Long squeeth dollar vega: {vega * oSqthBalance * oSqthEthPrice * ethPrice}</div>
          <div> Net squeeth dollar vega: {vega * netOsqth * oSqthEthPrice * ethPrice}</div>
          <div> Uni nft tickLower: {uniNftData?.tickLower.toString()} </div>
          <div> Uni nft tickUpper: {uniNftData?.tickUpper.toString()} </div>
          <div> Uni nft liquidity: {uniNftData?.liquidity.toString()} </div>
          {/* <div> swap router factory: {swapRouterRead?.toString()} </div> */}
          <br></br>

          <div> Dollar vega to buy:</div>

          <input
            type="text"
            id="buyAmount"
            name="buyAmount"
            onChange={handleChange}
            value={buyAmount}
          />

          <div> <button
                  style ={{ marginTop: 24}}
                  className="button"
                  onClick={() => buyVega?.()}
                >
                  buy some vega
                </button> 
          </div>

          <br></br>

          <div> Amount of osqth to buy: {1e18*buyAmount/(  vega  * oSqthEthPrice * ethPrice)} </div>
          <div> Amount of weth to sell: {(1e18*buyAmount/(  vega   * ethPrice) ||0).toString()} </div>
          <div> Current loaded amountOut : {exactOutputSingleParams.amountOut}</div>


          {/* <ul>
                {people.map(p => (
                    <li> {p} </li>
                ))}
            </ul> */}
          {/* <div>short power perp {shortSqueethAddr.toString()} </div> */}

        {/* <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p> */}
{/* 
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
          Made with 🐱 
      </footer>
    </div>
  );
};

export default Home;
