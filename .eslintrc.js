const path = require('path');

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "import",
    "node",
    "promise",
    "standard",
    "vue",
    // "scss",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:node/recommended",
    "plugin:promise/recommended",
    // "plugin:standard/recommended",
    "plugin:vue/recommended",
    // "plugin:scss/recommended",
  ],
  parserOptions: {
    // ecmaVersion: 2021,
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    extraFileExtensions: [".vue"],
  },
  env: {
    node: true,
    es6: true,
    es2021: true,
    jest: true,
    browser: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      alias: {
        map: [["@", path.resolve(__dirname, "src")]],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    "no-console": "warn",
    "no-unused-vars": "off",
    "import/no-default-export": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "node/no-unsupported-features/es-syntax": "off",
    "promise/param-names": "error",
    "promise/catch-or-return": "error",
    "promise/no-nesting": "warn",
    "standard/no-callback-literal": "off",
    "standard/array-bracket-even-spacing": "off",
    "standard/computed-property-even-spacing": "off",
    "node/no-unpublished-import": [
      "error",
      {
        allowModules: ["supertest"],
      },
    ],
  },
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        indent: "off",
        "vue/html-indent": ["error", 2],
        "vue/script-indent": ["error", 2, { baseIndent: 1 }],
        "vue/html-closing-bracket-newline": [
          "error",
          {
            singleline: "never",
            multiline: "always",
          },
        ],
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["error"],
      },
    },
  ],
};
