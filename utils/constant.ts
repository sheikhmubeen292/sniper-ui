"use client";

import { IAuthContext } from "@/types/auth.types";
import { createContext, useContext } from "react";
// import { io } from "socket.io-client";

// import { IAuthContext } from "../types/auth.types";

const initialState = {
  account: null,
  chainId: null,
  user: null,
};

const AppContext = createContext<IAuthContext>(initialState);

const useAuth = () => {
  return useContext(AppContext);
};

// const serverUrl = "https://urchin-app-jfcdz.ondigitalocean.app";
const serverUrl =
  process.env.NODE_ENV === "production"
    ? "https://whale-app-z3vag.ondigitalocean.app"
    : "http://localhost:5002";
// const serverUrl = "https://clownfish-app-j6rix.ondigitalocean.app";

// const socket = io(serverUrl);

const ETH_CHAIN_ID = 1;
const BSC_CHAIN_ID = 56;
// const ETH_CHAIN_ID = 11155111;
// const BSC_CHAIN_ID = 97;
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
// const WETH = "0x7b79995e5f793a07bc00c21412e50ecae098e7f9"; // testnet

// const WBNB = "0xae13d989dac2f0debff460ac112a837c89baa7cd"; // testnet
// const bscUsdtToken = "0x106d4374ee2465eb0b5fd18c6f5bbee323ff015e";
// const bscUsdcToken = "0xb8aaa4a7261a2cbd49692f80ea3d39fc2dd3c51d";
const WBNB = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"; // mainnet

export {
  initialState,
  AppContext,
  useAuth,
  ETH_CHAIN_ID,
  NULL_ADDRESS,
  WETH,
  serverUrl,
  BSC_CHAIN_ID,
  WBNB,
  // socket,
};
