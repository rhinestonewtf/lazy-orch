import { checkbox, select } from "@inquirer/prompts";
import { config } from "dotenv";
import { addUser } from "./users";
import { getIntentStatus } from "./intents";
config();

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
    ],
  });

  const environment = await select({
    message: "Select an environment",
    choices: [
      {
        name: "Local",
        value: "local",
      },
      {
        name: "Dev",
        value: "dev",
      },
      {
        name: "Prod",
        value: "prod",
      },
    ],
  });

  let apiUrl: string;
  let apiKey: string;
  if (environment === "local") {
    apiUrl = "http://localhost:3000";
    apiKey = process.env.LOCAL_API_KEY || "";
  } else if (environment === "dev") {
    apiUrl = "https://dev.orchestrator.rhinestone.dev";
    apiKey = process.env.DEV_API_KEY || "";
  } else if (environment === "prod") {
    apiUrl = "https://orchestrator.rhinestone.dev";
    apiKey = process.env.PROD_API_KEY || "";
  }

  if (action == "addUser") {
    const response = await addUser({
      apiUrl,
      apiKey,
    });
    console.log(response);
  } else if (action == "intentStatus") {
    const response = await getIntentStatus({
      apiUrl,
      apiKey,
    });
    console.log(response);
  }
};

main();
