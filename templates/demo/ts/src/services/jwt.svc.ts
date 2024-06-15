import { SignJWT, importPKCS8, type JWTPayload } from "jose"
import pkcs8 from "../../resources/private_key.pem" with {type:"text"}

const alg = "RS256"
const privateKey = await importPKCS8(pkcs8, alg)

export const sign = async (payload: JWTPayload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("urn:galbe:issuer")
    .setExpirationTime("2h")
    .sign(privateKey)
}
