import { $T } from "galbe"

const schema = {
  query: {
    age: $T.number({ min: 0 }),
  },
  response: {
    200: $T.string(),
  },
}

export default (g) => {
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
