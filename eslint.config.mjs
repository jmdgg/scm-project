// Lints the static site in site/. Run: npx eslint@10.13.0 site
export default [
  {
    files: ["site/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      // shortcut: browser globals listed by hand, switch to the `globals` package if the site grows
      globals: { document: "readonly", localStorage: "readonly", window: "readonly" },
    },
    rules: {
      semi: ["error", "always"],
      "no-undef": "error",
      "no-unused-vars": "error",
      eqeqeq: "error",
    },
  },
];
