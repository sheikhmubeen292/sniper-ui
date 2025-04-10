import { AlertCircle, Key, Shield } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "./ui/switch";
import { useState } from "react";

export const SafetyFeatures = () => {
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

  const handleSafetyChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      safetyFeatures: {
        ...prev.safetyFeatures,
        [field]: value,
      },
    }));
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-black p-5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg">
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
            checked={settings.safetyFeatures.frontRunningProtection}
            onCheckedChange={(checked) =>
              handleSafetyChange("frontRunningProtection", checked)
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
            checked={settings.safetyFeatures.multiWalletSniping}
            onCheckedChange={(checked) =>
              handleSafetyChange("multiWalletSniping", checked)
            }
            className="data-[state=checked]:bg-pink-500"
          />
        </div>
      </div>
    </div>
  );
};
