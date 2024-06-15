import { Login } from "../schemas/session.schema"
import { getUserByNameOrEmail, PublicUser } from "../services/user.svc"
import { RequestError } from "galbe"
import { sign } from "../services/jwt.svc"

export default (g) => {
  /**
   * Authentify a user from credentials
   * @operationId login
   * @tags session
   */
  g.post("/login", Login, async (ctx) => {
    let user = null
    try {
      user = getUserByNameOrEmail(ctx.body.identifier)
    } catch (err) {
      if (err instanceof RequestError && err.status === 404)
        return new Response("", { status: 401 })
      throw err
    }
    if (!user) return new Response("", { status: 401 })
    const pwdMatch = await Bun.password.verify(ctx.body.password, user.password)
    if (!pwdMatch) return new Response("", { status: 401 })
    return await sign({ ...PublicUser(user), roles: ["reader", "writer"] })
  })
}
