// https://docs.expo.dev/guides/using-eslint/
import pluginQuery from "@tanstack/eslint-plugin-query";
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  ...pluginQuery.configs["flat/recommended"],
]);
