import { Galbe } from "galbe"
import config from "./config"
import swagger from "galbe-swagger"
import { plugin as jwt } from "galbe-jwt"

const galbe = new Galbe(config)

galbe.use(jwt)
galbe.use(swagger)

galbe.get("health", () => {})

export default galbe
