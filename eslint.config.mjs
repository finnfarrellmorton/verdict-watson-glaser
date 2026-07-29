import next from "eslint-config-next";

const config = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "agency-agents/**", "*.js"]
  }
];

export default config;
