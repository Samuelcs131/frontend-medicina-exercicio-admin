export interface ICustomError extends Error {
  response: {
    data: unknown
    status: number
  }
}
