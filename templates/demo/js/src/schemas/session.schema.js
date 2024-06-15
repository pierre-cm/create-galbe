import { $T } from "galbe"

export const Login = {
  body: $T.object(
    {
      identifier: $T.string({ description: "Username or Email" }),
      password: $T.string({ description: "User password" }),
    },
    { id: "LoginRequest" }
  ),
  response: {
    200: $T.string({ description: "Authentication token" }),
  },
}
