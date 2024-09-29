import typescriptRules from "@ethberry/eslint-config/presets/tsx.mjs";

// DON'T ADD ANY RULES!
// FIX YOUR SHIT!!!

export default [
  {
    ignores: [
      "**/dist",
      "**/static",
      "**/x-license",
      "framework-contracts"
    ]
  },

  {
    ignores: ["eslint.config.mjs"],
    languageOptions: {
      parserOptions: {
        project: [
          "./tsconfig.eslint.json",
          "./packages/*/tsconfig.eslint.json",
          "./services/*/tsconfig.eslint.json",
          "./microservices/*/tsconfig.eslint.json"
        ],
        tsconfigRootDir: import.meta.dirname
      },
    }
  },

  ...typescriptRules,
];
