import { importSPKI } from "jose"
import { load as loadYml } from "js-yaml"
import { hook as jwtHook } from "galbe-jwt"
import spki from "../../resources/public_key.pem" with {type: "text"}
import rbac_txt from "../../resources/rbac.yaml" with {type: "text"}

const rbac = loadYml(rbac_txt)
const alg = "RS256"
const publicKey = await importSPKI(spki, alg)
const hook = jwtHook({
  publicKey,
})

const extendedPermissions = (permission) => {
  let permissions = new Set([permission])
  let rp = rbac?.permissions?.[permission]
  for (let e of rp?.extends || [])
    for (let ep of extendedPermissions(e)) permissions.add(ep)
  return permissions
}

export const isAllowed = (payload, scope) => {
  let completeScope = scope.reduce((cs, s) => {
    if (!s.includes(":")) s = `${s}:*`
    s = s.replace("*", ".*")
    let matched = false
    for (let [p, _pd] of Object.entries(rbac?.permissions) || []) {
      if (p.match(new RegExp(`^${s}$`))) {
        matched = true
        cs.add(p)
      }
    }
    if (!matched) cs.add(s)
    return cs
  }, new Set([]))
  let permissions = payload?.roles
    ? payload.roles.reduce(
        //@ts-ignore
        (p, r) => p.union(new Set(rbac?.roles?.[r]?.permissions || [])),
        new Set(payload?.permissions || [])
      )
    : new Set(payload?.permissions || [])
  let completePermissions = [...permissions].reduce((cp, p) => {
    if (!p.includes(":")) p = `${p}:*`
    p = p.replace("*", ".*")
    let matched = false
    for (let [rp, rpd] of Object.entries(rbac?.permissions) || []) {
      if (rp.match(new RegExp(`^${p}$`))) {
        matched = true
        for (let ep of extendedPermissions(rp)) cp.add(ep)
        if (rpd?.extends?.length) for (let e of rpd?.extends) cp.add(e)
      }
    }
    if (!matched) cp.add(p)
    return cp
  }, new Set([]))
  for (let s of completeScope) {
    let allowed = false
    for (let p of completePermissions) if (s === p) allowed = true
    if (!allowed) {
      return false
    }
  }
  return true
}

export default (config) => {
  const { scope } = config || {}
  return hook({
    ...config,
    validate: (payload) =>
      isAllowed(payload, scope || []) &&
      (config?.validate ? config.validate(payload) : true),
  })
}
