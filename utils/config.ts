"use client";

import { enqueueSnackbar, VariantType } from "notistack";
import { mainnet } from "wagmi/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

export const projectId = "cba73ada547c01c1a64d7725fb732495";

// 2. Create wagmiConfig
const metadata = {
  name: "Sniper",
  description: "Sniper",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  auth: {
    email: false,
    socials: [],
  },
});

export const showToast = (message: string, variant: VariantType = "error") => {
  enqueueSnackbar(message, { variant });
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear().toString().slice(-2);

  return `${day}/${month}/${year}`;
};

// wallet shorten function
export const walletAddressShorten = (walletAddress: string): string => {
  if (!walletAddress) return "N/A";

  // Remove the "0x" prefix if it exists
  const cleanedAddress = walletAddress.slice(2);

  return cleanedAddress.slice(-7);
};
