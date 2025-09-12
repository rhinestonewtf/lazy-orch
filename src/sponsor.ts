import { input, select } from "@inquirer/prompts";
import { getOrgs } from "./orgs";

export const getSponsor = async ({
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

  const response = await fetch(`${apiUrl}/sponsor/${projectId}`, {
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
  console.log(data);
};
