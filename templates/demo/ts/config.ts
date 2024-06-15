import type { GalbeConfig } from "galbe"
import pckg from "./package.json"

// See https://galbe.dev/documentation/getting-started#configuration
const config: GalbeConfig = {
  port: 3000,
  routes: "src/**/*.route.{ts,js}",
  responseValidator: {
    enabled: false,
  },
  plugin: {
    // See https://galbe.dev/plugins/swagger
    swagger: {
      enabled: Bun.env.BUN_ENV === "development",
      auto: true,
      spec: {
        info: {
          title: "Galbe demo",
          description: pckg.description,
          version: pckg.version,
        },
      },
    },
  },
}

export default config
