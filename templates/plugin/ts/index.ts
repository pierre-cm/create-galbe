import type { GalbePlugin } from "galbe"

const plugin: GalbePlugin = {
  name: "com.example.%PROJECT_NAME%",
  init: (config, galbe) => {
    console.log("%PROJECT_NAME% plugin initialization")
  },
}

export default plugin
