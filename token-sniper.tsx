"use client";

import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { getBalance, GetBalanceReturnType } from "@wagmi/core";
import { formatEther, isAddress } from "viem";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
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
  Percent,
  AlertTriangle,
  Eye,
  Sun,
  Plus,
  Key,
  Info,
  ChevronDown,
  Shield,
  Flame,
  Rocket,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Menu,
} from "lucide-react";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useAuth } from "./utils/constant";
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

interface Wallet {
  _id: string;
  publicKey: string;
  isActive: boolean;
}

interface HistoryData {
  tokenAddress: string;
  wallet: {
    publicKey: string;
  };
  buyAmount: number;
  gasFee: string;
  slippage: number;
  status: boolean;
  isSnipedAndSold: boolean;
  createdAt: string;
}

interface TokenInfo {
  isVerfied: boolean;
  holders: number;
  buyTax: number;
  sellTax: number;
  decimals: number;
  totalSupply: number;
  ownerHoldingsPercent: number;
  lpLockPercentage: number;
  symbol: string;
}

// --->> reuseable function of private key
const AddPrivateKeyDialog = ({
  trigger,
  addWalletPrivateKey,
  setAddWalletPrivateKey,
  handleAddPrivateKey,
  selectedChain,
}: any) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-white/95 dark:bg-black/95 backdrop-blur-md border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-xl shadow-pink-900/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300 dark:from-pink-400 dark:to-pink-600">
            Add Private Key
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400">
            {"Enter your private key to enable sniping on " +
              selectedChain.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="private-key">Private Key</Label>

            <Input
              id="private-key"
              type="password"
              placeholder="Enter your private key"
              className="bg-gray-100/50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800 focus:border-pink-500 transition-colors duration-200 font-mono"
              value={addWalletPrivateKey}
              onChange={(e) => setAddWalletPrivateKey(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 bg-red-100/30 dark:bg-red-900/20 p-3 rounded-md">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>
              Never share your private key with anyone. This key gives full
              access to your funds.
            </span>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="w-full bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 hover:from-pink-400 hover:to-pink-300 dark:hover:from-pink-500 dark:hover:to-pink-400 text-white shadow-lg shadow-pink-900/20 transition-all duration-200"
              onClick={handleAddPrivateKey}
              disabled={addWalletPrivateKey.length < 64}
            >
              <Key className="mr-2 h-4 w-4" />
              Add Key
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
//////////////////////////////////////////
// --->> reuseable function of geneate wallet
const GenerateWalletDialog = ({
  trigger,
  newWalletAddress,
  generatedPrivateKey,
  shortenAddress,
  shortenPrivateAddress,
  handleCreateWallet,
  selectedChain,
  copyToClipboard,
  setNewWalletAddress,
  setGeneratedPrivateKey,
}: any) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-white/95 dark:bg-black/95 backdrop-blur-md border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-xl shadow-pink-900/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300 dark:from-pink-400 dark:to-pink-600">
            Generate New Wallet
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400">
            Create a new wallet for {selectedChain.name}. Make sure to save your
            private key securely.
          </DialogDescription>
        </DialogHeader>

        {newWalletAddress ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Wallet Address</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => copyToClipboard(newWalletAddress)}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="bg-gray-100/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-md p-2 text-sm font-mono">
                {shortenAddress(newWalletAddress)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Private Key</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => copyToClipboard(generatedPrivateKey)}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="bg-gray-100/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-md p-2 text-sm font-mono">
                {shortenPrivateAddress(generatedPrivateKey)}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 bg-red-100/30 dark:bg-red-900/20 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>
                Save this private key securely! If lost, you cannot recover your
                funds.
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 bg-gray-100/30 dark:bg-zinc-900/30 p-3 rounded-md">
              <Info className="h-4 w-4 text-pink-500" />
              <span>
                A new wallet will be generated for {selectedChain.name}.
              </span>
            </div>
          </div>
        )}

        <DialogFooter>
          {newWalletAddress ? (
            <DialogClose asChild>
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 hover:from-pink-400 hover:to-pink-300 dark:hover:from-pink-500 dark:hover:to-pink-400 text-white shadow-lg shadow-pink-900/20 transition-all duration-200"
                onClick={() => {
                  setNewWalletAddress("");
                  setGeneratedPrivateKey("");
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
            </DialogClose>
          ) : (
            <Button
              className="w-full bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 hover:from-pink-400 hover:to-pink-300 dark:hover:from-pink-500 dark:hover:to-pink-400 text-white shadow-lg shadow-pink-900/20 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation(), handleCreateWallet();
              }}
            >
              <Key className="mr-2 h-4 w-4" />
              Generate Wallet
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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

  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [targetTokenAddress, setTargetTokenAddress] = useState("");
  const [amount, setAmount] = useState("0.1");
  const [gasPrice, setGasPrice] = useState(30);
  const [slippage, setSlippage] = useState(15);
  const [monitoring, setMonitoring] = useState(false);
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
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [showTokenInfo, setShowTokenInfo] = useState(false);
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

  const [progress, setProgress] = useState(0);
  const [chartData, setChartData] = useState([]);

  // const [autoBuyOnLiq, setAutoBuyOnLiq] = useState(true);
  // const [maxBuyDelay, setMaxBuyDelay] = useState(3);
  // const [buyGasMultiplier, setBuyGasMultiplier] = useState(1.5);
  // const [buyAmount, setBuyAmount] = useState(100);
  // const [buyAmountType, setBuyAmountType] = useState("percent"); // "percent" or "fixed"
  // const [showPrivateKey, setShowPrivateKey] = useState(false);

  const chains = [
    { id: "ethereum", name: "Ethereum", icon: DollarSign, color: "pink" },
    { id: "base", name: "Base", icon: BarChart3, color: "blue" },
    { id: "bsc", name: "BSC", icon: Zap, color: "yellow" },
    // { id: "tron", name: "Tron", icon: Zap, color: "red" },
    // { id: "solana", name: "Solana", icon: Sun, color: "purple" },
  ];

  // Simulate progress for monitoring
  useEffect(() => {
    if (monitoring) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [monitoring]);

  // Generate fake chart data
  useEffect(() => {
    const generateChartData = () => {
      const data = [];
      let value = 100;
      for (let i = 0; i < 20; i++) {
        value = value + (Math.random() * 10 - 5);
        data.push(value);
      }
      return data;
    };

    setChartData(generateChartData());

    const interval = setInterval(() => {
      setChartData(generateChartData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // get all wallets api function
  const fetchUserWallets = async () => {
    const { data } = await getAllWallets();
    const { data: monitorData } = await getActiveSnipers();
    const { data: settingsData } = await getSniperSettings();

    if (data) {
      setUserWallets(data);
      const activeWallet =
        data.find((wallet: Wallet) => wallet.isActive) || null;
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

  const handleConnect = () => {
    // In a real app, this would validate the private key format
    if (addWalletPrivateKey.length >= 64) {
      setConnected(true);
      if (address.trim().length > 10) {
        // fetchTokenInfo();
      }
    } else {
      showToast("Please enter a valid private key", "error");
    }
  };

  const handleStartMonitoring = () => {
    if (address.trim() !== "") {
      setMonitoring(true);
      // fetchTokenInfo();
    }
  };

  const handleStopMonitoring = () => {
    setMonitoring(false);
  };

  const handleBuyNow = async () => {
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
    const tokenAddress = e.target.value.trim();
    setTargetTokenAddress(tokenAddress);

    await fetchTokenInfo(tokenAddress);
  };

  // Api call of setting section
  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSafetyChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      safetyFeatures: {
        ...prev.safetyFeatures,
        [field]: value,
      },
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
  const handleSelectWallet = async (wallet: Wallet) => {
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

  // Replace the existing renderMiniChart function with this enhanced animated version
  const renderMiniChart = (data) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    return (
      <div className="h-12 flex items-end space-x-[2px]">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          const isPositive = index > 0 ? value >= data[index - 1] : true;
          return (
            <motion.div
              key={index}
              className={`w-[3px] ${
                isPositive ? "bg-pink-500" : "bg-pink-700"
              } dark:${
                isPositive ? "bg-pink-400" : "bg-pink-600"
              } rounded-t-sm`}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: index * 0.02 }}
            />
          );
        })}
      </div>
    );
  };

  // Add this function after the renderMiniChart function
  const FloatingParticle = ({ size, color, delay, duration, left }) => {
    return (
      <motion.div
        className={`absolute rounded-full ${color} opacity-20 pointer-events-none`}
        style={{
          width: size,
          height: size,
          left: `${left}%`,
        }}
        initial={{ y: "110vh", opacity: 0 }}
        animate={{
          y: "-10vh",
          opacity: [0, 0.2, 0.1, 0.2, 0],
          x: [0, 10, -10, 15, -5, 0],
        }}
        transition={{
          duration: duration,
          delay: delay,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      />
    );
  };

  // Add this component after the FloatingParticle component
  const BackgroundParticles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden z-0 opacity-40">
        <FloatingParticle
          size="20px"
          color="bg-pink-400"
          delay={0}
          duration={15}
          left={10}
        />
        <FloatingParticle
          size="30px"
          color="bg-pink-500"
          delay={2}
          duration={20}
          left={20}
        />
        <FloatingParticle
          size="15px"
          color="bg-pink-300"
          delay={5}
          duration={18}
          left={30}
        />
        <FloatingParticle
          size="25px"
          color="bg-pink-600"
          delay={7}
          duration={25}
          left={40}
        />
        <FloatingParticle
          size="18px"
          color="bg-pink-400"
          delay={10}
          duration={22}
          left={50}
        />
        <FloatingParticle
          size="22px"
          color="bg-pink-500"
          delay={3}
          duration={19}
          left={60}
        />
        <FloatingParticle
          size="28px"
          color="bg-pink-300"
          delay={8}
          duration={23}
          left={70}
        />
        <FloatingParticle
          size="16px"
          color="bg-pink-600"
          delay={12}
          duration={17}
          left={80}
        />
        <FloatingParticle
          size="24px"
          color="bg-pink-400"
          delay={6}
          duration={21}
          left={90}
        />
      </div>
    );
  };

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

  useEffect(() => {
    maxBalance();
  }, [maxBalance]);

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
                {userWallets.map((wallet: Wallet, indexx) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ==>> target token section  */}
            <Card className="col-span-1 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-pink-900/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Target className="h-5 w-5 text-pink-500" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300 dark:from-pink-400 dark:to-pink-600">
                    Pre-Launch Snipe
                  </span>
                </CardTitle>
                <CardDescription>
                  Set the token you want to snipe
                </CardDescription>
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
                    onClick={handleBuyNow}
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
                    onClick={handleBuyNow}
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
                    {/* {monitoring ? (
                      <div className="space-y-6">
                        {showTokenInfo && tokenInfo && (
                          <div className="bg-gradient-to-r from-gray-100 to-white dark:from-zinc-900 dark:to-black p-4 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg mb-6">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                  {tokenInfo.symbol.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                                    {tokenInfo.name}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 border-none">
                                      {tokenInfo.symbol}
                                    </Badge>
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                      Created {tokenInfo.createdAt}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border-zinc-300 dark:border-zinc-800 hover:border-pink-500 hover:bg-pink-50/30 dark:hover:bg-pink-950/30 transition-all duration-200"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1 text-pink-500" />
                                  Explorer
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border-zinc-300 dark:border-zinc-800 hover:border-pink-500 hover:bg-pink-50/30 dark:hover:bg-pink-950/30 transition-all duration-200"
                                >
                                  <Copy className="h-3 w-3 mr-1 text-pink-500" />
                                  Copy
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                              <div className="bg-white/70 dark:bg-black/50 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                  Owner %
                                </p>
                                <p className="font-bold text-zinc-900 dark:text-white">
                                  {tokenInfo.ownerHoldingsPercent}
                                </p>
                              </div>
                              <div className="bg-white/70 dark:bg-black/50 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                  Holders
                                </p>
                                <p className="font-bold text-zinc-900 dark:text-white">
                                  {tokenInfo.holders}
                                </p>
                              </div>
                              <div className="bg-white/70 dark:bg-black/50 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                  Buy Tax
                                </p>
                                <p className="font-bold text-zinc-900 dark:text-white">
                                  {tokenInfo.buyTax}
                                </p>
                              </div>
                              <div className="bg-white/70 dark:bg-black/50 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                  Sell Tax
                                </p>
                                <p className="font-bold text-zinc-900 dark:text-white">
                                  {tokenInfo.sellTax}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <motion.div
                          className="bg-gradient-to-r from-gray-100 to-white dark:from-zinc-900 dark:to-black p-4 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <motion.div
                                className="h-3 w-3 bg-pink-500 rounded-full"
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.7, 1, 0.7],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: "loop",
                                }}
                              />
                              <span className="font-medium">
                                Monitoring token:{" "}
                                <span className="text-pink-500 dark:text-pink-400">
                                  {address.substring(0, 6)}...
                                  {address.substring(address.length - 4)}
                                </span>
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-white/50 dark:bg-zinc-800/50 border-pink-400/30 dark:border-pink-500/30 text-pink-500 dark:text-pink-400"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                              </motion.div>
                              Live
                            </Badge>
                          </div>

                          <div className="mb-2 flex justify-between items-center">
                            <span className="text-sm text-zinc-500 dark:text-zinc-400">
                              Scanning for liquidity...
                            </span>
                            <span className="text-sm text-pink-500 dark:text-pink-400">
                              {progress}%
                            </span>
                          </div>
                          <div className="bg-gray-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-pink-500 rounded-full"
                              style={{ width: `${progress}%` }}
                              initial={{ width: "0%" }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black border-zinc-200/50 dark:border-zinc-800/50 shadow-md">
                            <CardHeader className="py-3 px-4">
                              <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Flame className="h-4 w-4 text-pink-500" />
                                Liquidity Status
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 px-4">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">
                                  Pending
                                </span>
                                <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 px-2 py-1 rounded-full text-xs">
                                  <AlertTriangle className="h-3 w-3" />
                                  Waiting
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black border-zinc-200/50 dark:border-zinc-800/50 shadow-md">
                            <CardHeader className="py-3 px-4">
                              <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-pink-500" />
                                Current Gas
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 px-4">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">
                                  28 Gwei
                                </span>
                                <div className="flex items-center gap-1 bg-pink-500/20 text-pink-600 dark:text-pink-500 px-2 py-1 rounded-full text-xs">
                                  <ChevronDown className="h-3 w-3" />
                                  Low
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black border-zinc-200/50 dark:border-zinc-800/50 shadow-md">
                            <CardHeader className="py-3 px-4">
                              <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Percent className="h-4 w-4 text-pink-500" />
                                Estimated Buy Tax
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 px-4">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">
                                  Scanning...
                                </span>
                                <RefreshCw className="h-4 w-4 animate-spin text-pink-500" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black p-4 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg">
                              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-pink-500" />
                                Liquidity Detection Log
                              </h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 bg-gray-100/50 dark:bg-zinc-900/50 p-2 rounded-md">
                                  <Clock className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                                  <span className="text-pink-500 dark:text-pink-400">
                                    21:45:32
                                  </span>
                                  <span>
                                    Scanning for liquidity addition...
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 bg-gray-100/50 dark:bg-zinc-900/50 p-2 rounded-md">
                                  <Clock className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                                  <span className="text-pink-500 dark:text-pink-400">
                                    21:45:28
                                  </span>
                                  <span>
                                    Monitoring mempool for token transactions
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 bg-gray-100/50 dark:bg-zinc-900/50 p-2 rounded-md">
                                  <Clock className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                                  <span className="text-pink-500 dark:text-pink-400">
                                    21:45:15
                                  </span>
                                  <span>
                                    Started monitoring token{" "}
                                    {address.substring(0, 6)}...
                                    {address.substring(address.length - 4)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black border-zinc-200/50 dark:border-zinc-800/50 shadow-md">
                              <CardHeader className="py-3 px-4">
                                <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                  <BarChart3 className="h-4 w-4 text-pink-500" />
                                  Price Trend
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="py-2 px-4">
                                <div className="flex flex-col">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-lg font-bold">
                                      Analyzing
                                    </span>
                                    <div className="flex items-center gap-1 text-pink-500">
                                      <ArrowUpRight className="h-4 w-4" />
                                      <span className="text-xs">+2.5%</span>
                                    </div>
                                  </div>
                                  {renderMiniChart(chartData)}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        className="flex flex-col items-center justify-center py-12 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          className="bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 p-6 rounded-full mb-6 shadow-lg shadow-pink-900/20"
                          animate={{
                            scale: [1, 1.05, 1],
                            boxShadow: [
                              "0 10px 15px -3px rgba(213, 63, 140, 0.2)",
                              "0 15px 25px -5px rgba(213, 63, 140, 0.3)",
                              "0 10px 15px -3px rgba(213, 63, 140, 0.2)",
                            ],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          }}
                        >
                          <Target className="h-12 w-12 text-white" />
                        </motion.div>
                        <motion.h3
                          className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300 dark:from-pink-400 dark:to-pink-600"
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          No Active Monitoring
                        </motion.h3>
                        <motion.p
                          className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8"
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          Enter a token contract address and click "Start
                          Monitoring" to begin sniping
                        </motion.p>
                        <motion.div
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <Button
                            className="bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 hover:from-pink-400 hover:to-pink-300 dark:hover:from-pink-500 dark:hover:to-pink-400 shadow-lg shadow-pink-900/20 transition-all duration-200 px-8 py-6"
                            disabled={!connected || address.trim() === ""}
                            onClick={handleStartMonitoring}
                          >
                            <Eye className="mr-2 h-5 w-5" />
                            Start Monitoring
                          </Button>
                        </motion.div>
                      </motion.div>
                    )} */}
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
                                Automatically sell based on profit/loss targets
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

                      {/* <div className="bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-black p-5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300 dark:from-pink-400 dark:to-pink-600">
                          <Shield className="h-5 w-5 text-pink-500" />
                          Safety Features
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-zinc-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900/70 transition-colors duration-200">
                            <div className="space-y-0.5">
                              <Label
                                htmlFor="anti-rug"
                                className="text-zinc-900 dark:text-white font-medium"
                              >
                                Anti-Rug Pull Protection
                              </Label>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Detect and avoid potential rug pulls
                              </p>
                            </div>
                            <Switch
                              id="anti-rug"
                              checked={settings.safetyFeatures.antiRugPull}
                              onCheckedChange={(checked) =>
                                handleSafetyChange("antiRugPull", checked)
                              }
                              className="data-[state=checked]:bg-pink-500"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-zinc-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900/70 transition-colors duration-200">
                            <div className="space-y-0.5">
                              <Label
                                htmlFor="front-running"
                                className="text-zinc-900 dark:text-white font-medium"
                              >
                                Front-Running Protection
                              </Label>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Prevent your transactions from being front-run
                              </p>
                            </div>
                            <Switch
                              id="front-running"
                              checked={
                                settings.safetyFeatures.frontRunningProtection
                              }
                              onCheckedChange={(checked) =>
                                handleSafetyChange(
                                  "frontRunningProtection",
                                  checked
                                )
                              }
                              className="data-[state=checked]:bg-pink-500"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-zinc-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900/70 transition-colors duration-200">
                            <div className="space-y-0.5">
                              <Label
                                htmlFor="multi-wallet"
                                className="text-zinc-900 dark:text-white font-medium"
                              >
                                Multi-Wallet Sniping
                              </Label>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Distribute buys across multiple wallets
                              </p>
                            </div>
                            <Switch
                              id="multi-wallet"
                              checked={
                                settings.safetyFeatures.multiWalletSniping
                              }
                              onCheckedChange={(checked) =>
                                handleSafetyChange(
                                  "multiWalletSniping",
                                  checked
                                )
                              }
                              className="data-[state=checked]:bg-pink-500"
                            />
                          </div>
                        </div>
                      </div> */}

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
          </div>

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
