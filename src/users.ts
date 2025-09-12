import { input } from "@inquirer/prompts";

export const addUser = async ({
  apiUrl,
  apiKey,
}: {
  apiUrl: string;
  apiKey: string;
}) => {
  const email = await input({
    message: "Enter the email:",
  });

  const response = await fetch(`${apiUrl}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      email,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error adding user: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
};

export const getUsers = async ({
  apiUrl,
  apiKey,
}: {
  apiUrl: string;
  apiKey: string;
}) => {
  const response = await fetch(`${apiUrl}/users`, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    console.log(await response.json());
    throw new Error(`Error gettings users: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const listUsers = async ({
  apiUrl,
  apiKey,
}: {
  apiUrl: string;
  apiKey: string;
}) => {
  const data = await getUsers({
    apiUrl,
    apiKey,
  });
  console.dir(data, { depth: null });
};
