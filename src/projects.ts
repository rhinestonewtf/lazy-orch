import { checkbox, input, select } from "@inquirer/prompts";
import { getOrgs } from "./orgs";

export const addProject = async ({
  apiUrl,
  apiKey,
}: {
  apiUrl: string;
  apiKey: string;
}) => {
  const orgs = await getOrgs({
    apiUrl,
    apiKey,
  });
  const orgId = await select({
    message: "Select org:",
    choices: orgs.map((org: any) => {
      return {
        name: org.name,
        value: org.id,
      };
    }),
  });
  const attributesInput = await checkbox({
    message: "Select projects attributes (optional)",
    choices: [
      { name: "Event publisher", value: "event-publisher" },
      { name: "Relayer", value: "relayer" },
    ],
  });

  const attributes: Record<string, boolean | string[]> = {};
  attributesInput.forEach((attr) => {
    attributes[attr] = true;
  });

  if (attributes["relayer"] == true) {
    const settlementLayers = await checkbox({
      message: "Select settlement layers",
      choices: [
        { name: "Same chain", value: "SAME_CHAIN" },
        { name: "Across", value: "ACROSS" },
        { name: "Eco", value: "ECO" },
        { name: "Relay", value: "RELAY" },
      ],
    });
    attributes["relayer"] = settlementLayers;
  }

  const name = await input({
    message: "Enter project name:",
  });

  const response = await fetch(`${apiUrl}/users/projects/${orgId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      attributes: { scopes: attributes },
      name,
    }),
  });

  if (!response.ok) {
    console.log(await response.json());
    throw new Error(`Error adding user: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
};

export const updateProjectAttributes = async ({
  apiUrl,
  apiKey,
}: {
  apiUrl: string;
  apiKey: string;
}) => {
  const orgs = await getOrgs({
    apiUrl,
    apiKey,
  });
  const projectId = await select({
    message: "Select project:",
    choices: orgs.flatMap((org: any) => {
      return org.projects.map((project: { name: string; id: number }) => {
        return {
          name: `${org.name}: ${project.name}`,
          value: project.id,
        };
      });
    }),
  });
  const attributesInput = await checkbox({
    message: "Select projects attributes (optional)",
    choices: [
      { name: "Event publisher", value: "event-publisher" },
      { name: "Relayer", value: "relayer" },
    ],
  });

  const attributes: Record<string, boolean | string[]> = {};
  attributesInput.forEach((attr) => {
    attributes[attr] = true;
  });

  if (attributes["relayer"] == true) {
    const settlementLayers = await checkbox({
      message: "Select settlement layers",
      choices: [
        { name: "Same chain", value: "SAME_CHAIN" },
        { name: "Across", value: "ACROSS" },
        { name: "Eco", value: "ECO" },
        { name: "Relay", value: "RELAY" },
      ],
    });
    attributes["relayer"] = settlementLayers;
  }

  const response = await fetch(
    `${apiUrl}/users/project/${projectId}/attributes`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        attributes: { scopes: attributes },
      }),
    },
  );

  if (!response.ok) {
    console.log(await response.json());
    throw new Error(`Error adding user: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
};
