module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@marubase-tools/recommended",
    "plugin:prettier/recommended",
    "plugin:mocha/recommended",
  ],
  env: { node: true },
  parserOptions: {
    ecmaVersion: "latest",
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
  plugins: ["tsdoc"],
  root: true,
  rules: {
    "mocha/no-setup-in-describe": "off",
    "tsdoc/syntax": "error",
  },
};
