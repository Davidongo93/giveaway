import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": ["error"],
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": ["error"],
      "no-redeclare": "off",
      "@typescript-eslint/no-redeclare": ["error"],
      "no-undef": "off",
    },
  },
];

export default eslintConfig;
