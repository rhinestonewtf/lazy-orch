import { input, select } from "@inquirer/prompts";
import clipboard from "clipboardy";
import { Chain } from "viem/chains";
import { Simulation } from "./types";
import { supportedChains } from "./constants";

export const simulateFailedIntent = async () => {
  const simulationJSON = await input({
    message: "Enter the simulation data (JSON format):",
    validate: (input) => {
      try {
        JSON.parse(input);
        return true;
      } catch {
        return "Invalid JSON format. Please enter valid JSON.";
      }
    },
  });
  const simulation: Simulation = JSON.parse(simulationJSON);

  const chain = await select({
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

  let rpcUrl: string;
  if (chain === "custom") {
    rpcUrl = await input({
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
  } else {
    rpcUrl = (chain as Chain).rpcUrls.default.http[0];
  }

  clipboard.writeSync(
    `cast call ${simulation.call.to} ${simulation.call.data} --value ${simulation.call.value} --block ${simulation.details.blockNumber} --from ${simulation.details.relayer} --trace --decode-internal --rpc-url ${rpcUrl}`,
  );
  console.log("Cast command copied to clipboard!");
};
