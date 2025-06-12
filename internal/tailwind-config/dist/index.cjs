const { createJiti } = require("../../../node_modules/.pnpm/jiti@2.4.2/node_modules/jiti/lib/jiti.cjs")

const jiti = createJiti(__filename, {
  "interopDefault": true,
  "alias": {
    "@vben/tailwind-config": "F:/code/open-oj-ui/internal/tailwind-config"
  },
  "transformOptions": {
    "babel": {
      "plugins": []
    }
  }
})

/** @type {import("F:/code/open-oj-ui/internal/tailwind-config/src/index.js")} */
module.exports = jiti("F:/code/open-oj-ui/internal/tailwind-config/src/index.ts")