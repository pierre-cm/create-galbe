import { $T } from "galbe"

export const PaginationSchema = (record) =>
  $T.object({
    totalRecords: $T.integer({ min: 0 }),
    totalPages: $T.integer({ min: 1 }),
    currentPage: $T.integer({ min: 0 }),
    records: $T.array(record),
  })
