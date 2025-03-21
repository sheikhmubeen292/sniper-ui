import { serverUrl } from "./constant";
import { handleApiRequest } from "./responseHandler";

// API function to get all wallets
export function getAllWallets() {
  const token = localStorage.getItem("token");

  const config = {
    url: `${serverUrl}/wallet/get-wallets`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  };

  return handleApiRequest(config);
}

// API function to generate wallet
export function generateWallet() {
  const token = localStorage.getItem("token");

  const config = {
    url: `${serverUrl}/wallet/create-wallet`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  };

  return handleApiRequest(config);
}

// API function to save private key
export function savePrivateKey(body: Object) {
  const token = localStorage.getItem("token");

  const config = {
    url: `${serverUrl}/wallet/add-wallet`,
    method: "POST",
    data: body,
    headers: {
      Authorization: `${token}`,
    },
  };

  return handleApiRequest(config);
}

// API function to active the selected wallet
export function activeSelectedWallet(body: Object) {
  const token = localStorage.getItem("token");

  const config = {
    url: `${serverUrl}/wallet/active-wallet`,
    method: "PUT",
    data: body,
    headers: {
      Authorization: `${token}`,
    },
  };

  return handleApiRequest(config);
}

// API function to create sniper
export function createSniper(body: Object) {
  const token = localStorage.getItem("token");

  const config = {
    url: `${serverUrl}/snipe/create-sniper`,
    method: "POST",
    data: body,
    headers: {
      Authorization: `${token}`,
    },
  };

  return handleApiRequest(config);
}

// API function to get active snipers
export function getActiveSnipers() {
  const token = localStorage.getItem("token");

  const config = {
    url: `${serverUrl}/snipe/get-active-snipers`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  };

  return handleApiRequest(config);
}

// API function to get in-active snipers
export function getInActiveSnipers() {
  const token = localStorage.getItem("token");

  const config = {
    url: `${serverUrl}/snipe/get-snipe-history`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  };

  return handleApiRequest(config);
}

// API function to create sniper settings
export function createSniperSettings(body: Object) {
  const token = localStorage.getItem("token");

  const config = {
    url: `${serverUrl}/snipe/sniper-settings`,
    method: "POST",
    data: body,
    headers: {
      Authorization: `${token}`,
    },
  };

  return handleApiRequest(config);
}

// API function to get snipers settings
export function getSniperSettings() {
  const token = localStorage.getItem("token");

  const config = {
    url: `${serverUrl}/snipe/sniper-settings`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  };

  return handleApiRequest(config);
}

// API function to get token information
export function getTokenInfo(tokenAddress: String, chainId: number) {
  const token = localStorage.getItem("token");

  const config = {
    url: `${serverUrl}/snipe/get-token-info/${tokenAddress}/${chainId}`,
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  };

  return handleApiRequest(config);
}
