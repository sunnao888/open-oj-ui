const { createJiti } = require("../../../node_modules/.pnpm/jiti@2.4.2/node_modules/jiti/lib/jiti.cjs")

const jiti = createJiti(__filename, {
  "interopDefault": true,
  "alias": {
    "@vben/tailwind-config": "/Users/sunn/code/self/open-oj/open-oj-admin/internal/tailwind-config"
  },
  "transformOptions": {
    "babel": {
      "plugins": []
    }
  }
})

/** @type {import("/Users/sunn/code/self/open-oj/open-oj-admin/internal/tailwind-config/src/postcss.config.js")} */
module.exports = jiti("/Users/sunn/code/self/open-oj/open-oj-admin/internal/tailwind-config/src/postcss.config.ts")