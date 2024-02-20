#!/usr/bin/env bun

import { $ } from "bun"
import pkg from "./package.json"
import { program } from "commander"

Bun.env.FORCE_COLOR = "1"

program
  .name("galbe")
  .description("CLI to execute galbe utilities")
  .version(pkg.version)
  .option("-, --template <string>", "template name", "default")
  .action(async () => {
    await $`echo "Hello from Galbe!"`
  })

program.parse()
