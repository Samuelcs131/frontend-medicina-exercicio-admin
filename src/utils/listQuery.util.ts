export type OrderBy = 'asc' | 'desc'

export interface IListQuery {
  all?: boolean
  page: number
  limit: number
  search?: string
  orderby: OrderBy
  ordertype: string
  [key: string]: string | number | boolean | undefined
}

/** Parâmetros extras (ex.: specialtyId) enviados na query string. */
export function buildListParams(
  base: IListQuery,
  extra?: Record<string, string | number | boolean | null | undefined>,
): Record<string, string | number | boolean> {
  const p: Record<string, string | number | boolean> = {
    all: base.all ?? true,
    page: base.page,
    limit: base.limit,
    orderby: base.orderby,
    ordertype: base.ordertype,
  }
  const s = base.search?.trim()
  if (s) p.search = s

  const standardKeys = new Set([
    'all',
    'page',
    'limit',
    'search',
    'orderby',
    'ordertype',
  ])

  for (const [key, value] of Object.entries(base)) {
    if (standardKeys.has(key)) continue
    if (value !== undefined && value !== null && value !== '') p[key] = value
  }

  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v !== undefined && v !== null && v !== '') p[k] = v
    }
  }
  return p
}

export function tableSortToApi(
  sortBy: string | null | undefined,
  descending: boolean,
  defaultOrdertype: string,
): { ordertype: string; orderby: OrderBy } {
  return {
    ordertype: sortBy || defaultOrdertype,
    orderby: descending ? 'desc' : 'asc',
  }
}
