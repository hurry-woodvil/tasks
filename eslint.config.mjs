// @ts-check

import eslint from "@eslint/js";
import angular from "angular-eslint";
import globals from "globals";
import tseslint from "typescript-eslint";

import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "**/dist/**",
    "**/coverage/**",
    "**/.angular/**",
    "**/generated/prisma/**",
    "**/playwright-report/**",
    "**/test-results/**",
    "**/blob-report/**",
  ]),

  /*
   * Frontend: Angular TypeScript
   */
  {
    name: "frontend/typescript",
    files: ["apps/frontend/**/*.ts"],

    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],

    processor: angular.processInlineTemplates,

    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],

      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },

  /*
   * Frontend: Angular HTML templates
   */
  {
    name: "frontend/templates",
    files: ["apps/frontend/**/*.html"],

    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
  },

  /*
   * Backend: NestJS / Node TypeScript
   */
  {
    name: "backend/typescript",
    files: ["apps/backend/src/**/*.ts", "apps/backend/test/**/*.ts"],

    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parserOptions: {
        projectService: true,
      },
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
    },
  },

  /*
   * Backend: Jest
   */
  {
    name: "backend/tests",
    files: ["apps/backend/src/**/*.spec.ts", "apps/backend/test/**/*.ts"],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
]);
