import { $T } from "galbe"
import type { STSchema } from "galbe/schema"

export const PaginationSchema = (record: STSchema) =>
  $T.object({
    totalRecords: $T.integer({ min: 0 }),
    totalPages: $T.integer({ min: 1 }),
    currentPage: $T.integer({ min: 0 }),
    records: $T.array(record),
  })
