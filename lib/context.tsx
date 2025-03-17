"use client";

import { useCallback, useEffect, useState } from "react";
import { type UseAccountReturnType, useAccount } from "wagmi";
import axios from "axios";
import { signMessage, switchChain, disconnect } from "@wagmi/core";

import {
  initialState,
  AppContext,
  serverUrl,
  ETH_CHAIN_ID,
} from "@/utils/constant";
// import { AuthProviderProps, IAuthContext } from "../types/auth.types";
// import { CHAINID } from "../types/general.types";
import { config } from "@/utils/config";
import { CHAINID } from "@/types/general.types";
import { AuthProviderProps, IAuthContext } from "@/types/auth.types";

export const ConectivityProvider = ({ children }: AuthProviderProps) => {
  const {
    address,
    chainId,
    connector,
    isDisconnected,
    addresses,
  }: UseAccountReturnType = useAccount();

  const [state, setState] = useState<IAuthContext>(initialState);

  const getUser = useCallback(async () => {
    try {
      if (!address) return;
      const token = localStorage.getItem("token");

      const response = await axios.get(`${serverUrl}/user/get-user`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });

      if (response?.status !== 200) throw new Error("User Not Found");

      setState((prev) => ({
        ...prev,
        account: address ?? null,
        chainId: (chainId as CHAINID) ?? null,
        user: {
          id: response?.data?.user?._id,
          name: response?.data?.user?.userName,
          description: response?.data?.user?.description,
          logoUri: response?.data?.user?.logoUri,
        },
      }));
    } catch (e) {
      console.log(e);
    }
  }, [address, chainId]);

  useEffect(() => {
    const walletToken = localStorage.getItem("isWalletConnected");
    const signedToken = localStorage.getItem("token");
    if (!address || !walletToken) {
      // localStorage.clear();
      // disconnect({ connector });
      // setState(initialState);
      // return localStorage.setItem("isWalletConnected", "false");
    }

    console.log(address, "address");

    (async () => {
      try {
        if (chainId && Number(chainId) !== ETH_CHAIN_ID) {
          await switchChain(config, { chainId: ETH_CHAIN_ID });
        }
        if (!signedToken || !walletToken || walletToken === "false") {
          const { data } = await axios.get(
            `${serverUrl}/user/get-nonce/${address}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const token = await signMessage(config, { message: data.nonce });

          const response = await axios.post(
            `${serverUrl}/user/login`,
            { signature: token, address },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status !== 201) throw new Error("User Not Found");

          localStorage.setItem("token", `Bearer ${response?.data?.token}`);
          localStorage.setItem("isWalletConnected", "true");

          setState((prev) => ({
            ...prev,
            user: {
              id: response?.data?.user?._id,
              name: response?.data?.user?.userName,
              description: response?.data?.user?.description,
              logoUri: response?.data?.user?.logoUri,
            },
          }));
        } else {
          getUser();
        }

        setState((prev) => ({
          ...prev,
          account: address ?? null,
          chainId: (chainId as CHAINID) ?? null,
        }));
      } catch (e) {
        // localStorage.clear();
        localStorage.removeItem("token");
        localStorage.removeItem("isWalletConnected");

        console.log(e);
        await disconnect(config, { connector });
      }
    })();
  }, [address, chainId, connector, getUser]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isDisconnected && token) {
      // localStorage.clear();
      localStorage.removeItem("token");
      localStorage.removeItem("isWalletConnected");
      setState(initialState);
    }
  }, [isDisconnected, address]);

  useEffect(() => {
    if (!addresses || !state.account)
      return console.log("Wallet not installed!");

    const disconnectWallet = async () => {
      setState(initialState);
      await disconnect(config, { connector });
      localStorage.clear();
      window.location.reload();
    };
    console.log(addresses[0].toLowerCase() !== state.account?.toLowerCase());
    if (addresses[0].toLowerCase() !== state.account?.toLowerCase()) {
      disconnectWallet();
    }
  }, [addresses, connector, state.account]);

  return (
    <AppContext.Provider
      value={{
        account: state.account,
        chainId: state.chainId,
        user: state.user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
