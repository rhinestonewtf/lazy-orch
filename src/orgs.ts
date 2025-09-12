import { input, select } from "@inquirer/prompts";
import { getUsers } from "./users";

export const addOrg = async ({
  apiUrl,
  apiKey,
}: {
  apiUrl: string;
  apiKey: string;
}) => {
  const name = await input({
    message: "Enter the name of the org:",
  });

  const response = await fetch(`${apiUrl}/users/orgs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      name,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error adding user: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
};

export const addUserToOrg = async ({
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

  const users = await getUsers({
    apiUrl,
    apiKey,
  });
  const userId = await select({
    message: "Select user:",
    choices: users.map((user: any) => {
      return {
        name: user.email,
        value: user.id,
      };
    }),
  });

  const role = await select({
    message: "Choose role:",
    choices: [
      {
        name: "Owner",
        value: "OWNER",
      },
      {
        name: "Admin",
        value: "ADMIN",
      },
      {
        name: "Member",
        value: "MEMBER",
      },
    ],
  });

  const response = await fetch(`${apiUrl}/users/orgs/${orgId}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      orgId,
      userId,
      role,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error adding user: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
};

export const getOrgs = async ({
  apiUrl,
  apiKey,
}: {
  apiUrl: string;
  apiKey: string;
}) => {
  const response = await fetch(`${apiUrl}/users/orgs`, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Error gettings users: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const listOrgs = async ({
  apiUrl,
  apiKey,
}: {
  apiUrl: string;
  apiKey: string;
}) => {
  const data = await getOrgs({ apiKey, apiUrl });
  console.dir(data, { depth: null });
};
