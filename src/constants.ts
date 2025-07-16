import {
  arbitrum,
  base,
  foundry,
  mainnet,
  optimism,
  polygon,
} from "viem/chains";

export const supportedChains = [
  mainnet,
  base,
  arbitrum,
  optimism,
  polygon,
  foundry,
];

export const supportedTokens = ["ETH", "WETH", "USDC", "USDT"];
