import { BSC_CHAIN_ID, ETH_CHAIN_ID, BASE_CHAIN_ID } from "@/utils/constant";

export type Address = `0x${string}`;
export type CHAINID =
  | typeof ETH_CHAIN_ID
  | typeof BSC_CHAIN_ID
  | typeof BASE_CHAIN_ID;
