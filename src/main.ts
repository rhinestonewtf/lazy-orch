import { select } from "@inquirer/prompts";
import { config } from "dotenv";
import { addUser, listUsers } from "./users";
import { addOrg, addUserToOrg, listOrgs } from "./orgs";
import { addProject, updateProjectAttributes } from "./projects";
import { getSponsor } from "./sponsor";
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
        name: "Dev",
        value: "dev",
      },

      {
        name: "Staging",
        value: "staging",
      },
      {
        name: "Prod",
        value: "prod",
      },
    ],
  });

  let apiUrl: string = "";
  let apiKey: string = "";
  if (environment === "local") {
    apiUrl = "http://localhost:3000";
    apiKey = process.env.LOCAL_API_KEY || "";
  } else if (environment === "dev") {
    apiUrl = "https://dev.v1.orchestrator.rhinestone.dev";
    apiKey = process.env.DEV_API_KEY || "";
  } else if (environment === "staging") {
    apiUrl = "https://staging.v1.orchestrator.rhinestone.dev";
    apiKey = process.env.STAGING_API_KEY || "";
  } else if (environment === "prod") {
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
        name: "Add org",
        value: "addOrg",
      },
      {
        name: "Add project",
        value: "addProject",
      },
      {
        name: "Add user to org",
        value: "addUserToOrg",
      },
      { name: "Update project attributes", value: "updateProjectAttributes" },
      {
        name: "List users",
        value: "listUsers",
      },
      {
        name: "List orgs",
        value: "listOrgs",
      },
      {
        name: "Get sponsor",
        value: "getSponsor",
      },
    ],
  });

  if (action == "addUser") {
    const { apiUrl, apiKey } = await getEnv();
    await addUser({
      apiUrl,
      apiKey,
    });
  } else if (action == "addOrg") {
    const { apiUrl, apiKey } = await getEnv();
    await addOrg({
      apiUrl,
      apiKey,
    });
  } else if (action == "addProject") {
    const { apiUrl, apiKey } = await getEnv();
    await addProject({
      apiUrl,
      apiKey,
    });
  } else if (action == "addUserToOrg") {
    const { apiUrl, apiKey } = await getEnv();
    await addUserToOrg({
      apiUrl,
      apiKey,
    });
  } else if (action == "updateProjectAttributes") {
    const { apiUrl, apiKey } = await getEnv();
    await updateProjectAttributes({
      apiUrl,
      apiKey,
    });
  } else if (action == "listUsers") {
    const { apiUrl, apiKey } = await getEnv();
    await listUsers({
      apiUrl,
      apiKey,
    });
  } else if (action == "listOrgs") {
    const { apiUrl, apiKey } = await getEnv();
    await listOrgs({
      apiUrl,
      apiKey,
    });
  } else if (action == "getSponsor") {
    const { apiUrl, apiKey } = await getEnv();
    await getSponsor({
      apiUrl,
      apiKey,
    });
  }
};

main();
