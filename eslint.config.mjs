import globals from "globals";
import js from "@eslint/js";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import stylisticJsx from "@stylistic/eslint-plugin-jsx";
import stylisticJs from "@stylistic/eslint-plugin-js";
import eslintConfigPrettier from "eslint-config-prettier";
import tsEslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import jestPlugin from "eslint-plugin-jest";
import nodePlugin from "eslint-plugin-n";
import pluginPromise from "eslint-plugin-promise";

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
    rules: {
      ...js.configs.recommended.rules,
      "no-console": [
        "error",
        {
          allow: ["error", "warn", "info"],
        },
      ],
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          args: "after-used",
          vars: "all",
        },
      ],
      "no-void": "off",
    }
  },

  ...tsEslint.configs.recommendedTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,

  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ...tsEslint.configs.disableTypeChecked
  },

  {
    ...pluginPromise.configs["flat/recommended"],
    rules: {
      ...pluginPromise.configs["flat/recommended"].rules,
      "promise/always-return": "off"
    }
  },

  {
    ...nodePlugin.configs["flat/recommended-module"],
    rules: {
      ...nodePlugin.configs["flat/recommended-module"].rules,
      "n/exports-style": ["error", "exports"],
      // https://github.com/eslint-community/eslint-plugin-n/issues/314
      "n/no-missing-import": "off"
    }
  },

  {
    ...jestPlugin.configs["flat/recommended"],
    files: ["**/*.spec.ts"],
    rules: {
      ...jestPlugin.configs["flat/recommended"].rules,
      "jest/no-focused-tests": "error",
      "jest/valid-expect": "error"
    }
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

  {
    files: ["**/*.{ts,tsx,mtsx}"],
    rules: {
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_|NodeJS|ProcessEnv",
          argsIgnorePattern: "^_",
          args: "after-used",
          vars: "all"
        }
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
          filter: {
            match: false,
            regex: "^(ProcessEnv|Window)$"
          }
        }
      ]
    }
  },

  {
    "settings": {
      "react": {
        "version": "detect",
      },
    },
    files: ["**/*.{jsx,mjsx,tsx,mtsx}"],
    ...reactPlugin.configs.flat.recommended,
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  {
    plugins: {
      "@stylistic/js": stylisticJs
    },
    rules: {
      "max-len": [
        "error",
        {
          code: 120,
          ignoreRegExpLiterals: true,
          ignoreTemplateLiterals: true,
          ignorePattern: '^\\s+d="', // ignore path in svg icons
        },
      ],
      "arrow-parens": ["error", "as-needed"],
      "comma-dangle": ["error", "always-multiline"],
      indent: [
        "error",
        2,
        {
          MemberExpression: 1,
          SwitchCase: 1,
        },
      ],
      "linebreak-style": ["error", "unix"],
      "multiline-ternary": ["error", "always-multiline"],
      "no-multiple-empty-lines": [
        "error",
        {
          max: 2,
          maxEOF: 1,
        },
      ],
      "object-curly-spacing": ["error", "never"],
      "operator-linebreak": ["error", "before"],
      quotes: ["error", "double"],
      semi: ["error", "always"]
    },
  },

  {
    plugins: {
      "@stylistic/jsx": stylisticJsx
    },
    rules: {
      "@stylistic/jsx/jsx-indent": ["error", 2]
    }
  },

  {
    plugins: {
      "@stylistic/ts": stylisticTs
    }
  },

  eslintConfigPrettier
];
