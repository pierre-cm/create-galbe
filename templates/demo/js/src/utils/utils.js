export const filterUndef = (obj) => {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    if (v !== undefined) acc[k] = v
    return acc
  }, {})
}
