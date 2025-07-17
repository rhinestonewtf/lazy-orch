import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  foundry,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  sepolia,
  soneium,
  zksync,
} from "viem/chains";

export const supportedChains = [
  mainnet,
  base,
  arbitrum,
  optimism,
  polygon,
  zksync,
  soneium,
  sepolia,
  baseSepolia,
  arbitrumSepolia,
  optimismSepolia,
  foundry,
];

export const supportedTokens = ["ETH", "WETH", "USDC", "USDT"];
