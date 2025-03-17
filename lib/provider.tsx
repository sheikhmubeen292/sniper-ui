"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { config, projectId } from "@/utils/config";
import { WagmiProvider } from "wagmi";
import { ConectivityProvider } from "@/lib/context";
import { SnackbarProvider } from "notistack";

const queryClient = new QueryClient();

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  allowUnsupportedChain: true,
  enableOnramp: false,
  enableSwaps: false,
  excludeWalletIds: [
    "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
  ],
  themeVariables: {
    "--w3m-z-index": 100000,
  },
});

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConectivityProvider>
          <SnackbarProvider
            autoHideDuration={2000}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            {children}
          </SnackbarProvider>
        </ConectivityProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
