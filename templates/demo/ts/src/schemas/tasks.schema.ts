import { $T } from "galbe"
import type { Static } from "galbe/schema"

import { PaginationSchema } from "./common.schema"

const TaskID = $T.integer({ description: "Task ID" })
export const TaskSchema = $T.object(
  {
    id: TaskID,
    author: $T.integer(),
    assignee: $T.optional($T.integer()),
    title: $T.string(),
    description: $T.optional($T.string()),
    created: $T.integer(),
  },
  { id: "Task" }
)
export type Task = Static<typeof TaskSchema>

export const CreateTaskSchema = {
  body: $T.object(
    {
      assignee: $T.optional($T.integer()),
      title: $T.string(),
      description: $T.optional($T.string()),
    },
    { id: "CreateTask" }
  ),
}
export type CreateTask = Static<(typeof CreateTaskSchema)["body"]>

export const GetTaskSchema = {
  params: { id: TaskID },
  response: {
    200: TaskSchema,
  },
}

export const UpdateTaskSchema = {
  params: { id: TaskID },
  body: $T.object(
    {
      assignee: $T.optional($T.integer()),
      title: $T.optional($T.string()),
      description: $T.optional($T.string()),
    },
    { id: "UpdateTask" }
  ),
}
export type UpdateTask = Static<(typeof UpdateTaskSchema)["body"]>

export const DeleteTaskSchema = {
  params: { id: TaskID },
}

export const ListTasksSchema = {
  query: {
    limit: $T.optional($T.integer({ min: 1, max: 100, default: 10 })),
    offset: $T.optional($T.integer({ min: 0, default: 0 })),
    assignee: $T.optional($T.union([$T.integer(), $T.literal("null")])),
  },
  response: {
    200: PaginationSchema(TaskSchema),
  },
}
