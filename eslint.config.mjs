import { defineConfig } from "eslint/config"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"

/**
 * Flat ESLint config.
 *
 * Next.js 16 removed `next lint` and the `eslint` option in next.config, so linting
 * now runs through the ESLint CLI directly (`npm run lint`).
 */
export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "scratch/**",
    ],
  },
  {
    // eslint-config-next 16 enables the React Compiler hook rules that ship with
    // eslint-plugin-react-hooks v7. They flag patterns that already existed in this
    // codebase (mount flags written from an effect, a decorative Math.random width and
    // the Embla carousel's initial selection callback). Clearing them means refactoring
    // runtime behaviour of the auth, navigation and generated shadcn/ui code, which is
    // out of scope for a dependency upgrade, so they are surfaced as warnings instead of
    // blocking errors. Follow-up: use useSyncExternalStore / derived state instead of
    // writing state from an effect.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
    },
  },
])
