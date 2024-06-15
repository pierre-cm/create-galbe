import { Database } from "bun:sqlite"
import dbsql from "../../resources/db.sql" with { type: "text"}

const db = new Database(":memory:")
db.run(dbsql)

export default db
