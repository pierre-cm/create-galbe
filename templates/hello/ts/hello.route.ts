import { $T, type Galbe } from "galbe"

const schema = {
  query: {
    name: $T.optional($T.string({ minLength: 3 })),
  },
}

export default (g: Galbe) => {
  g.get("/hello", schema, (ctx) => {
    let { name } = ctx.query
    return name ? `Hello ${name}!` : "Hello from Galbe!"
  })
}
