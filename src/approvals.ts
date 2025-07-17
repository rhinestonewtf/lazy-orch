import { input, password, select, confirm } from "@inquirer/prompts";
import clipboard from "clipboardy";
import { Chain } from "viem/chains";
import { Simulation } from "./types";
import { supportedChains, supportedTokens } from "./constants";
import {
  Address,
  createPublicClient,
  createWalletClient,
  defineChain,
  erc20Abi,
  Hex,
  http,
  maxUint256,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { getTokenAddress } from "@rhinestone/sdk/orchestrator";

export const giveApprovals = async () => {
  let chain = await select({
    message: "Select a chain",
    choices: [
      ...supportedChains.map((chain) => ({
        name: chain.name,
        value: chain,
      })),
      {
        name: "Custom",
        value: "custom",
      },
    ] as any,
  });

  if (chain === "custom") {
    const rpcUrl = await input({
      message: "Enter the custom RPC URL:",
      validate: (input) => {
        try {
          new URL(input);
          return true;
        } catch {
          return "Invalid URL. Please enter a valid RPC URL.";
        }
      },
    });
    const chainId = await input({
      message: "Enter the chain id:",
      validate: (input) => {
        const id = Number(input);
        if (isNaN(id) || id <= 0) {
          return "Invalid chain ID. Please enter a positive number.";
        }
        return true;
      },
    });

    chain = defineChain({
      id: Number(chainId),
      name: "Custom Chain",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: {
        default: {
          http: [rpcUrl],
        },
      },
    });
  }

  const publicClient = createPublicClient({
    chain: chain as Chain,
    transport: http(),
  });

  const spenderAddress = await input({
    message: "Enter the spender address:",
    validate: (input) => {
      if (!/^0x[a-fA-F0-9]{40}$/.test(input)) {
        return "Invalid address format. Please enter a valid Ethereum address.";
      }
      return true;
    },
    default: "0x67329453D888f81863bcF6bF680EAf420D3008AF",
  });

  const privateKey = await password({
    message: "Enter your private key:",
    validate: (input) => {
      if (!/^0x[a-fA-F0-9]{64}$/.test(input)) {
        return "Invalid private key format. Please enter a valid private key.";
      }
      return true;
    },
  });

  const walletClient = createWalletClient({
    account: privateKeyToAccount(privateKey as Hex),
    chain: chain as Chain,
    transport: http(),
  });

  const tokensWithoutETH = supportedTokens.filter((token) => token !== "ETH");

  const approvals = await publicClient.multicall({
    contracts: tokensWithoutETH.map((token) => ({
      address: getTokenAddress(token, (chain as Chain).id),
      abi: erc20Abi,
      functionName: "allowance",
      args: [walletClient.account.address, spenderAddress],
    })),
  });

  const formattedApprovals = approvals.map((approval, index) => {
    const token = tokensWithoutETH[index];
    return {
      token,
      allowance: approval.result,
      spender: spenderAddress,
    };
  });

  console.log("Existing approvals: ", formattedApprovals);

  const shouldApprove = await confirm({ message: "Make approvals?" });
  if (shouldApprove) {
    for (const approval of formattedApprovals) {
      if (BigInt(approval.allowance ?? 0n) < 1000000000n) {
        const tokenAddress = getTokenAddress(
          approval.token,
          (chain as Chain).id,
        );
        console.log(
          `Approving ${approval.token} (${tokenAddress}) for spender ${spenderAddress}`,
        );

        const txHash = await walletClient.writeContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [spenderAddress as Address, 1n],
        });

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });

        if (receipt.status !== "success") {
          console.error(
            `Transaction failed: ${(chain as Chain).blockExplorers?.default}${txHash}`,
          );
          continue;
        }

        console.log(
          `Approved ${approval.token} for spender ${spenderAddress} with tx hash: ${txHash}`,
        );
      } else {
        console.log(
          `Already approved ${approval.token} for spender ${spenderAddress}`,
        );
      }
    }
  }
};
