import type { PlopTypes } from "@turbo/gen";
import { execSync } from "node:child_process";

export default function (plop: PlopTypes.NodePlopAPI) {
  plop.setActionType("format", (answers) => {
    const contractName = (answers as { contractName?: string }).contractName || "";
    const kebabName = plop.getHelper('kebabCase')(contractName);
    
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
}
