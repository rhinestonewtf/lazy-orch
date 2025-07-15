import { select } from "@inquirer/prompts";
import { getTokenAddress } from "@rhinestone/sdk/orchestrator";
import {
  Address,
  createPublicClient,
  erc20Abi,
  http,
  PublicClient,
  zeroAddress,
} from "viem";
import { arbitrum, base } from "viem/chains";

const requiredContracts = [
  {
    name: "TheCompact",
    address: "0xa2E6C7Ba8613E1534dCB990e7e4962216C0a5d58" as Address,
  },
  {
    name: "RSAllocator",
    address: "0x9Ef7519F90C9B6828650Ff4913d663BB1f688507" as Address,
  },
  {
    name: "RSEmissary",
    address: "0xfa5ad10Bb1764AbE37fC0b0c7685a13099d21BAB" as Address,
  },
];

const supportedTokens = ["ETH", "USDC", "WETH", "USDT"];
const relayers = [
  {
    name: "Prod Relayer",
    address: "0xe59aaf21c4D9Cf92d9eD4537f4404BA031f83b23" as Address,
  },
  {
    name: "Dev Relayer",
    address: "0xdBfdBA7B3120c384589978aD75036e4FEBEB5280" as Address,
  },
];

const getBalanceOf = async (
  publicClient: any,
  tokenAddress: Address,
  relayerAddress: Address,
) => {
  if (tokenAddress == zeroAddress) {
    return await publicClient.getBalance({
      address: relayerAddress,
    });
  } else {
    return await publicClient.readContract({
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "balanceOf",
      args: [relayerAddress],
    });
  }
};

export const checkChainStatus = async () => {
  const chain = await select({
    message: "Select a chain",
    choices: [
      {
        name: "Base",
        value: {
          ...base,
          rpcUrls: {
            default: {
              http: ["https://base.drpc.org"],
            },
          },
        },
      },
      {
        name: "Arbitrum",
        value: {
          ...arbitrum,
          rpcUrls: {
            default: {
              http: ["https://base.drpc.org"],
            },
          },
        },
      },
    ],
  });

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  for (const contract of requiredContracts) {
    const code = await publicClient.getCode({
      address: contract.address,
    });

    if (code === "0x") {
      throw new Error(
        `Contract ${contract.name} not found at address ${contract.address} on chain ${chain.name}`,
      );
    } else {
      console.log(`Contract ${contract.name} deployed`);
    }
  }
  for (const relayer of relayers) {
    console.log(`Checking setup for relayer: ${relayer.name}`);
    for (const token of supportedTokens) {
      const tokenAddress = getTokenAddress(token, chain.id);
      const balance = await getBalanceOf(
        publicClient,
        tokenAddress,
        relayer.address,
      );

      if (balance === BigInt(0)) {
        console.log(
          `${relayer.name} has no balance for token ${token} on chain ${chain.name}`,
        );
      } else {
        console.log(
          `${relayer.name} has a balance of ${balance} for token ${token} on chain ${chain.name}`,
        );
      }

      if (tokenAddress != zeroAddress) {
        const approval = await publicClient.readContract({
          abi: erc20Abi,
          address: tokenAddress,
          functionName: "allowance",
          args: [relayer.address, "0xB3FcB766Efa166492522e4861c9f84A147b09eaf"],
        });

        if (approval === BigInt(0)) {
          console.log(
            `${relayer.name} has no approval for token ${token} on chain ${chain.name}`,
          );
        } else {
          console.log(
            `${relayer.name} has an approval of ${approval} for token ${token} on chain ${chain.name}`,
          );
        }
      }
    }
  }
};
