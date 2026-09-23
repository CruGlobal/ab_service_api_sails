//   ╔═╗╔═╗╦  ╦╔╗╔╔╦╗┬─┐┌─┐
//   ║╣ ╚═╗║  ║║║║ ║ ├┬┘│
//  o╚═╝╚═╝╩═╝╩╝╚╝ ╩ ┴└─└─┘
// Flat config for ESLint v9+. Replaces .eslintrc.js (Sails may still use views/assets overrides).
import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
   // Ignore patterns (replaces .eslintignore)
   { ignores: ["assets/dependencies/**", "views/**/*.ejs", "**/node_modules/**"] },

   js.configs.recommended,

   // Main project: Node + ES2022, Prettier, custom rules
   {
      files: ["**/*.js"],
      languageOptions: {
         ecmaVersion: 2022,
         globals: { ...globals.node, sails: "readonly" },
      },
      plugins: { prettier: eslintPluginPrettier },
      rules: {
         "prettier/prettier": [
            "error",
            {
               arrowParens: "always",
               endOfLine: "lf",
               printWidth: 80,
               tabWidth: 3,
               trailingComma: "all",
            },
         ],
         "no-console": "off", // allow console.log() in our services
      },
   },

   // Prettier disables conflicting rules — must be last
   eslintConfigPrettier,
];
