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
          "./tsconfig.test.json",
          "./packages/*/tsconfig.test.json",
          "./services/*/tsconfig.test.json",
          "./microservices/*/tsconfig.test.json"
        ],
        tsconfigRootDir: import.meta.dirname
      },
    }
  },

  ...typescriptRules,
];
