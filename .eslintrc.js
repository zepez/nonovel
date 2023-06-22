/** @type {import("eslint").Linter.Config} */
const config = {
    extends: ["prettier", "eslint:recommended"],
    overrides: [
      {
        extends: [
          "plugin:@typescript-eslint/recommended",
          "plugin:@typescript-eslint/recommended-requiring-type-checking",
        ],
        files: ["**/*.ts", "**/*.tsx"],
        parserOptions: {
          tsconfigRootDir: __dirname,
          project: [
            "./tsconfig.json",
            "./packages/*/tsconfig.json",
          ],
        },
        rules: {
          quotes: ["error", "double"],
          "@typescript-eslint/no-unused-vars": [
            "error",
            {
              argsIgnorePattern: "^_",
              varsIgnorePattern: "^_",
              caughtErrorsIgnorePattern: "^_",
            },
          ],
          "@typescript-eslint/no-misused-promises": "off",
        },
      },
    ],
    root: true,
    reportUnusedDisableDirectives: true,
    ignorePatterns: [
      ".eslintrc.js",
      "**/*.config.js",
      "**/*.config.cjs",
      "packages/config/**",
    ],
  };
  
  module.exports = config;
  