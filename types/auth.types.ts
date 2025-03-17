import { BSC_CHAIN_ID, ETH_CHAIN_ID } from "@/utils/constant";
import { Address } from "./general.types";

interface IAuthContext {
  account: null | Address;
  chainId: null | typeof ETH_CHAIN_ID | typeof BSC_CHAIN_ID;
  user: null | {
    id: string;
    name: string;
    description: string;
    logoUri: string;
  };
}

type AuthProviderProps = {
  children: React.ReactNode;
};

export type { AuthProviderProps, IAuthContext };
