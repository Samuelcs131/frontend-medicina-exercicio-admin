export interface IListPagination {
  total: number
  totalPages: number
  currentPage: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface IListResponse<T> {
  data: T[]
  pagination: IListPagination
}
