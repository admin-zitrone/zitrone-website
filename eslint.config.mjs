import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Keep lint focused on authored application and design-system source.
  globalIgnores([
    ".claude/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "References/**",
    "docs/**",
    "preview/**",
    "public/**",
    "scripts/**",
    // Payload migrations are generated historical snapshots; lint authored
    // application code, while TypeScript still type-checks these files.
    "src/migrations/**",
    "deck-system/**",
    "playwright-report/**",
    "test-results/**",
    "*.html",
    "tsconfig.tsbuildinfo",
  ]),
]);

export default eslintConfig;
