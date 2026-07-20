import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "max-lines": [
        "error",
        { max: 400, skipBlankLines: true, skipComments: true },
      ],
      "no-console": "error",
      "no-restricted-globals": [
        "error",
        {
          name: "localStorage",
          message: "Use server state or a non-persisted Zustand store.",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSUnknownKeyword",
          message: "Use a precise domain type.",
        },
        {
          selector: "TSAsExpression TSAsExpression",
          message: "Nested type assertions are prohibited.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "dist/**",
    "drizzle/**",
    "next-env.d.ts",
    "notes/**",
    "work/**",
  ]),
]);

export default eslintConfig;
