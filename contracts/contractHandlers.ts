import {
  type ReadContractReturnType,
  type WriteContractReturnType,
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";

import { CHAINID, Address } from "../types/general.types";
import { config } from "@/utils/config";
import {
  baseUniFactoryAddress,
  baseUniRouterAddress,
  pancakeFactoryAddress,
  pancakeRouterAddress,
  uniswapFactoryAddress,
  uniswapRouterAddress,
} from "./address";
import { BASE_CHAIN_ID, BSC_CHAIN_ID, ETH_CHAIN_ID } from "@/utils/constant";
import { factoryAbi, routerAbi, tokenAbi } from ".";
import { parseUnits } from "viem";

export type Contract_Address_Obj = {
  [BSC_CHAIN_ID]: Address;
  [ETH_CHAIN_ID]: Address;
  [BASE_CHAIN_ID]: Address;
};

export const routerAddress: Contract_Address_Obj = {
  [ETH_CHAIN_ID]: uniswapRouterAddress,
  [BSC_CHAIN_ID]: pancakeRouterAddress,
  [BASE_CHAIN_ID]: baseUniRouterAddress,
};
const factoryAddress: Contract_Address_Obj = {
  [ETH_CHAIN_ID]: uniswapFactoryAddress,
  [BSC_CHAIN_ID]: pancakeFactoryAddress,
  [BASE_CHAIN_ID]: baseUniFactoryAddress,
};

const handleContractRead = async (
  chainId: CHAINID,
  address: Address,
  abi: unknown[],
  functionName: string,
  args?: readonly unknown[]
): Promise<ReadContractReturnType> => {
  return await readContract(config, {
    address,
    abi,
    functionName,
    args: args as readonly unknown[],
    chainId,
  });
};

const handleContractWrite = async (
  chainId: CHAINID,
  address: Address,
  abi: unknown[],
  functionName: string,
  args?: readonly unknown[],
  value?: bigint,
  gasPrice?: bigint,
  confirmations?: number
): Promise<Address> => {
  const hash: WriteContractReturnType = await writeContract(config, {
    address,
    abi,
    functionName,
    args: args as readonly unknown[],
    value,
    chainId,
    gasPrice,
  });
  const receipt = await waitForTransactionReceipt(config, {
    hash,
    chainId,
    confirmations: confirmations ?? 1,
  });
  return receipt.transactionHash;
};

const tokenReadContract = async (
  chainId: CHAINID = ETH_CHAIN_ID,
  address: Address,
  functionName: string,
  args?: Array<unknown>
) => {
  return handleContractRead(chainId, address, tokenAbi, functionName, args);
};

const tokenWriteContract = async (
  chainId: CHAINID = ETH_CHAIN_ID,
  address: Address,
  functionName: string,
  args?: Array<unknown>
) => {
  return handleContractWrite(chainId, address, tokenAbi, functionName, args);
};

const routerReadContract = async (
  chainId: CHAINID = ETH_CHAIN_ID,
  functionName: string,
  args?: Array<unknown>
) => {
  return handleContractRead(
    chainId,
    routerAddress[chainId],
    routerAbi,
    functionName,
    args
  );
};

const routerWriteContract = async (
  chainId: CHAINID = ETH_CHAIN_ID,
  functionName: string,
  args?: Array<any>,
  gasPrice?: number | bigint,
  value?: any
) => {
  return handleContractWrite(
    chainId,
    routerAddress[chainId],
    routerAbi,
    functionName,
    args,
    value,
    parseUnits(String(gasPrice), 9),
    2
  );
};

const factoryReadContract = async (
  chainId: CHAINID = ETH_CHAIN_ID,
  functionName: string,
  args?: Array<unknown>
) => {
  return handleContractRead(
    chainId,
    factoryAddress[chainId],
    factoryAbi,
    functionName,
    args
  );
};

export {
  tokenReadContract,
  tokenWriteContract,
  routerReadContract,
  routerWriteContract,
  factoryReadContract,
};
