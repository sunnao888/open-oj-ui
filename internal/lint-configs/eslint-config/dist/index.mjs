import { createJiti } from "../../../../node_modules/.pnpm/jiti@2.4.2/node_modules/jiti/lib/jiti.mjs";

const jiti = createJiti(import.meta.url, {
  "interopDefault": true,
  "alias": {
    "@vben/eslint-config": "F:/code/open-oj-ui/internal/lint-configs/eslint-config"
  },
  "transformOptions": {
    "babel": {
      "plugins": []
    }
  }
})

/** @type {import("F:/code/open-oj-ui/internal/lint-configs/eslint-config/src/index.js")} */
const _module = await jiti.import("F:/code/open-oj-ui/internal/lint-configs/eslint-config/src/index.ts");

export const defineConfig = _module.defineConfig;