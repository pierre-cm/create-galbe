import { $T } from "galbe"
import type { Static } from "galbe/schema"

import { PaginationSchema } from "./common.schema"
import { TaskSchema } from "./tasks.schema"

const USERNAME_RGX = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/
export const EMAIL_RGX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const nameSchema = $T.string({
  minLength: 3,
  maxLength: 20,
  pattern: USERNAME_RGX,
})
const emailSchema = $T.string({ pattern: EMAIL_RGX, maxLength: 254 })
const passwordSchema = $T.string({ minLength: 8 })

const UserID = $T.integer({ description: "User ID" })

export const UserSchema = $T.object({
  id: UserID,
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})
export const PublicUserSchema = $T.object(
  {
    id: UserID,
    name: nameSchema,
    email: emailSchema,
  },
  { id: "PublicUser" }
)
export type User = Static<typeof UserSchema>

export const CreateUserSchema = {
  body: $T.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
  }),
}
export type CreateUser = Static<(typeof CreateUserSchema)["body"]>

export const GetUserSchema = {
  params: { id: UserID },
  response: {
    200: PublicUserSchema,
  },
}
export const GetUserTasksSchema = {
  params: { id: UserID },
  response: {
    200: PaginationSchema(TaskSchema),
  },
}

export const UpdateUserSchema = {
  params: { id: UserID },
  body: $T.object({
    name: $T.optional(nameSchema),
    password: $T.optional(passwordSchema),
  }),
}
export type UpdateUser = Static<(typeof UpdateUserSchema)["body"]>

export const DeleteUserSchema = {
  params: { id: UserID },
}

export const ListUsersSchema = {
  headers: {
    authorization: $T.string(),
  },
  query: {
    limit: $T.optional($T.integer({ min: 1, max: 100, default: 10 })),
    offset: $T.optional($T.integer({ min: 0, default: 0 })),
  },
  response: {
    200: PaginationSchema(PublicUserSchema),
  },
}
