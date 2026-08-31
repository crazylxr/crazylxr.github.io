import eslint from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import astro from "eslint-plugin-astro";
import globals from "globals";

export default [
  {
    ignores: [
      ".astro/**",
      ".husky/**",
      ".vscode/**",
      "dist/**",
      "node_modules/**",
      "public/**",
    ],
  },
  eslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  ...astro.configs["flat/recommended"],
];
