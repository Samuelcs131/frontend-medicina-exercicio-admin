import { useQuasar } from 'quasar'

export function useQuasarLangComponents() {
  const { lang } = useQuasar()

  function setupLangComponents() {
    lang.table.allRows = 'Todos'
    lang.table.noData = 'Sem dados'
    lang.table.noResults = 'Sem resultados'
    lang.table.pagination = pagination
    lang.table.selectedRecords = selectedRecords
    lang.table.recordsPerPage = 'Itens por página'
    lang.table.loading = 'Carregando'

    lang.tree.noResults = 'Sem resultados'
  }

  function pagination(start: number, end: number, total: number) {
    return `${start} - ${end} de ${total}`
  }

  function selectedRecords(rows: number) {
    const plural = rows === 1 ? 'item selecionado' : 'items selecionados'
    return `${rows} ${plural}`
  }

  return {
    setupLangComponents,
  }
}
