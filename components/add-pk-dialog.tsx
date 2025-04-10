import { AlertCircle, Key } from "lucide-react";

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

// --->> reuseable function of private key
export const AddPrivateKeyDialog = ({
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
