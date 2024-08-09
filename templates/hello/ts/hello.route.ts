import { $T, type Galbe } from "galbe"

const schema = {
  query: {
    age: $T.integer({ min: 0 }),
  },
  response: {
    200: $T.string(),
  },
}

export default (g: Galbe) => {
  /**
   * Greeting endpoint
   * @operationId hello
   */
  g.get("/hello/:name", schema, (ctx) => {
    let { name } = ctx.params
    let { age } = ctx.query
    return `Hello ${name}! You're ${age} y.o.`
  })
}
