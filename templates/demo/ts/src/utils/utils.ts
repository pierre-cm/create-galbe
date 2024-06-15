export const filterUndef = (obj: Record<string, any>) => {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    if (v !== undefined) acc[k] = v
    return acc
  }, {} as typeof obj)
}
