import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser }},
  {rules: {
    "no-unused-vars": "warn",
    "no-undef": "warn",
  }},
  {
    ignores: ["dist"]
  }
];