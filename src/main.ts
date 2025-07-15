import { checkbox, select } from "@inquirer/prompts";
import { config } from "dotenv";
import { addUser } from "./users";
import { getIntentStatus } from "./intents";
import { checkChainStatus } from "./chain";
config();

const getEnv = async () => {
  const environment = await select({
    message: "Select an environment",
    choices: [
      {
        name: "Local",
        value: "local",
      },
      {
        name: "Staging",
        value: "staging",
      },
      {
        name: "Dev",
        value: "dev",
      },
      {
        name: "Prod",
        value: "prod",
      },
      {
        name: "Staging v1",
        value: "staging-v1",
      },
      {
        name: "Dev v1",
        value: "dev-v1",
      },
      {
        name: "Prod v1",
        value: "prod-v1",
      },
    ],
  });

  let apiUrl: string;
  let apiKey: string;
  if (environment === "local") {
    apiUrl = "http://localhost:3000";
    apiKey = process.env.LOCAL_API_KEY || "";
  } else if (environment === "staging") {
    apiUrl = "https://staging.orchestrator.rhinestone.dev";
    apiKey = process.env.STAGING_API_KEY || "";
  } else if (environment === "dev") {
    apiUrl = "https://dev.orchestrator.rhinestone.dev";
    apiKey = process.env.DEV_API_KEY || "";
  } else if (environment === "prod") {
    apiUrl = "https://orchestrator.rhinestone.dev";
    apiKey = process.env.PROD_API_KEY || "";
  } else if (environment === "staging-v1") {
    apiUrl = "https://staging.v1.orchestrator.rhinestone.dev";
    apiKey = process.env.STAGING_API_KEY || "";
  } else if (environment === "dev-v1") {
    apiUrl = "https://dev.v1.orchestrator.rhinestone.dev";
    apiKey = process.env.DEV_API_KEY || "";
  } else if (environment === "prod-v1") {
    apiUrl = "https://v1.orchestrator.rhinestone.dev";
    apiKey = process.env.PROD_API_KEY || "";
  }
  return { apiUrl, apiKey };
};

const main = async () => {
  const action = await select({
    message: "Select an action",
    choices: [
      {
        name: "Add user",
        value: "addUser",
      },
      {
        name: "Intent status",
        value: "intentStatus",
      },
      {
        name: "Check chain status",
        value: "checkChainStatus",
      },
    ],
  });

  if (action == "addUser") {
    const { apiUrl, apiKey } = await getEnv();
    const response = await addUser({
      apiUrl,
      apiKey,
    });
    console.log(response);
  } else if (action == "intentStatus") {
    const { apiUrl, apiKey } = await getEnv();
    const response = await getIntentStatus({
      apiUrl,
      apiKey,
    });
    console.log(response);
  } else if (action == "checkChainStatus") {
    await checkChainStatus();
  }
};

main();
