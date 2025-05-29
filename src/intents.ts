import { input } from "@inquirer/prompts";

export const getIntentStatus = async ({
  apiUrl,
  apiKey,
}: {
  apiUrl: string;
  apiKey: string;
}) => {
  const bundleId = await input({
    message: "Whats the bundle id?",
  });

  const response = await fetch(`${apiUrl}/bundles/${bundleId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching intent status: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
