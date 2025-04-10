"use client";

import { useState, useEffect, ChangeEvent, useCallback, useMemo } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { getBalance, GetBalanceReturnType } from "@wagmi/core";
import {
  formatEther,
  formatUnits,
  isAddress,
  parseEther,
  parseUnits,
} from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Wallet,
  Settings,
  BarChart3,
  Clock,
  Zap,
  Check,
  X,
  RefreshCw,
  Target,
  DollarSign,
  ArrowLeft,
  AlertTriangle,
  Eye,
  Sun,
  Plus,
  Key,
  Info,
  Shield,
  Rocket,
  Menu,
} from "lucide-react";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  BASE_CHAIN_ID,
  BSC_CHAIN_ID,
  Eth_Address,
  ETH_CHAIN_ID,
  NULL_ADDRESS,
  useAuth,
} from "./utils/constant";
import {
  activeSelectedWallet,
  createSniper,
  createSniperSettings,
  generateWallet,
  getActiveSnipers,
  getAllWallets,
  getInActiveSnipers,
  getSniperSettings,
  getTokenInfo,
  savePrivateKey,
} from "./utils/apiHandler";
import { config, showToast } from "./utils/config";
import { Address } from "./types/general.types";
import { getExactDecimals } from "./utils/decimal";
import {
  factoryReadContract,
  routerAddress,
  routerReadContract,
  routerWriteContract,
  tokenReadContract,
  tokenWriteContract,
} from "./contracts";
import {
  HistoryData,
  TokenInfo,
  Wallet as WalletType,
} from "./types/trade.types";
import { BackgroundParticles } from "./components/floating-particles";
import { AddPrivateKeyDialog } from "./components/add-pk-dialog";
import { GenerateWalletDialog } from "./components/generate-pk-dialog";
import { SafetyFeatures } from "./components/safety-features";
import { MonitoringSection } from "./components/monitoring-section";

// Replace the existing renderMiniChart function with this enhanced animated version
// const renderMiniChart = (data) => {
//   const max = Math.max(...data);
//   const min = Math.min(...data);
//   const range = max - min;

//   return (
//     <div className="h-12 flex items-end space-x-[2px]">
//       {data.map((value, index) => {
//         const height = ((value - min) / range) * 100;
//         const isPositive = index > 0 ? value >= data[index - 1] : true;
//         return (
//           <motion.div
//             key={index}
//             className={`w-[3px] ${
//               isPositive ? "bg-pink-500" : "bg-pink-700"
//             } dark:${isPositive ? "bg-pink-400" : "bg-pink-600"} rounded-t-sm`}
//             initial={{ height: 0 }}
//             animate={{ height: `${height}%` }}
//             transition={{ duration: 0.5, delay: index * 0.02 }}
//           />
//         );
//       })}
//     </div>
//   );
// };

const chains = [
  { id: "ethereum", name: "Ethereum", icon: DollarSign, color: "pink" },
  { id: "base", name: "Base", icon: BarChart3, color: "blue" },
  { id: "bsc", name: "BSC", icon: Zap, color: "yellow" },
  // { id: "tron", name: "Tron", icon: Zap, color: "red" },
  // { id: "solana", name: "Solana", icon: Sun, color: "purple" },
];

export type Chain_Type = {
  bsc: typeof BSC_CHAIN_ID;
  ethereum: typeof ETH_CHAIN_ID;
  base: typeof BASE_CHAIN_ID;
};

const currentChainId: Chain_Type = {
  bsc: 56,
  base: 8453,
  ethereum: 1,
};

////////////////////////////////////////////

export default function TokenSniper() {
  const { account, user } = useAuth();
  const { open } = useWeb3Modal();

  // const balance: GetBalanceReturnType = await getBalance(config, {
  //   address: data?.user?.walletAddress as Address,
  //   chainId: BSC_CHAIN_ID,
  //   token: coin.tokenAddress as Address,
  //   unit: "ether",
  // });

  // const [connected, setConnected] = useState(false);
  // const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [tradeSectionBalance, setTradeSectionBalance] = useState(0);
  const [targetTokenAddress, setTargetTokenAddress] = useState("");
  const [amount, setAmount] = useState("0.1");
  const [gasPrice, setGasPrice] = useState(30);
  const [slippage, setSlippage] = useState(15);
  // const [monitoring, setMonitoring] = useState(false);
  const [selectedChain, setSelectedChain] = useState({
    id: "ethereum",
    name: "Ethereum",
    icon: DollarSign,
  });
  const [addWalletPrivateKey, setAddWalletPrivateKey] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [generatedPrivateKey, setGeneratedPrivateKey] = useState("");
  const [userWallets, setUserWallets] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [monitorTableData, setMonitorTableData] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [showTokenInfo, setShowTokenInfo] = useState(false);
  const [isTradeModal, setIsTradeModal] = useState(false);
  const [isBuy, setIsBuy] = useState(true);
  const [tradeAmount, setTradeAmount] = useState("");
  const [tradeGasPrice, setTradeGasPrice] = useState(35);
  const [tradeSlippage, setTradeSlippage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    autoSell: false,
    stopLoss: 50,
    profitLevels: [
      { level: 1, enabled: false, profitTarget: 100, sellPercentage: 10 },
      { level: 2, enabled: false, profitTarget: 200, sellPercentage: 10 },
      { level: 3, enabled: false, profitTarget: 300, sellPercentage: 10 },
      { level: 4, enabled: false, profitTarget: 300, sellPercentage: 10 },
    ],
    safetyFeatures: {
      antiRugPull: false,
      frontRunningProtection: false,
      multiWalletSniping: false,
    },
  });
  const [trade, setTrade] = useState({
    amountIn: "",
    amountOut: "",
    isPairExist: false,
  });

  // const [progress, setProgress] = useState(0);
  // const [chartData, setChartData] = useState([]);

  // const [autoBuyOnLiq, setAutoBuyOnLiq] = useState(true);
  // const [maxBuyDelay, setMaxBuyDelay] = useState(3);
  // const [buyGasMultiplier, setBuyGasMultiplier] = useState(1.5);
  // const [buyAmount, setBuyAmount] = useState(100);
  // const [buyAmountType, setBuyAmountType] = useState("percent"); // "percent" or "fixed"
  // const [showPrivateKey, setShowPrivateKey] = useState(false);

  const selectedChainId = useMemo(() => {
    const selectedChainId =
      selectedChain.id === "bsc" ? 56 : selectedChain.id === "base" ? 8453 : 1;
    return selectedChainId;
  }, [selectedChain.id]);

  const getAmountsOutput = useCallback(
    async (amount: string) => {
      try {
        const getAmountsOut: any = await routerReadContract(
          selectedChainId,
          "getAmountsOut",
          [
            parseUnits(
              amount === "" ? "1" : amount.toString(),
              isBuy ? 18 : Number(tokenInfo?.decimals) || 18
            ),
            isBuy
              ? [Eth_Address[selectedChainId], targetTokenAddress]
              : [targetTokenAddress, Eth_Address[selectedChainId]],
          ]
        );

        return Number(
          formatUnits(
            getAmountsOut[1].toString(),
            isBuy ? Number(tokenInfo?.decimals) || 18 : 18
          )
        );
      } catch (e) {
        console.log(e);
      }
    },
    [tokenInfo?.decimals, targetTokenAddress, isBuy]
  );

  const handleAmountIn = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!tokenInfo?.decimals) return showToast("Enter Token Address first");

      if (e.target.value.match(/^[0-9]*[.]?[0-9]*$/)) {
        setTrade((prev) => ({ ...prev, amountIn: e.target.value }));

        if (Number(e.target.value) > 0) {
          const returnValue = await getAmountsOutput(e.target.value);
          setTrade((prev) => ({ ...prev, amountOut: String(returnValue) }));
        } else if (Number(e.target.value) <= 0) {
          setTrade((prev) => ({ ...prev, amountOut: "" }));
        }
      }
    },
    [getAmountsOutput]
  );

  // Trade function here
  const handleBuy = useCallback(async () => {
    try {
      if (!account) return showToast("Connect Wallet");
      if (tradeSectionBalance <= 0) return showToast("Balance is less than 0");
      if (!tokenInfo?.symbol) return showToast("Refetch Token");
      if (tradeSectionBalance < Number(trade.amountIn))
        return showToast("Insufficent Balance");

      setIsLoading(true);

      const amountOut =
        Number(trade.amountOut) - Number(trade.amountOut) * (slippage / 100);

      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

      const tx = await routerWriteContract(
        selectedChainId,
        "swapExactETHForTokensSupportingFeeOnTransferTokens",
        [
          parseUnits(amountOut.toString(), Number(tokenInfo?.decimals)),
          [Eth_Address[selectedChainId], targetTokenAddress],
          account,
          deadline,
        ],
        gasPrice,
        parseEther(trade.amountIn.toString())
      );

      console.log(tx, "tx");

      showToast("Buy Successful", "success");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const balance = await maxTradeBalance();
      setTradeSectionBalance(Number(balance));

      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      console.log(e);
      showToast(e.shortMessage);
    }
  }, [
    account,
    selectedChainId,
    trade.amountIn,
    trade.amountOut,
    tradeSectionBalance,
    tokenInfo?.symbol,
    tokenInfo?.decimals,
    targetTokenAddress,
  ]);

  const handleSell = useCallback(async () => {
    try {
      if (!account) return showToast("Connect Wallet");
      if (tradeSectionBalance <= 0) return showToast("Balance is less than 0");
      if (!tokenInfo?.symbol) return showToast("Refetch Token");

      if (tradeSectionBalance < Number(trade.amountIn))
        return showToast("Insufficent Balance");

      setIsLoading(true);

      const amountOut =
        Number(trade.amountOut) - Number(trade.amountOut) * (slippage / 100);

      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

      const allowance = await tokenReadContract(
        selectedChainId,
        targetTokenAddress as Address,
        "allowance",
        [account, routerAddress[selectedChainId]]
      );

      if (
        Number(formatUnits(allowance as bigint, Number(tokenInfo?.decimals))) <
        Number(trade.amountIn)
      ) {
        await tokenWriteContract(
          selectedChainId,
          targetTokenAddress as Address,
          "approve",
          [
            routerAddress[selectedChainId],
            "99999999999999999999999999999999999999",
          ]
        );
      }

      const tx = await routerWriteContract(
        selectedChainId,
        "swapExactTokensForETHSupportingFeeOnTransferTokens",
        [
          parseUnits(trade.amountIn.toString(), Number(tokenInfo?.decimals)),
          parseEther(amountOut.toString()),
          [targetTokenAddress, Eth_Address[selectedChainId]],
          account,
          deadline,
        ],
        gasPrice
      );

      console.log(tx, "tx");

      showToast("Buy Successful", "success");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const balance = await maxTradeBalance();
      setTradeSectionBalance(Number(balance));

      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      console.log(e);
      showToast(e.shortMessage);
    }
  }, [
    account,
    selectedChainId,
    trade.amountIn,
    trade.amountOut,
    tradeSectionBalance,
    tokenInfo?.symbol,
    tokenInfo?.decimals,
    targetTokenAddress,
  ]);
  //////////////////////////////////////////

  // Simulate progress for monitoring
  // useEffect(() => {
  //   if (monitoring) {
  //     const interval = setInterval(() => {
  //       setProgress((prev) => {
  //         const newProgress = prev + 1;
  //         if (newProgress >= 100) {
  //           clearInterval(interval);
  //           return 100;
  //         }
  //         return newProgress;
  //       });
  //     }, 300);
  //     return () => clearInterval(interval);
  //   } else {
  //     setProgress(0);
  //   }
  // }, [monitoring]);

  // // Generate fake chart data
  // useEffect(() => {
  //   const generateChartData = () => {
  //     const data = [];
  //     let value = 100;
  //     for (let i = 0; i < 20; i++) {
  //       value = value + (Math.random() * 10 - 5);
  //       data.push(value);
  //     }
  //     return data;
  //   };

  //   setChartData(generateChartData());

  //   const interval = setInterval(() => {
  //     setChartData(generateChartData());
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  // get all wallets api function
  const fetchUserWallets = async () => {
    const { data } = await getAllWallets();
    const { data: monitorData } = await getActiveSnipers();
    const { data: settingsData } = await getSniperSettings();

    if (data) {
      setUserWallets(data);
      const activeWallet =
        data.find((wallet: WalletType) => wallet.isActive) || null;
      setSelectedWallet(activeWallet);
    }
    if (monitorData) {
      setMonitorTableData(monitorData);
    }
    if (settingsData) {
      setSettings({
        autoSell: settingsData.autoSell,
        stopLoss: settingsData.stopLoss,
        profitLevels: settingsData.profitLevels.map((lvl: any) => ({
          level: lvl.level,
          enabled: lvl.enabled,
          profitTarget: lvl.profitTarget,
          sellPercentage: lvl.sellPercentage,
        })),
        safetyFeatures: settingsData.safetyFeatures,
      });
    }
  };

  useEffect(() => {
    fetchUserWallets();
  }, [account]);

  // const handleConnect = () => {
  //   // In a real app, this would validate the private key format
  //   if (addWalletPrivateKey.length >= 64) {
  //     setConnected(true);
  //     if (address.trim().length > 10) {
  //       // fetchTokenInfo();
  //     }
  //   } else {
  //     showToast("Please enter a valid private key", "error");
  //   }
  // };

  // const handleStartMonitoring = () => {
  //   if (address.trim() !== "") {
  //     setMonitoring(true);
  //     // fetchTokenInfo();
  //   }
  // };

  // const handleStopMonitoring = () => {
  //   setMonitoring(false);
  // };

  const handleMonitoring = async () => {
    const selectedChainId =
      selectedChain.id === "bsc" ? 56 : selectedChain.id === "base" ? 8453 : 1;
    const body = {
      tokenAddress: targetTokenAddress,
      buyAmount: amount,
      gasFee: gasPrice,
      slippage: slippage,
      selectedChainId,
    };
    setIsLoading(true);
    const { message, success } = await createSniper(body);

    if (success) {
      showToast(message, "success");
      setTokenInfo(null);
      setTargetTokenAddress("");
      setIsLoading(false);
    } else {
      showToast(message, "error");
      setIsLoading(false);
    }
  };

  const fetchTokenInfo = async (tokenAddress: string) => {
    const selectedChainId =
      selectedChain.id === "bsc" ? 56 : selectedChain.id === "base" ? 8453 : 1;
    if (isAddress(tokenAddress)) {
      const { data } = await getTokenInfo(tokenAddress, selectedChainId);

      console.log(data, "token response data");

      if (data) {
        setTokenInfo(data);
        setShowTokenInfo(true);
      }
    } else {
      console.error("Invalid token address");
      setShowTokenInfo(false);
    }
  };

  const handleTokenInfo = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const tokenAddress = e.target.value.trim();

      setTargetTokenAddress(tokenAddress);

      await fetchTokenInfo(tokenAddress);
    } catch (e) {
      console.log(e);
    }
  };

  // Api call of setting section
  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  type ProfitLevelKey = "enabled" | "profitTarget" | "sellPercentage";

  const updateProfitLevel = (
    index: number,
    key: ProfitLevelKey,
    value: boolean | number
  ) => {
    setSettings((prev) => {
      const updatedLevels = [...prev.profitLevels];
      updatedLevels[index] = { ...updatedLevels[index], [key]: value };
      return { ...prev, profitLevels: updatedLevels };
    });
  };

  const handleSettingChanges = async () => {
    setIsLoading(true);
    const { data } = await createSniperSettings(settings);

    if (data) {
      setSettings({
        autoSell: data.autoSell,
        stopLoss: data.stopLoss,
        profitLevels: data.profitLevels.map((lvl: any) => ({
          level: lvl.level,
          enabled: lvl.enabled,
          profitTarget: lvl.profitTarget,
          sellPercentage: lvl.sellPercentage,
        })),
        safetyFeatures: data.safetyFeatures,
      });
      showToast("Settings are saved. Successfully!", "success");
      setIsLoading(false);
    }
  };

  ///////////////////////////////////////

  // Api call of add a private key of wallet
  const handleAddPrivateKey = async () => {
    const selectedChainId =
      selectedChain.id === "bsc" ? 56 : selectedChain.id === "base" ? 8453 : 1;
    setIsLoading(true);
    const { message } = await savePrivateKey({
      privateKey: addWalletPrivateKey,
      selectedChainId,
    });

    setAddWalletPrivateKey("");
    showToast(message, "success");
    fetchUserWallets();
    setIsLoading(false);
  };
  ///////////////////////////////////////

  // Api call of get history table
  const handleHistoryData = async () => {
    const { data } = await getInActiveSnipers();

    setHistoryData(data);
  };
  ///////////////////////////////////////

  // Api call of active the selected wallet
  const handleSelectWallet = async (wallet: WalletType) => {
    const { success } = await activeSelectedWallet({
      walletId: wallet._id,
    });

    if (success) {
      setSelectedWallet(wallet);
    } else {
      setSelectedWallet(null);
    }
  };
  ///////////////////////////////////////

  // Api call of generate the new wallet
  const handleCreateWallet = async () => {
    setIsLoading(true);
    const { data } = await generateWallet();

    setNewWalletAddress(data?.publicKey);
    setGeneratedPrivateKey(data?.privateKey);
    fetchUserWallets();
    setIsLoading(false);
  };
  ///////////////////////////////////////

  // private key and wallet address shorten address functions
  const shortenAddress = (address: string) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  };

  const shortenPrivateAddress = (address: string) => {
    return address ? `${address.slice(0, 15)}...${address.slice(-4)}` : "";
  };
  ////////////////////////////////////////////////////////

  // copy to clipbpard address
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("Copied to clipboard!", "success");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  ////////////////////////////

  // function for format the time
  function formatTimestamp(isoString: string): string {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }
  ////////////////////////////

  const maxBalance = useCallback(async () => {
    const selectedChainId =
      selectedChain.id === "bsc" ? 56 : selectedChain.id === "base" ? 8453 : 1;
    const balance: GetBalanceReturnType = await getBalance(config, {
      address: selectedWallet?.publicKey as Address,
      chainId: selectedChainId,
      unit: "ether",
    });

    setBalance(Number(formatEther(balance.value)));

    return Number(formatEther(balance.value));
  }, [selectedWallet?.publicKey]);

  const maxTradeBalance = useCallback(async () => {
    if (!account) return;
    const selectedChainId =
      selectedChain.id === "bsc" ? 56 : selectedChain.id === "base" ? 8453 : 1;

    if (isBuy) {
      const balance: GetBalanceReturnType = await getBalance(config, {
        address: account as Address,
        chainId: selectedChainId,
        unit: "ether",
      });

      setTradeSectionBalance(Number(formatEther(balance.value)));

      return Number(formatEther(balance.value));
    } else {
      const balance: GetBalanceReturnType = await getBalance(config, {
        address: account as Address,
        chainId: selectedChainId,
        unit: "ether",
        token: targetTokenAddress as Address,
      });

      setTradeSectionBalance(
        Number(formatUnits(balance.value, tokenInfo?.decimals || 18))
      );
      return Number(formatUnits(balance.value, tokenInfo?.decimals || 18));
    }
  }, [account, isBuy, targetTokenAddress]);

  useEffect(() => {
    maxTradeBalance();
  }, [maxTradeBalance]);

  useEffect(() => {
    maxBalance();
  }, [maxBalance]);

  useEffect(() => {
    if (!isAddress(targetTokenAddress)) return;

    (async () => {
      const pair = await factoryReadContract(selectedChainId, "getPair", [
        Eth_Address[selectedChainId],
        targetTokenAddress,
      ]);

      if ((pair as Address).toLowerCase() === NULL_ADDRESS) {
        setTrade({ amountIn: "", amountOut: "", isPairExist: false });
      } else {
        setTrade({ amountIn: "", amountOut: "", isPairExist: true });
      }
    })();
  }, [targetTokenAddress, selectedChainId]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-zinc-950 dark:to-black text-zinc-900 dark:text-white p-4 md:p-6 overflow-hidden relative transition-colors duration-300">
        {/* Background decorative elements */}
        {isLoading && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000000a6] backdrop-blur-sm">
            <div className="loader"></div>
          </div>
        )}
        <>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
            <motion.div
              className="absolute top-[10%] left-[5%] w-64 h-64 bg-pink-400 dark:bg-pink-600 rounded-full filter blur-[120px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-pink-500 dark:bg-pink-700 rounded-full filter blur-[150px]"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.25, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </div>
          <BackgroundParticles />
        </>

        <div className="relative z-10">
          <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-pink-500 to-pink-300 dark:from-pink-600 dark:to-pink-400 p-2 rounded-lg shadow-lg shadow-pink-900/20">
                <Target className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300 dark:from-pink-400 dark:to-pink-600">
                  Sniper
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Professional Token Sniper
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all duration-200 shadow-md shadow-pink-900/10"
                  >
                    <div className="w-3 h-3 rounded-full bg-pink-500 mr-1"></div>
                    <selectedChain.icon className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                    <span>{selectedChain.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white/90 dark:bg-black/90 backdrop-blur-md border-zinc-200 dark:border-zinc-800 shadow-xl shadow-pink-900/20">
                  {chains.map((chain) => (
                    <DropdownMenuItem
                      key={chain.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-zinc-900/50 transition-colors duration-200"
                      onClick={() => setSelectedChain(chain)}
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-${chain.color}-500`}
                      ></div>
                      <chain.icon className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                      <span>{chain.name}</span>
                      {selectedChain.id === chain.id && (
                        <Check className="h-4 w-4 ml-auto text-pink-500" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* ===== MOBILE MENU BUTTON ===== */}
              <div className="md:hidden ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-black/50"
                    >
                      <Menu className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/90 dark:bg-black/90 backdrop-blur-md border-zinc-200 dark:border-zinc-800">
                    <DropdownMenuItem>
                      <Button
                        onClick={() => {
                          open();
                        }}
                        variant="default"
                        className="w-full bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 hover:from-pink-400 hover:to-pink-300 dark:hover:from-pink-500 dark:hover:to-pink-400 text-white shadow-lg shadow-pink-900/20 transition-all duration-200"
                      >
                        {account
                          ? `${account.slice(0, 4)}...${account.slice(-4)}`
                          : "Connect Wallet"}
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <AddPrivateKeyDialog
                        trigger={
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            variant="outline"
                            className="w-full border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all duration-200 shadow-md shadow-pink-900/10"
                          >
                            <Key className="mr-2 h-4 w-4 text-pink-500 dark:text-pink-400" />
                            Add Private Key
                          </Button>
                        }
                        addWalletPrivateKey={addWalletPrivateKey}
                        setAddWalletPrivateKey={setAddWalletPrivateKey}
                        handleAddPrivateKey={handleAddPrivateKey}
                        selectedChain={selectedChain}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <GenerateWalletDialog
                        trigger={
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            variant="default"
                            className="w-full bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 hover:from-pink-400 hover:to-pink-300 dark:hover:from-pink-500 dark:hover:to-pink-400 text-white shadow-lg shadow-pink-900/20 transition-all duration-200"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Generate New Key
                          </Button>
                        }
                        newWalletAddress={newWalletAddress}
                        generatedPrivateKey={generatedPrivateKey}
                        shortenAddress={shortenAddress}
                        shortenPrivateAddress={shortenPrivateAddress}
                        handleCreateWallet={handleCreateWallet}
                        selectedChain={selectedChain}
                        copyToClipboard={copyToClipboard}
                        setNewWalletAddress={setNewWalletAddress}
                        setGeneratedPrivateKey={setGeneratedPrivateKey}
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="hidden md:flex gap-2">
                {/* ===>> store the private key dialog */}
                <AddPrivateKeyDialog
                  trigger={
                    <Button
                      variant="outline"
                      className="border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all duration-200 shadow-md shadow-pink-900/10"
                    >
                      <Key className="mr-2 h-4 w-4 text-pink-500 dark:text-pink-400" />
                      Add Private Key
                    </Button>
                  }
                  addWalletPrivateKey={addWalletPrivateKey}
                  setAddWalletPrivateKey={setAddWalletPrivateKey}
                  handleAddPrivateKey={handleAddPrivateKey}
                  selectedChain={selectedChain}
                />
                {/* ===>> end of store private key dialog */}

                {/* ===>> generate new wallet modal */}
                <GenerateWalletDialog
                  trigger={
                    <Button
                      variant="default"
                      className="bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 hover:from-pink-400 hover:to-pink-300 dark:hover:from-pink-500 dark:hover:to-pink-400 text-white shadow-lg shadow-pink-900/20 transition-all duration-200"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Generate New Key
                    </Button>
                  }
                  newWalletAddress={newWalletAddress}
                  generatedPrivateKey={generatedPrivateKey}
                  shortenAddress={shortenAddress}
                  shortenPrivateAddress={shortenPrivateAddress}
                  handleCreateWallet={handleCreateWallet}
                  selectedChain={selectedChain}
                  copyToClipboard={copyToClipboard}
                  setNewWalletAddress={setNewWalletAddress}
                  setGeneratedPrivateKey={setGeneratedPrivateKey}
                />
                {/* ===>> end of generate new wallet modal */}

                <Button
                  onClick={() => {
                    console.log("function chla");
                    open();
                  }}
                  variant="default"
                  className="bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 hover:from-pink-400 hover:to-pink-300 dark:hover:from-pink-500 dark:hover:to-pink-400 text-white shadow-lg shadow-pink-900/20 transition-all duration-200"
                >
                  {account
                    ? `${account.slice(0, 4)}...${account.slice(-4)}`
                    : "Connect Wallet"}
                </Button>
              </div>
            </div>
          </header>

          {/* ==>> List of User's Wallets and select functionality  */}
          {userWallets && (
            <div className="p-4 space-y-4">
              <div className="flex space-x-4 overflow-x-auto p-2">
                {userWallets.map((wallet: WalletType, indexx) => (
                  <Card
                    key={wallet?._id}
                    className="pt-6 min-w-[150px] cursor-pointer border-2"
                    style={{
                      borderColor:
                        selectedWallet?._id === wallet?._id
                          ? "#db2777"
                          : "rgb(39 39 42 / var(--tw-border-opacity, 1))",
                    }}
                    onClick={() => handleSelectWallet(wallet)}
                  >
                    <CardContent>
                      <p className="font-bold">Wallet {indexx + 1}</p>
                      <p className="text-md text-gray-500">
                        {shortenAddress(wallet?.publicKey)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedWallet && (
                <motion.div
                  className="mb-6 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-black p-4 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <motion.div
                      className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full self-start sm:self-auto"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(236, 72, 153, 0)",
                          "0 0 0 10px rgba(236, 72, 153, 0.2)",
                          "0 0 0 0 rgba(236, 72, 153, 0)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <Wallet className="h-5 w-5 text-pink-500" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-medium text-zinc-900 dark:text-white">
                        Wallet Connected
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Using wallet {shortenAddress(selectedWallet?.publicKey)}{" "}
                        on {selectedChain.name}
                      </p>
                    </div>
                    <div className="sm:self-auto self-start">
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-none">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        >
                          <Check className="h-3 w-3 mr-1" />
                        </motion.div>
                        Ready
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          {/* //////////////////// END /////////////////////////// */}

          {isTradeModal ? (
            <div className="flex justify-center items-center p-4">
              {/* ==>> Trade token section (Buy and Sell)  */}
              <Card className="w-full max-w-lg bg-white/60 dark:bg-black/60 backdrop-blur-sm border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-pink-900/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Target className="h-5 w-5 text-pink-500" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300 dark:from-pink-400 dark:to-pink-600">
                          Snipe Trade
                        </span>
                      </CardTitle>
                      <CardDescription>
                        Set the token you want to Buy or Sell
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setIsTradeModal(false)}
                      variant="outline"
                      className="w-100 border-pink-400/50 dark:border-pink-500/50 bg-white/50 dark:bg-black/50 backdrop-blur-sm text-pink-500 dark:text-pink-400 hover:bg-pink-50/30 dark:hover:bg-pink-950/30 hover:text-pink-600 dark:hover:text-pink-300 transition-all duration-200"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <Tabs defaultValue="Buy">
                    <TabsList className="bg-gray-100/70 w-full dark:bg-zinc-900/70 p-1 sm:self-auto">
                      <TabsTrigger
                        value="Buy"
                        className="data-[state=active]:bg-pink-500 w-full py-3 data-[state=active]:text-white transition-all duration-200"
                        onClick={() => {
                          setIsBuy(true);
                          setTrade((prev) => ({
                            ...prev,
                            amountIn: "",
                            amountOut: "",
                          }));
                        }}
                      >
                        BUY
                      </TabsTrigger>
                      <TabsTrigger
                        value="Sell"
                        className="data-[state=active]:bg-pink-500 w-full py-3 data-[state=active]:text-white transition-all duration-200"
                        onClick={() => {
                          setIsBuy(false);
                          setTrade((prev) => ({
                            ...prev,
                            amountIn: "",
                            amountOut: "",
                          }));
                        }}
                      >
                        SELL
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="space-y-2">
                    <Label
                      htmlFor="trade-token-address"
                      className="text-zinc-700 dark:text-zinc-300"
                    >
                      Token Address
                    </Label>

                    <Input
                      id="trade-token-address"
                      placeholder="0x..."
                      className="bg-gray-100/50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800 focus:border-pink-500 transition-colors duration-200"
                      value={targetTokenAddress}
                      onChange={(e) => {
                        handleTokenInfo(e);
                      }}
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between mb-2">
                      <Label
                        htmlFor="trade-amount"
                        className="text-zinc-700 dark:text-zinc-300"
                      >
                        {isBuy
                          ? selectedChain.id === "ethereum" ||
                            selectedChain.id === "base"
                            ? "ETH"
                            : selectedChain.id === "tron"
                            ? "TRX"
                            : selectedChain.id === "solana"
                            ? "SOL"
                            : selectedChain.id === "bsc"
                            ? "BNB"
                            : ""
                          : "Token"}{" "}
                        Amount
                      </Label>
                      <span className="text-sm text-pink-500 dark:text-pink-400 font-medium">
                        Balance:{" "}
                        {isBuy
                          ? selectedChain.id === "ethereum" ||
                            selectedChain.id === "base"
                            ? `${Number(tradeSectionBalance).toFixed(3)} ETH`
                            : selectedChain.id === "tron"
                            ? "1000 TRX"
                            : selectedChain.id === "solana"
                            ? "15.2 SOL"
                            : selectedChain.id === "bsc"
                            ? `${Number(tradeSectionBalance).toFixed(3)} BNB`
                            : "0"
                          : `${Number(tradeSectionBalance).toFixed(3)}`}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="trade-amount"
                        type="number"
                        className="bg-gray-100/50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800 focus:border-pink-500 transition-colors duration-200"
                        value={trade.amountIn}
                        onChange={(e) => handleAmountIn(e)}
                      />
                      <Button
                        onClick={async () => {
                          const balance = await maxTradeBalance();

                          const returnAmount = await getAmountsOutput(
                            String(balance)
                          );

                          setTrade((prev) => ({
                            ...prev,
                            amountIn: getExactDecimals(
                              balance || 0,
                              4
                            ).toString(),
                            amountOut: String(returnAmount),
                          }));
                        }}
                        variant="outline"
                        size="sm"
                        className="shrink-0 h-10 border-zinc-300 dark:border-zinc-800 hover:border-pink-500 hover:bg-pink-50/30 dark:hover:bg-pink-950/30 transition-all duration-200"
                      >
                        MAX
                      </Button>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Label
                      htmlFor="trade-amount"
                      className="text-zinc-700 dark:text-zinc-300"
                    >
                      You will get {getExactDecimals(trade.amountOut, 4) || 0}{" "}
                      {isBuy ? tokenInfo?.symbol || "N/A" : "ETH"}
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-2">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label
                          htmlFor="trade-gas-price"
                          className="text-zinc-700 dark:text-zinc-300"
                        >
                          Gas (Gwei)
                        </Label>
                        <span className="text-sm text-pink-500 dark:text-pink-400 font-medium">
                          {tradeGasPrice}
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 dark:text-pink-200 dark:bg-pink-900/50">
                              Slow
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 dark:text-pink-200 dark:bg-pink-900/50">
                              Fast
                            </span>
                          </div>
                        </div>
                        <Slider
                          id="trade-gas-price"
                          min={1}
                          max={100}
                          step={1}
                          value={[tradeGasPrice]}
                          onValueChange={(value) => setTradeGasPrice(value[0])}
                          className="[&>span]:bg-pink-500"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label
                          htmlFor="trade-slippage"
                          className="text-zinc-700 dark:text-zinc-300"
                        >
                          Slippage %
                        </Label>
                        <span className="text-sm text-pink-500 dark:text-pink-400 font-medium">
                          {tradeSlippage}%
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 dark:text-pink-200 dark:bg-pink-900/50">
                              Low
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 dark:text-pink-200 dark:bg-pink-900/50">
                              High
                            </span>
                          </div>
                        </div>
                        <Slider
                          id="trade-slippage"
                          min={1}
                          max={50}
                          step={1}
                          value={[tradeSlippage]}
                          onValueChange={(value) => setTradeSlippage(value[0])}
                          className="[&>span]:bg-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  {!account && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-100/30 dark:bg-amber-900/20 p-3 rounded-md mb-2">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <span>Connect Wallet for transactions</span>
                    </div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-200 bg-gradient-to-r text-white from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 hover:from-pink-400 hover:to-pink-300 dark:hover:from-pink-500 dark:hover:to-pink-400 shadow-lg shadow-pink-900/20 transition-all duration-200"
                      onClick={isBuy ? handleBuy : handleSell}
                      disabled={
                        targetTokenAddress.trim() === "" ||
                        !trade.amountIn ||
                        !trade.isPairExist
                      }
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                        className="mr-2"
                      >
                        <Zap className="h-4 w-4" />
                      </motion.div>
                      Place Trade
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
              {/* //////////////////// END /////////////////////////// */}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ==>> Target token section  */}
              <Card className="col-span-1 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-pink-900/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Target className="h-5 w-5 text-pink-500" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300 dark:from-pink-400 dark:to-pink-600">
                          Pre-Launch Snipe
                        </span>
                      </CardTitle>
                      <CardDescription>
                        Set the token you want to snipe
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setIsTradeModal(true)}
                      variant="default"
                      className="w-100 bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 hover:from-pink-400 hover:to-pink-300 dark:hover:from-pink-500 dark:hover:to-pink-400 text-white shadow-lg shadow-pink-900/20 transition-all duration-200"
                    >
                      Go to Trade
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="token-address"
                      className="text-zinc-700 dark:text-zinc-300"
                    >
                      {selectedChain.name} Token Contract Address
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="token-address"
                        placeholder="0x..."
                        className="bg-gray-100/50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800 focus:border-pink-500 transition-colors duration-200"
                        value={targetTokenAddress}
                        onChange={(e) => {
                          handleTokenInfo(e);
                        }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-zinc-300 dark:border-zinc-800 hover:border-pink-500 hover:bg-pink-50/30 dark:hover:bg-pink-950/30 transition-all duration-200"
                        onClick={() => fetchTokenInfo(targetTokenAddress)}
                      >
                        <RefreshCw className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                      </Button>
                    </div>
                  </div>
                  {showTokenInfo && tokenInfo && (
                    <motion.div
                      className="bg-gray-100/70 dark:bg-zinc-900/70 rounded-lg p-4 border border-zinc-200/50 dark:border-zinc-800/50 space-y-3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 flex items-center justify-center text-white font-bold"
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 0 }}
                            transition={{ duration: 0.5, type: "spring" }}
                          >
                            {tokenInfo.symbol.charAt(0)}
                          </motion.div>
                          <div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {tokenInfo.symbol}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <Badge
                            variant="outline"
                            className="bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            {tokenInfo.isVerfied ? "Verified" : "Unverified"}
                          </Badge>
                        </motion.div>
                      </div>

                      <Separator className="bg-zinc-200 dark:bg-zinc-800" />

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                          { label: "Decimals", value: tokenInfo.decimals },
                          {
                            label: "Total Supply",
                            value: tokenInfo.totalSupply,
                          },
                          {
                            label: "Owner %",
                            value: tokenInfo.ownerHoldingsPercent,
                          },
                          { label: "Holders", value: tokenInfo.holders },
                          { label: "Buy Tax", value: tokenInfo.buyTax },
                          { label: "Sell Tax", value: tokenInfo.sellTax },
                        ].map((item, index) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.1 + index * 0.05,
                            }}
                          >
                            <p className="text-zinc-500 dark:text-zinc-400">
                              {item.label}
                            </p>
                            <p className="font-medium text-zinc-900 dark:text-white">
                              {item.value}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-2">
                    <div className="flex justify-between mb-2">
                      <Label
                        htmlFor="amount"
                        className="text-zinc-700 dark:text-zinc-300"
                      >
                        {selectedChain.id === "ethereum" ||
                        selectedChain.id === "base"
                          ? "ETH"
                          : selectedChain.id === "tron"
                          ? "TRX"
                          : selectedChain.id === "solana"
                          ? "SOL"
                          : selectedChain.id === "bsc"
                          ? "BNB"
                          : "Token"}{" "}
                        Amount
                      </Label>
                      <span className="text-sm text-pink-500 dark:text-pink-400 font-medium">
                        Balance:{" "}
                        {selectedChain.id === "ethereum" ||
                        selectedChain.id === "base"
                          ? `${Number(balance).toFixed(3)} ETH`
                          : selectedChain.id === "tron"
                          ? "1000 TRX"
                          : selectedChain.id === "solana"
                          ? "15.2 SOL"
                          : selectedChain.id === "bsc"
                          ? `${Number(balance).toFixed(3)} BNB`
                          : "0"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="amount"
                        type="number"
                        className="bg-gray-100/50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800 focus:border-pink-500 transition-colors duration-200"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <Button
                        onClick={async () => {
                          const balance = await maxBalance();
                          setAmount(balance.toFixed(3));
                        }}
                        variant="outline"
                        size="sm"
                        className="shrink-0 h-10 border-zinc-300 dark:border-zinc-800 hover:border-pink-500 hover:bg-pink-50/30 dark:hover:bg-pink-950/30 transition-all duration-200"
                      >
                        MAX
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-2">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label
                          htmlFor="gas-price"
                          className="text-zinc-700 dark:text-zinc-300"
                        >
                          Gas (Gwei)
                        </Label>
                        <span className="text-sm text-pink-500 dark:text-pink-400 font-medium">
                          {gasPrice}
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 dark:text-pink-200 dark:bg-pink-900/50">
                              Slow
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 dark:text-pink-200 dark:bg-pink-900/50">
                              Fast
                            </span>
                          </div>
                        </div>
                        <Slider
                          id="gas-price"
                          min={5}
                          max={100}
                          step={1}
                          value={[gasPrice]}
                          onValueChange={(value) => setGasPrice(value[0])}
                          className="[&>span]:bg-pink-500"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label
                          htmlFor="slippage"
                          className="text-zinc-700 dark:text-zinc-300"
                        >
                          Slippage %
                        </Label>
                        <span className="text-sm text-pink-500 dark:text-pink-400 font-medium">
                          {slippage}%
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 dark:text-pink-200 dark:bg-pink-900/50">
                              Low
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 dark:text-pink-200 dark:bg-pink-900/50">
                              High
                            </span>
                          </div>
                        </div>
                        <Slider
                          id="slippage"
                          min={1}
                          max={50}
                          step={1}
                          value={[slippage]}
                          onValueChange={(value) => setSlippage(value[0])}
                          className="[&>span]:bg-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  {!selectedWallet && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-100/30 dark:bg-amber-900/20 p-3 rounded-md mb-2">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <span>Private key required for sniping transactions</span>
                    </div>
                  )}

                  {/* {monitoring ? (
                  <Button
                    variant="destructive"
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-900/20 transition-all duration-200"
                    onClick={handleStopMonitoring}
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Stop Monitoring
                  </Button>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 hover:from-pink-400 hover:to-pink-300 dark:hover:from-pink-500 dark:hover:to-pink-400 shadow-lg shadow-pink-900/20 transition-all duration-200"
                      onClick={handleStartMonitoring}
                      disabled={!connected || address.trim() === ""}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                        className="mr-2"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.div>
                      Start Monitoring
                    </Button>
                  </motion.div>
                )} */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* <Button
                    variant="outline"
                    className="w-full border-pink-400/50 dark:border-pink-500/50 bg-white/50 dark:bg-black/50 backdrop-blur-sm text-pink-500 dark:text-pink-400 hover:bg-pink-50/30 dark:hover:bg-pink-950/30 hover:text-pink-600 dark:hover:text-pink-300 transition-all duration-200"
                    onClick={handleMonitoring}
                    disabled={targetTokenAddress.trim() === "" || !amount}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                      }}
                      className="mr-2"
                    >
                      <Zap className="h-4 w-4" />
                    </motion.div>
                    Buy Now
                  </Button> */}
                    <Button
                      className="w-full bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 hover:from-pink-400 hover:to-pink-300 dark:hover:from-pink-500 dark:hover:to-pink-400 shadow-lg shadow-pink-900/20 transition-all duration-200"
                      onClick={handleMonitoring}
                      disabled={targetTokenAddress.trim() === "" || !amount}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                        className="mr-2"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.div>
                      Start Monitoring
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
              {/* //////////////////// END /////////////////////////// */}

              {/* ==>> Token Sinper Dashboard section  */}
              <Card className="col-span-1 lg:col-span-2 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-pink-900/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>
                <Tabs defaultValue="monitor">
                  <CardHeader className="pb-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300 dark:from-pink-400 dark:to-pink-600">
                        Token Sniper Dashboard
                      </CardTitle>
                      <TabsList className="bg-gray-100/70 dark:bg-zinc-900/70 p-1 sm:self-auto">
                        <TabsTrigger
                          value="monitor"
                          className="data-[state=active]:bg-pink-500 data-[state=active]:text-white transition-all duration-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Monitor
                        </TabsTrigger>
                        <TabsTrigger
                          value="settings"
                          className="data-[state=active]:bg-pink-500 data-[state=active]:text-white transition-all duration-200"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </TabsTrigger>
                        <TabsTrigger
                          value="history"
                          className="data-[state=active]:bg-pink-500 data-[state=active]:text-white transition-all duration-200"
                          onClick={handleHistoryData}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          History
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <CardDescription>
                      Monitor and snipe tokens on {selectedChain.name}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-6">
                    {/* ==>> Monitoring table section   */}
                    <TabsContent value="monitor" className="m-0">
                      <div className="space-y-4 overflow-x-auto">
                        <div className="min-w-[640px] bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-black rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg overflow-hidden">
                          <div className="grid grid-cols-7 gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-gray-100/40 dark:bg-black/40">
                            <div>Token</div>
                            <div>Wallet</div>
                            <div>Amount</div>
                            <div>Gas Fee</div>
                            <div>Slippage(%)</div>
                            <div>Status</div>
                            <div>Time</div>
                          </div>
                          {monitorTableData && monitorTableData.length > 0 ? (
                            monitorTableData?.map((item: HistoryData, i) => (
                              <div
                                className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50"
                                key={i}
                              >
                                <div className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-100/30 dark:hover:bg-zinc-900/30 transition-colors duration-200">
                                  <div className="truncate text-pink-500 dark:text-pink-400">
                                    {shortenAddress(item.tokenAddress)}
                                  </div>
                                  <div className="truncate text-pink-500 dark:text-pink-400">
                                    {shortenAddress(item.wallet.publicKey)}
                                  </div>
                                  <div>{item.buyAmount} ETH</div>
                                  <div>{item.gasFee}</div>
                                  <div>{item.slippage}%</div>
                                  <div>
                                    {item.status ? (
                                      <div className="flex items-center gap-1 text-green-600 dark:text-green-500">
                                        <Check className="h-4 w-4" /> Success
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1 text-green-600 dark:text-green-500">
                                        <X className="h-4 w-4" /> Failed
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {formatTimestamp(item.createdAt)}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center justify-center h-32">
                              <span className="text-zinc-500 dark:text-zinc-400 text-center text-md">
                                No data to display.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Monitoring Section should be here dont remove this */}
                      {/* <MonitoringSection /> */}
                    </TabsContent>
                    {/* //////////////////// END /////////////////////////// */}

                    {/* ==>> Settings tab section   */}
                    <TabsContent value="settings" className="m-0">
                      <div className="space-y-8">
                        <div className="bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-black p-5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg">
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300 dark:from-pink-400 dark:to-pink-600">
                            <Shield className="h-5 w-5 text-pink-500" />
                            Auto-Sell Settings
                          </h3>
                          <div className="space-y-5">
                            <div className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-zinc-900/50 rounded-lg">
                              <div className="space-y-0.5">
                                <Label
                                  htmlFor="auto-sell"
                                  className="text-zinc-900 dark:text-white font-medium"
                                >
                                  Auto-Sell
                                </Label>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                  Automatically sell based on profit/loss
                                  targets
                                </p>
                              </div>
                              <Switch
                                id="auto-sell"
                                checked={settings.autoSell}
                                onCheckedChange={(checked) =>
                                  handleChange("autoSell", checked)
                                }
                                className="data-[state=checked]:bg-pink-500"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-gray-100/30 dark:bg-zinc-900/30 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                  <Label
                                    htmlFor="stop-loss"
                                    className="text-zinc-700 dark:text-zinc-300"
                                  >
                                    Stop Loss %
                                  </Label>
                                  <span className="text-sm text-pink-500 dark:text-pink-400 font-medium">
                                    {settings.stopLoss}%
                                  </span>
                                </div>
                                <Slider
                                  id="stop-loss"
                                  min={10}
                                  max={90}
                                  step={5}
                                  value={[settings.stopLoss]}
                                  onValueChange={(value) =>
                                    handleChange("stopLoss", value[0])
                                  }
                                  disabled={!settings.autoSell}
                                  className="[&>span]:bg-red-500"
                                />
                                <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                                  Sell automatically if token drops below{" "}
                                  {settings.stopLoss}% of purchase price
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-black p-4 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300 dark:from-pink-400 dark:to-pink-600">
                              <Rocket className="h-5 w-5 text-pink-500" />
                              Multi-Level Profit Taking
                            </h3>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                  >
                                    <Info className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white/95 dark:bg-black/95 backdrop-blur-md border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-xl shadow-pink-900/20">
                                  <p className="max-w-xs">
                                    Set multiple profit targets to automatically
                                    sell portions of your position at different
                                    price levels
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <div className="space-y-4">
                            {settings.profitLevels.map((level, index) => (
                              <div
                                key={index}
                                className="bg-gradient-to-r from-gray-100/80 to-white/80 dark:from-zinc-900/80 dark:to-black/80 p-3 rounded-lg border border-zinc-200/30 dark:border-zinc-800/30 hover:border-pink-400/20 dark:hover:border-pink-500/20 transition-all duration-200 shadow-md"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={level.enabled}
                                      onCheckedChange={(checked) =>
                                        updateProfitLevel(
                                          index,
                                          "enabled",
                                          checked
                                        )
                                      }
                                      disabled={!settings.autoSell}
                                      className="data-[state=checked]:bg-pink-500"
                                    />
                                    <span className="font-medium text-zinc-900 dark:text-white">
                                      Level {index + 1}
                                    </span>
                                  </div>
                                  <Badge className="w-fit sm:w-auto bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 text-white border-none shadow-sm shadow-pink-900/20">
                                    {level.profitTarget}% of position
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="flex-1">
                                    <div className="flex justify-between mb-3">
                                      <Label
                                        htmlFor={`profit-${index}`}
                                        className="text-xs text-zinc-500 dark:text-zinc-400"
                                      >
                                        Profit Target
                                      </Label>
                                      <span className="text-xs text-pink-500 dark:text-pink-400 font-medium">
                                        {level.profitTarget}%
                                      </span>
                                    </div>
                                    <Slider
                                      id={`profit-${index}`}
                                      min={20}
                                      max={1000}
                                      step={10}
                                      value={[level.profitTarget]}
                                      onValueChange={(value) =>
                                        updateProfitLevel(
                                          index,
                                          "profitTarget",
                                          value[0]
                                        )
                                      }
                                      disabled={
                                        !settings.autoSell || !level.enabled
                                      }
                                      className="[&>span]:bg-pink-500"
                                    />
                                  </div>

                                  <div className="w-24">
                                    <Label
                                      htmlFor={`percentage-${index}`}
                                      className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1"
                                    >
                                      Sell %
                                    </Label>
                                    <Input
                                      id={`percentage-${index}`}
                                      type="number"
                                      className="bg-gray-100/50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800 focus:border-pink-500 transition-colors duration-200 h-8"
                                      value={level.sellPercentage}
                                      onChange={(e) =>
                                        updateProfitLevel(
                                          index,
                                          "sellPercentage",
                                          Number.parseInt(e.target.value) || 0
                                        )
                                      }
                                      disabled={
                                        !settings.autoSell || !level.enabled
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Safety Features should be here dont remove this */}
                        {/* <SafetyFeatures /> */}

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            className="w-full border-pink-400/50 dark:border-pink-500/50 bg-white/50 dark:bg-black/50 backdrop-blur-sm text-pink-500 dark:text-pink-400 hover:bg-pink-50/30 dark:hover:bg-pink-950/30 hover:text-pink-600 dark:hover:text-pink-300 transition-all duration-200"
                            onClick={handleSettingChanges}
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "loop",
                              }}
                              className="mr-2"
                            >
                              <Shield className="h-4 w-4" />
                            </motion.div>
                            Save Changes
                          </Button>
                        </motion.div>
                      </div>
                    </TabsContent>
                    {/* //////////////////// END /////////////////////////// */}

                    {/* ==>> History table section   */}
                    <TabsContent value="history" className="m-0">
                      <div className="space-y-4 overflow-x-auto">
                        <div className="min-w-[640px] bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-black rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg overflow-hidden">
                          <div className="grid grid-cols-7 gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-gray-100/40 dark:bg-black/40">
                            <div>Token</div>
                            <div>Wallet</div>
                            <div>Amount</div>
                            <div>Gas Fee</div>
                            <div>Slippage(%)</div>
                            <div>Status</div>
                            <div>Time</div>
                          </div>
                          {historyData && historyData.length > 0 ? (
                            historyData?.map((item: HistoryData, i) => (
                              <div
                                className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50"
                                key={i}
                              >
                                <div className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-100/30 dark:hover:bg-zinc-900/30 transition-colors duration-200">
                                  <div className="truncate text-pink-500 dark:text-pink-400">
                                    {shortenAddress(item.tokenAddress)}
                                  </div>
                                  <div className="truncate text-pink-500 dark:text-pink-400">
                                    {shortenAddress(item.wallet.publicKey)}
                                  </div>
                                  <div>{item.buyAmount} ETH</div>
                                  <div>{item.gasFee}</div>
                                  <div>{item.slippage}%</div>
                                  <div>
                                    {item.status ? (
                                      <div className="flex items-center gap-1 text-green-600 dark:text-green-500">
                                        <Check className="h-4 w-4" /> Success
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1 text-green-600 dark:text-green-500">
                                        <X className="h-4 w-4" /> Failed
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {formatTimestamp(item.createdAt)}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center justify-center h-32">
                              <span className="text-zinc-500 dark:text-zinc-400 text-center text-md">
                                No data to display.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    {/* //////////////////// END /////////////////////////// */}
                  </CardContent>
                </Tabs>
              </Card>
              {/* //////////////////// END /////////////////////////// */}
            </div>
          )}

          <footer className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-500">
            <p>Sniper v1.0.0 - Use at your own risk. Not financial advice.</p>
            <p className="mt-1">
              Always DYOR (Do Your Own Research) before investing in any token.
            </p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}
