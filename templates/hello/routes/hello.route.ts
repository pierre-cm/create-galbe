import type { Galbe } from "galbe"

export default (g: Galbe) => {
  g.get("/hello", () => "Hello from Galbe!")
}
