import type { PlopTypes } from "@turbo/gen";
import { execSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export default function (plop: PlopTypes.NodePlopAPI) {
  plop.setActionType("format", (answers) => {
    const contractName =
      (answers as { contractName?: string }).contractName || "";
    const kebabName = plop.getHelper("kebabCase")(contractName);

    try {
      execSync(`npx prettier --write "contracts/${kebabName}/**/*"`, {
        stdio: "ignore",
        cwd: process.cwd(),
      });
      return `Formatted contracts/${kebabName}`;
    } catch (e) {
      return `Skipped formatting for contracts/${kebabName}`;
    }
  });

  plop.setActionType("install", () => {
    try {
      // Install at root to handle all workspace packages (npm workspaces)
      execSync("npm install");
      return "Installed workspace dependencies";
    } catch (e) {
      return "Skipped install (npm install failed)";
    }
  });

  plop.setGenerator("contract", {
    description: "Generate a new Algorand smart contract package",
    prompts: [
      {
        type: "input",
        name: "contractName",
        message: "Contract name (e.g., hello-world):",
        default: "hello-world",
      },
      {
        type: "input",
        name: "description",
        message: "Description:",
        default: "Smart Contract using Algorand Typescript",
      },
    ],
    actions: [
      {
        type: "add",
        path: "contracts/{{kebabCase contractName}}/src/{{kebabCase contractName}}.algo.ts",
        templateFile: "contract/src/contract.algo.ts.hbs",
      },
      {
        type: "add",
        path: "contracts/{{kebabCase contractName}}/src/{{kebabCase contractName}}.algo.spec.ts",
        templateFile: "contract/src/contract.algo.spec.ts.hbs",
      },
      {
        type: "add",
        path: "contracts/{{kebabCase contractName}}/src/deploy.ts",
        templateFile: "contract/src/deploy.ts.hbs",
      },
      {
        type: "add",
        path: "contracts/{{kebabCase contractName}}/src/{{kebabCase contractName}}.e2e.spec.ts",
        templateFile: "contract/src/contract.e2e.spec.ts.hbs",
      },
      {
        type: "add",
        path: "contracts/{{kebabCase contractName}}/package.json",
        templateFile: "contract/package.json.hbs",
      },
      {
        type: "add",
        path: "contracts/{{kebabCase contractName}}/tsconfig.json",
        templateFile: "contract/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "contracts/{{kebabCase contractName}}/tsconfig.test.json",
        templateFile: "contract/tsconfig.test.json.hbs",
      },
      {
        type: "add",
        path: "contracts/{{kebabCase contractName}}/vitest.config.ts",
        templateFile: "contract/vitest.config.ts.hbs",
      },
      {
        type: "add",
        path: "contracts/{{kebabCase contractName}}/eslint.config.js",
        templateFile: "contract/eslint.config.js.hbs",
      },
      {
        type: "add",
        path: "contracts/{{kebabCase contractName}}/.prettierrc.js",
        templateFile: "contract/.prettierrc.js.hbs",
      },
      {
        type: "add",
        path: "contracts/{{kebabCase contractName}}/.algokit.toml",
        templateFile: "contract/.algokit.toml.hbs",
      },
      {
        type: "add",
        path: "contracts/{{kebabCase contractName}}/README.md",
        templateFile: "contract/README.md.hbs",
      },
      { type: "format" },
      { type: "install" },
    ],
  });

  plop.setGenerator("contract-env-file", {
    description: "Generate environment files for a contract",
    prompts: [
      {
        type: "list",
        name: "target",
        message: "Generate env files for:",
        choices: [
          { name: "A specific contract", value: "single" },
          { name: "All existing contracts", value: "all" },
        ],
      },
      {
        type: "input",
        name: "contractName",
        message: "Contract name (e.g., hello-world):",
        when: (answers: { target?: string }) => {
          return answers.target === "single";
        },
        validate: (value: string) => {
          if (!value) {
            return "Contract name is required";
          }
          const kebabName = plop.getHelper("kebabCase")(value);
          const contractPath = join(process.cwd(), "contracts", kebabName);
          if (!existsSync(contractPath)) {
            return `Contract "${kebabName}" does not exist in contracts/ directory`;
          }
          return true;
        },
      },
      {
        type: "checkbox",
        name: "networks",
        message: "Which network environment files would you like to generate?",
        choices: [
          { name: "localnet", checked: true },
          { name: "testnet", checked: false },
          { name: "mainnet", checked: false },
          { name: "custom", checked: false },
        ],
        validate: (value: string[]) => {
          if (!value || value.length === 0) {
            return "Please select at least one network";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "customNetworkName",
        message: "Custom network name:",
        when: (answers: { networks?: string[] }) => {
          return answers.networks?.includes("custom") ?? false;
        },
        validate: (value: string) => {
          if (!value || value.trim() === "") {
            return "Custom network name is required";
          }
          return true;
        },
      },
    ],
    actions: (answers) => {
      const actions: PlopTypes.ActionType[] = [];
      const networks = (answers?.networks as string[]) || [];
      const target = answers?.target as string;
      const customNetworkName = answers?.customNetworkName as
        | string
        | undefined;

      // Helper function to generate actions for a single contract
      const generateActionsForContract = (contractName: string) => {
        const kebabName = plop.getHelper("kebabCase")(contractName);

        // Generate localnet env file
        if (networks.includes("localnet")) {
          actions.push({
            type: "add",
            path: `contracts/${kebabName}/.env.localnet`,
            templateFile: "contract-env-file/.env.localnet.hbs",
          });
        }

        // Generate testnet env file
        if (networks.includes("testnet")) {
          actions.push({
            type: "add",
            path: `contracts/${kebabName}/.env.testnet`,
            templateFile: "contract-env-file/.env.testnet.hbs",
          });
        }

        // Generate mainnet env file
        if (networks.includes("mainnet")) {
          actions.push({
            type: "add",
            path: `contracts/${kebabName}/.env.mainnet`,
            templateFile: "contract-env-file/.env.mainnet.hbs",
          });
        }

        // Generate custom network env file
        if (networks.includes("custom") && customNetworkName) {
          actions.push({
            type: "add",
            path: `contracts/${kebabName}/.env.${customNetworkName}`,
            templateFile: "contract-env-file/.env.custom.hbs",
            data: {
              customNetworkName,
            },
          });
        }
      };

      if (target === "single") {
        // Generate for a specific contract
        const contractName = answers?.contractName as string;
        generateActionsForContract(contractName);
      } else if (target === "all") {
        // Generate for all existing contracts
        const contractsPath = join(process.cwd(), "contracts");
        if (existsSync(contractsPath)) {
          const contractDirs = readdirSync(contractsPath).filter((dir) => {
            const dirPath = join(contractsPath, dir);
            return statSync(dirPath).isDirectory();
          });

          contractDirs.forEach((contractDir) => {
            generateActionsForContract(contractDir);
          });
        }
      }

      return actions;
    },
  });
}
