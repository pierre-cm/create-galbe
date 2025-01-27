import { RequestError } from "galbe"
import db from "../database/db"
import { getUser } from "./user.svc"
import { filterUndef } from "../utils/utils"

const checkAssignee = (id) => {
  if (id !== undefined) {
    try {
      getUser(id)
    } catch (err) {
      if (err instanceof RequestError && err.status === 404)
        throw new RequestError({
          status: 400,
          payload: "Invalid assignee",
        })
      throw err
    }
  }
}

export const getTask = (id) => {
  const stmt = db.query("select * from tasks where id = $id")
  const task = stmt.get({ $id: id })
  if (!task) throw new RequestError({ status: 404, payload: "Not found" })
  return task
}

export const listTasks = (options) => {
  const { offset, limit } = { ...options }
  const assignee = options?.assignee === "null" ? null : options?.assignee
  const totalRecords =
    db
      .prepare(
        `select COUNT(*) as count from tasks ${
          assignee !== undefined ? "where assignee = $assignee" : ""
        }`
      )
      .get(filterUndef({ $assignee: assignee }))?.count || 0
  const totalPages =
    !!totalRecords && !!limit ? Math.ceil(totalRecords / limit) : 1
  const currentPage = !!offset && !!limit ? Math.floor(offset / limit) : 0
  const stmt = db.query(`select * from tasks
    ${assignee !== undefined ? "where assignee = $assignee" : ""}
    ${limit !== undefined ? `limit $limit` : ""}
    ${offset !== undefined ? `offset $offset` : ""}`)
  const tasks = stmt.all(
    filterUndef({
      $limit: limit,
      $offset: offset,
      $assignee: assignee,
    })
  )
  return {
    totalRecords,
    totalPages,
    currentPage,
    records: tasks,
  }
}

export const createTask = async (task, author) => {
  checkAssignee(task.assignee)
  const stmt = db.query(
    "INSERT INTO tasks (title, author, assignee, description) VALUES ($title, $author, $assignee, $description)"
  )
  stmt.run({
    $title: task.title,
    $author: author,
    $description: task.description || "",
    $assignee: task.assignee || null,
  })
}

export const updateTask = async (id, task) => {
  const currentTask = { ...getTask(id), ...task }
  checkAssignee(task.assignee)
  const stmt = db.query(
    "UPDATE tasks SET title = $title, assignee = $assignee, description = $description WHERE id=$id"
  )
  stmt.run({
    $id: currentTask.id,
    $title: currentTask.title,
    $description: currentTask.description || "",
    $assignee: currentTask.assignee || null,
  })
}

export const deleteTask = async (id) => {
  const stmt = db.query("DELETE FROM tasks WHERE id=$id")
  stmt.run({ $id: id })
}
