/** @type {import('prettier').Config} */
const config = {
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  importOrder: [
    "^react",
    "^next",
    "<THIRD_PARTY_MODULES>",
    "^@/components/(.*)$",
    "^@/lib/(.*)$",
    "^@/styles/(.*)$",
    "^@/app/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

module.exports = config;
