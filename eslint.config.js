import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const clientFiles = ["src/client/**/*.{ts,tsx}"];

export default defineConfig(
  globalIgnores(["dist", "node_modules", "data"]),

  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Plain JS files (like this one) are not part of the TypeScript project.
    files: ["**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
  },

  // Client: browser globals, React and hooks rules
  {
    files: clientFiles,
    languageOptions: { globals: globals.browser },
    settings: { react: { version: "detect" } },
  },
  { files: clientFiles, ...react.configs.flat.recommended },
  { files: clientFiles, ...react.configs.flat["jsx-runtime"] },
  { files: clientFiles, ...reactHooks.configs.flat.recommended },
  {
    files: clientFiles,
    rules: {
      // Never inject raw HTML (course requirement R11).
      "react/no-danger": "error",
    },
  },

  // Server, tests and tool configs: Node globals
  {
    files: ["src/server/**/*.ts", "tests/**/*.ts", "*.config.{ts,js}"],
    languageOptions: { globals: globals.node },
  },

  // Must come before our own style rules: eslint-config-prettier turns `curly` off.
  prettier,

  {
    rules: {
      curly: ["error", "all"],
      "arrow-body-style": ["error", "always"],
      eqeqeq: ["error", "always"],
      // Express error handlers need all four parameters, even if `_next` is unused.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
);
