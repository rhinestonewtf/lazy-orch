import { checkbox, input } from "@inquirer/prompts";

export const addUser = async ({
  apiUrl,
  apiKey,
}: {
  apiUrl: string;
  apiKey: string;
}) => {
  const name = await input({
    message: "Enter the username:",
  });
  const attributesInput = await checkbox({
    message: "Select user attributes (optional)",
    choices: [
      { name: "Event publisher", value: "event-publisher" },
      { name: "Relayer", value: "relayer" },
    ],
  });

  const attributes: Record<string, boolean> = {};
  attributesInput.forEach((attr) => {
    attributes[attr] = true;
  });

  const response = await fetch(`${apiUrl}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      name,
      attributes: { scopes: attributes },
    }),
  });

  if (!response.ok) {
    throw new Error(`Error adding user: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
};
