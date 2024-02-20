#!/usr/bin/env bun

import { $ } from "bun"
import pkg from "./package.json"
import { program } from "commander"
import { readdir } from "fs/promises"

Bun.env.FORCE_COLOR = "1"

const dir = import.meta.dir
const DEFAULT_NAME = "galbe-app"

program
  .name("galbe")
  .description("CLI to execute galbe utilities")
  .version(pkg.version)
  .argument("[path]", "project path", DEFAULT_NAME)
  .option("-t, --template <string>", "template name", "hello")
  .action(async (arg, opt) => {
    const [path, { template }] = [arg, opt]
    const name =
      path === "."
        ? DEFAULT_NAME
        : path.match(/\/?([^/]+)$/)?.[1] || DEFAULT_NAME
    console.log(path, template)
    await $`echo "Hello from Galbe!"`
    console.log(name)

    const templates = await readdir(`${dir}/templates`)
    if (!templates.includes(template)) {
      console.error(`Unknown template '${template}'.`)
      process.exit(1)
    }

    await $`cp -r ${dir}/templates/${template}/. ${path}`
    await $`find . -type f -exec sed -i 's/%PROJECT_NAME%/${name}/g' {} +`
  })

program.parse()
