/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface OracleInterface extends utils.Interface {
  contractName: "Oracle";
  functions: {
    "getHistoricalTwap(address,address,address,uint32,uint32)": FunctionFragment;
    "getMaxPeriod(address)": FunctionFragment;
    "getTimeWeightedAverageTickSafe(address,uint32)": FunctionFragment;
    "getTwap(address,address,address,uint32,bool)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getHistoricalTwap",
    values: [string, string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getMaxPeriod",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getTimeWeightedAverageTickSafe",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTwap",
    values: [string, string, string, BigNumberish, boolean]
  ): string;

  decodeFunctionResult(
    functionFragment: "getHistoricalTwap",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMaxPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTimeWeightedAverageTickSafe",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getTwap", data: BytesLike): Result;

  events: {};
}

export interface Oracle extends BaseContract {
  contractName: "Oracle";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OracleInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getHistoricalTwap(
      _pool: string,
      _base: string,
      _quote: string,
      _secondsAgoToStartOfTwap: BigNumberish,
      _secondsAgoToEndOfTwap: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getMaxPeriod(_pool: string, overrides?: CallOverrides): Promise<[number]>;

    getTimeWeightedAverageTickSafe(
      _pool: string,
      _period: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number] & { timeWeightedAverageTick: number }>;

    getTwap(
      _pool: string,
      _base: string,
      _quote: string,
      _period: BigNumberish,
      _checkPeriod: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  getHistoricalTwap(
    _pool: string,
    _base: string,
    _quote: string,
    _secondsAgoToStartOfTwap: BigNumberish,
    _secondsAgoToEndOfTwap: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getMaxPeriod(_pool: string, overrides?: CallOverrides): Promise<number>;

  getTimeWeightedAverageTickSafe(
    _pool: string,
    _period: BigNumberish,
    overrides?: CallOverrides
  ): Promise<number>;

  getTwap(
    _pool: string,
    _base: string,
    _quote: string,
    _period: BigNumberish,
    _checkPeriod: boolean,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    getHistoricalTwap(
      _pool: string,
      _base: string,
      _quote: string,
      _secondsAgoToStartOfTwap: BigNumberish,
      _secondsAgoToEndOfTwap: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMaxPeriod(_pool: string, overrides?: CallOverrides): Promise<number>;

    getTimeWeightedAverageTickSafe(
      _pool: string,
      _period: BigNumberish,
      overrides?: CallOverrides
    ): Promise<number>;

    getTwap(
      _pool: string,
      _base: string,
      _quote: string,
      _period: BigNumberish,
      _checkPeriod: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    getHistoricalTwap(
      _pool: string,
      _base: string,
      _quote: string,
      _secondsAgoToStartOfTwap: BigNumberish,
      _secondsAgoToEndOfTwap: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMaxPeriod(_pool: string, overrides?: CallOverrides): Promise<BigNumber>;

    getTimeWeightedAverageTickSafe(
      _pool: string,
      _period: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTwap(
      _pool: string,
      _base: string,
      _quote: string,
      _period: BigNumberish,
      _checkPeriod: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getHistoricalTwap(
      _pool: string,
      _base: string,
      _quote: string,
      _secondsAgoToStartOfTwap: BigNumberish,
      _secondsAgoToEndOfTwap: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getMaxPeriod(
      _pool: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTimeWeightedAverageTickSafe(
      _pool: string,
      _period: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTwap(
      _pool: string,
      _base: string,
      _quote: string,
      _period: BigNumberish,
      _checkPeriod: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
