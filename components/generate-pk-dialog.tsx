import { AlertCircle, Key, X, Info, Copy } from "lucide-react";

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

//////////////////////////////////////////
// --->> reuseable function of geneate wallet

export const GenerateWalletDialog = ({
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
