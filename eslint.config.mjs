import nextPlugin from "next/eslint-plugin-next";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["node_modules/**", ".next/**", "out/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      next: nextPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      // Add custom ESLint or TypeScript rules here if desired
    },
  },
];
