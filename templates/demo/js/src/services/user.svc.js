import { RequestError } from "galbe"
import db from "../database/db"
import { SQLiteError } from "bun:sqlite"
import { filterUndef } from "../utils/utils"
export const getUser = (id) => {
  const stmt = db.query("select * from users where id = $id")
  const user = stmt.get({
    $id: id,
  })
  if (!user)
    throw new RequestError({
      status: 404,
      payload: "Not found",
    })
  return user
}

export const getUserByNameOrEmail = (identifier) => {
  const user = db
    .prepare("SELECT * FROM users WHERE email = ? OR name = ?")
    .all(identifier, identifier)
  if (!user.length)
    throw new RequestError({
      status: 404,
      payload: "Not found",
    })
  return user[0]
}

export const listUsers = (options) => {
  let { offset, limit } = {
    ...options,
  }
  const totalRecords =
    db.prepare("select COUNT(*) as count from users").get()?.count || 0
  const totalPages =
    !!totalRecords && !!limit ? Math.ceil(totalRecords / limit) : 1
  const currentPage = !!offset && !!limit ? Math.floor(offset / limit) : 0
  const stmt = db.query(`select * from users
    ${limit !== undefined ? `limit $limit` : ""}
    ${offset !== undefined ? `offset $offset` : ""}`)
  const users = stmt
    .all(
      filterUndef({
        $limit: limit,
        $offset: offset,
      })
    )
    .map((u) => PublicUser(u))
  return {
    totalRecords,
    totalPages,
    currentPage,
    records: users,
  }
}

export const createUser = async (user) => {
  const stmt = db.query(
    "INSERT INTO users (name, email, password) VALUES ($name, $email, $password)"
  )
  try {
    stmt.run({
      $name: user.name,
      $email: user.email,
      $password: await Bun.password.hash(user.password),
    })
  } catch (err) {
    if (err instanceof SQLiteError) {
      if (err.code === "SQLITE_CONSTRAINT_UNIQUE")
        throw new RequestError({
          status: 400,
          payload: "This user already exists",
        })
    } else throw err
  }
}

export const updateUser = async (id, user) => {
  const currentUser = {
    ...getUser(id),
    ...user,
  }
  const stmt = db.query(
    "UPDATE users SET name = $name, password = $password WHERE id=$id"
  )
  try {
    stmt.run({
      $id: currentUser.id,
      $name: currentUser.name,
      $password: user.password
        ? await Bun.password.hash(user.password)
        : currentUser.password,
    })
  } catch (err) {
    if (err instanceof SQLiteError) {
      if (err.code === "SQLITE_CONSTRAINT_UNIQUE")
        throw new RequestError({
          status: 400,
          payload: "This user already exists",
        })
    } else throw err
  }
}

export const deleteUser = async (id) => {
  const stmt = db.query("DELETE FROM users WHERE id=$id")
  stmt.run({ $id: id })
}

export const PublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
})
