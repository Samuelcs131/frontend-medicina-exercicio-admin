export interface IPaginationResult<T> {
  page: number
  rowsPerPage: number
  totalRows: number
  data: T[]
}
