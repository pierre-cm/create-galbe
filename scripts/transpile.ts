import { resolve } from "path"
import { readdirSync, readFileSync, statSync, mkdirSync } from "fs"
import { Glob } from "bun"
import { transformSync } from "@swc/core"

const templatesPath = resolve(import.meta.dir, "..", "templates")

const templates = readdirSync(templatesPath).filter((f) =>
  statSync(`${templatesPath}/${f}`).isDirectory()
)

for (const template of templates) {
  let tPath = `${templatesPath}/${template}/ts`
  let glob = new Glob("**/*").scan({
    cwd: tPath,
    onlyFiles: true,
  })
  mkdirSync(`${templatesPath}/${template}/js`, { recursive: true })

  for await (let p of glob) {
    let ap = `${tPath}/${p}`

    if (
      p.match(/^node_modules\//) ||
      p.match(/^bun\.lockb\//) ||
      p.match(/\.d\.ts$/) ||
      p.match(/tsconfig\.json$/)
    ) {
      continue
    }

    if (p.match(/\.ts$/)) {
      let res = transformSync(readFileSync(ap, "utf-8"), {
        jsc: {
          parser: {
            syntax: "typescript",
          },
          preserveAllComments: true,
          target: "esnext",
          experimental: {
            keepImportAttributes: true,
          },
        },
      }).code.replaceAll(/\/\/@ts-ignore/g, "")
      await Bun.write(
        `${templatesPath}/${template}/js/${p.replace(/\.ts$/, ".js")}`,
        res
      )
    } else {
      let content = readFileSync(ap, "utf-8")
      if (["package.json", "README.md"].includes(p)) {
        content = content.replaceAll(/\.ts/g, ".js")
      }
      await Bun.write(`${templatesPath}/${template}/js/${p}`, content)
    }
  }
}
