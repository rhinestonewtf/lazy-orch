import { input } from "@inquirer/prompts";

export const getIntentStatus = async ({
  apiUrl,
  apiKey,
}: {
  apiUrl: string;
  apiKey: string;
}) => {
  const intentId = await input({
    message: "Enter intent operation ID:",
  });

  const response = await fetch(
    `${apiUrl}/intent-operation/${intentId}?full=true`,
    {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    }
  );

  if (!response.ok) {
    console.log(await response.json());
    throw new Error(`Error getting intent status: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
};
