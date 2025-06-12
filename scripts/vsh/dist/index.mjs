import { createJiti } from "../../../node_modules/.pnpm/jiti@2.4.2/node_modules/jiti/lib/jiti.mjs";

const jiti = createJiti(import.meta.url, {
  "interopDefault": true,
  "alias": {
    "@vben/vsh": "F:/code/open-oj-ui/scripts/vsh"
  },
  "transformOptions": {
    "babel": {
      "plugins": []
    }
  }
})

/** @type {import("F:/code/open-oj-ui/scripts/vsh/src/index.js")} */
const _module = await jiti.import("F:/code/open-oj-ui/scripts/vsh/src/index.ts");

export default _module?.default ?? _module;