import type { Galbe } from "galbe"
import jwt, { isAllowed } from "../hooks/jwt.hook"
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  ListTasksSchema,
  GetTaskSchema,
  DeleteTaskSchema,
} from "../schemas/tasks.schema"
import * as svc from "../services/tasks.svc"

export default (g: Galbe) => {
  /**
   * Create a new task
   * @operationId createTask
   * @tags tasks
   */
  g.post("/tasks", CreateTaskSchema, [jwt()], async (ctx) => {
    await svc.createTask(ctx.body, ctx.state.jwtPayload.id)
    ctx.set.status = 201
  })

  /**
   * Modify a task
   * @operationId updateTask
   * @tags tasks
   */
  g.put("/tasks/:id", UpdateTaskSchema, [jwt()], async (ctx) => {
    const task = svc.getTask(ctx.params.id)
    if (
      ![task.author, task.assignee].includes(ctx.params.id) &&
      !isAllowed(ctx.state.jwtPayload, ["tasks:write"])
    ) {
      return new Response("", { status: 401 })
    }
    await svc.updateTask(ctx.params.id, ctx.body)
  })

  /**
   * List tasks
   * @operationId listTasks
   * @tags tasks
   */
  g.get("/tasks", ListTasksSchema, [jwt({ scope: ["tasks:list"] })], (ctx) => {
    return svc.listTasks({ offset: 0, limit: 10, ...ctx.query })
  })

  /**
   * Get a task
   * @operationId getTask
   * @tags tasks
   */
  g.get(
    "/tasks/:id",
    GetTaskSchema,
    [jwt({ scope: ["tasks:read"] })],
    (ctx) => {
      return svc.getTask(ctx.params.id)
    }
  )

  /**
   * Delete a task
   * @operationId deleteTask
   * @tags tasks
   */
  g.delete("/tasks/:id", DeleteTaskSchema, [jwt()], (ctx) => {
    if (
      ctx.state.jwtPayload.id !== ctx.params.id &&
      !isAllowed(ctx.state.jwtPayload, ["tasks:write"])
    ) {
      return new Response("", { status: 401 })
    }
    svc.deleteTask(ctx.params.id)
  })
}
