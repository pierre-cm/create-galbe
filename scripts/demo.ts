import { generateKeyPair } from "crypto"
import { writeFileSync } from "fs"

export default (
  _templateDir: string,
  targetDir: string,
  _lang: "js" | "tst"
) => {
  generateKeyPair(
    "rsa",
    {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    },
    (err, publicKey, privateKey) => {
      if (err) {
        console.error("Error generating key pair:", err)
        return
      }
      writeFileSync(`${targetDir}/resources/private_key.pem`, privateKey)
      writeFileSync(`${targetDir}/resources/public_key.pem`, publicKey)
    }
  )
}
