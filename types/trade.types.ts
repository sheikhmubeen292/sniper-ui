export type Wallet = {
  _id: string;
  publicKey: string;
  isActive: boolean;
};

export type HistoryData = {
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
};

export type TokenInfo = {
  isVerfied: boolean;
  holders: number;
  buyTax: number;
  sellTax: number;
  decimals: number;
  totalSupply: number;
  ownerHoldingsPercent: number;
  lpLockPercentage: number;
  symbol: string;
};
