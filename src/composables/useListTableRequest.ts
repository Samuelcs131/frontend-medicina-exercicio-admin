import { ref } from 'vue'
import type { QTableProps } from 'quasar'
import requester from 'src/helpers/requester/Requester.helper'
import type { IListResponse } from 'src/types/api/IListResponse.type'
import { tableSortToApi } from 'src/utils/listQuery.util'
import type { IListQuery } from 'src/utils/listQuery.util'

type RequestProps = Parameters<NonNullable<QTableProps['onRequest']>>[0]

export function useListTableRequest<T>(options: {
  defaultOrdertype: string
  allowedOrdertypes?: string[]
  defaultDescending?: boolean
  initialRowsPerPage?: number
  loaderListId: string
  fetchPage: (q: IListQuery) => Promise<IListResponse<T>>
  applyResponse: (res: IListResponse<T>) => void
}) {
  const tableLoading = ref(false)
  const filter = ref('')
  const pagination = ref({
    sortBy: options.defaultOrdertype,
    descending: options.defaultDescending ?? true,
    page: 1,
    rowsPerPage: options.initialRowsPerPage ?? 40,
    rowsNumber: 0,
  })

  function normalizeSortBy(sortBy: string | null | undefined): string {
    if (!sortBy) return ''
    if (!options.allowedOrdertypes?.length) return sortBy
    return options.allowedOrdertypes.includes(sortBy)
      ? sortBy
      : options.defaultOrdertype
  }

  function buildQueryFromUi(
    props: RequestProps,
  ): { filterStr: string; query: IListQuery } {
    const { page, rowsPerPage, sortBy, descending } = props.pagination
    const filterStr =
      typeof props.filter === 'string'
        ? props.filter
        : props.filter != null
          ? String(props.filter)
          : ''

    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    const normalizedSortBy = normalizeSortBy(sortBy)
    pagination.value.sortBy = normalizedSortBy
    pagination.value.descending = descending

    const { ordertype, orderby } = tableSortToApi(
      normalizedSortBy,
      descending,
      options.defaultOrdertype,
    )

    return {
      filterStr,
      query: {
        page: pagination.value.page,
        limit: pagination.value.rowsPerPage,
        search: filterStr,
        orderby,
        ordertype,
      },
    }
  }

  async function onRequest(props: RequestProps) {
    const { query } = buildQueryFromUi(props)
    tableLoading.value = true
    try {
      await requester.dispatch({
        callback: async () => {
          const res = await options.fetchPage(query)
          options.applyResponse(res)
          pagination.value.rowsNumber = res.pagination.total
          pagination.value.page = res.pagination.currentPage
          pagination.value.rowsPerPage = res.pagination.limit
        },
        errorMessageTitle: 'Houve um erro',
        errorMessage: 'Não foi possível buscar os dados',
        loaders: [options.loaderListId],
      })
    } finally {
      tableLoading.value = false
    }
  }

  async function refreshCurrentPage() {
    const normalizedSortBy = normalizeSortBy(pagination.value.sortBy)
    pagination.value.sortBy = normalizedSortBy
    const { ordertype, orderby } = tableSortToApi(
      normalizedSortBy,
      pagination.value.descending,
      options.defaultOrdertype,
    )
    const q: IListQuery = {
      page: pagination.value.page,
      limit: pagination.value.rowsPerPage,
      search: filter.value,
      orderby,
      ordertype,
    }
    tableLoading.value = true
    try {
      await requester.dispatch({
        callback: async () => {
          const res = await options.fetchPage(q)
          options.applyResponse(res)
          pagination.value.rowsNumber = res.pagination.total
          pagination.value.page = res.pagination.currentPage
          pagination.value.rowsPerPage = res.pagination.limit
        },
        errorMessageTitle: 'Houve um erro',
        errorMessage: 'Não foi possível buscar os dados',
        loaders: [options.loaderListId],
      })
    } finally {
      tableLoading.value = false
    }
  }

  return {
    filter,
    pagination,
    tableLoading,
    onRequest,
    refreshCurrentPage,
  }
}
