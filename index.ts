#!/usr/bin/env bun

import { $ } from "bun"
import pkg from "./package.json"
import { cp } from "fs/promises"
import { program } from "commander"
import prompts from "prompts"
import { existsSync, statSync } from "fs"

const NAME_RGX = /^[a-z0-9][a-z0-9-]*$/

const templates = {
  hello: {
    description: "Minimal hello world project",
    defaultName: "galbe-app",
  },
  demo: {
    description: "Demo app showcasing Galbe's features",
    defaultName: "galbe-app",
  },
  plugin: {
    description: "Plugin skeleton",
    defaultName: "galbe-plugin",
  },
}
const languages = {
  ts: {
    name: "\x1b[38;2;45;120;200mtypeScript\x1b[0m",
  },
  js: {
    name: "\x1b[38;2;240;220;80mjavaScript\x1b[0m",
  },
}

program
  .name("galbe")
  .description("CLI to setup a galbe project or plugin")
  .version(pkg.version)
  .argument("[path]", "project path")
  .option("-t, --template <string>", "template name")
  .option(`-l, --lang <string>", "language (${languages})`)
  .action(async (arg, opt) => {
    let [path, { template, lang }] = [arg, opt]

    if (!(template in templates)) {
      template = (
        await prompts(
          {
            type: "select",
            name: "template",
            message: "Select a template",
            choices: Object.entries(templates).map(
              ([name, { description }]) => ({
                title: name,
                description,
                value: name,
                short: name,
              })
            ),
          },
          {
            onCancel: () => {
              process.exit(1)
            },
          }
        )
      ).template
    }

    if (!(lang in languages)) {
      lang = (
        await prompts(
          {
            type: "select",
            name: "lang",
            message: "Select a language",
            choices: Object.entries(languages).map(([short, { name }]) => ({
              title: name,
              value: short,
              short,
            })),
          },
          {
            onCancel: () => {
              process.exit(1)
            },
          }
        )
      ).lang
    }

    let defaultName = templates[template as keyof typeof templates].defaultName
    if (!path) path = `./${defaultName}`
    let name: string =
      path === "."
        ? defaultName
        : path?.match(/\/?([^/]+)$/)?.[1] || defaultName
    if (path !== "." && existsSync(path) && statSync(path).isDirectory()) {
      path = `${path}/${defaultName}`
      name = defaultName
    }
    name = name.toLowerCase()
    if (!NAME_RGX.test(name)) {
      console.error(`error: invalid name '${name}'`)
      process.exit(1)
    }

    await cp(`${__dirname}/templates/${template}/${lang}`, path, {
      recursive: true,
    })
    await $`find ${path} -type f -exec sed -i 's/%PROJECT_NAME%/${name}/g' {} +`
  })

program.parse()
