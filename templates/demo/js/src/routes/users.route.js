import jwt, { isAllowed } from "../hooks/jwt.hook"
import { listTasks } from "../services/tasks.svc"
import {
  CreateUserSchema,
  DeleteUserSchema,
  GetUserSchema,
  GetUserTasksSchema,
  ListUsersSchema,
  UpdateUserSchema,
} from "../schemas/users.schema"
import * as svc from "../services/user.svc"

export default (g) => {
  /**
   * Create a new user
   * @operationId createUser
   * @tags users
   */
  g.post("/users", CreateUserSchema, async (ctx) => {
    const inUser = ctx.body
    await svc.createUser(inUser)
    ctx.set.status = 201
  })

  /**
   * Modify a user
   * @operationId updateUser
   * @tags users
   */
  g.put("/users/:id", UpdateUserSchema, [jwt()], async (ctx) => {
    if (
      ctx.state.jwtPayload.id !== ctx.params.id &&
      !isAllowed(ctx.state.jwtPayload, ["users:write"])
    ) {
      return new Response("", { status: 401 })
    }
    await svc.updateUser(ctx.params.id, ctx.body)
  })

  /**
   * List users
   * @operationId listUsers
   * @tags users
   */
  g.get("/users", ListUsersSchema, [jwt({ scope: ["users:list"] })], (ctx) => {
    return {
      ...svc.listUsers({
        offset: 0,
        limit: 10,
        ...ctx.query,
      }),
    }
  })

  /**
   * Get a user
   * @operationId getUser
   * @tags users
   */
  g.get(
    "/users/:id",
    GetUserSchema,
    [jwt({ scope: ["users:read"] })],
    (ctx) => {
      return svc.PublicUser(svc.getUser(ctx.params.id))
    }
  )

  /**
   * Get current user
   * @operationId getCurrentUser
   * @tags users
   */
  g.get("/user", [jwt()], async (ctx) => {
    return svc.PublicUser(svc.getUser(ctx.state.jwtPayload.id))
  })

  /**
   * Delete a user
   * @operationId deleteUser
   * @tags users
   */
  g.delete("/users/:id", DeleteUserSchema, [jwt()], (ctx) => {
    if (
      ctx.state.jwtPayload.id !== ctx.params.id &&
      !isAllowed(ctx.state.jwtPayload, ["users:write"])
    ) {
      return new Response("", { status: 401 })
    }
    svc.deleteUser(ctx.params.id)
  })

  /**
   * Get user's affected tasks
   * @operationId getUserTasks
   * @tags users tasks
   */
  g.get("/users/:id/tasks", GetUserTasksSchema, [jwt()], async (ctx) => {
    if (
      ctx.state.jwtPayload.id !== ctx.params.id &&
      !isAllowed(ctx.state.jwtPayload, ["tasks:list"])
    ) {
      return new Response("", { status: 401 })
    }
    return listTasks({
      assignee: ctx.params.id,
    })
  })

  /**
   * Get current user's affected tasks
   * @operationId getCurrentUserTasks
   * @tags users tasks
   */
  g.get("/user/tasks", [jwt()], async (ctx) => {
    const user = svc.getUser(ctx.state.jwtPayload.id)
    return listTasks({ assignee: user.id })
  })
}
