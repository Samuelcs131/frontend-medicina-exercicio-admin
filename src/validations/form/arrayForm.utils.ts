/**
 * Classe de utilitário para gerar mensagens de erro relacionadas a arrays.
 */
export class ArrayForm {
  static min(min: number): string {
    return `Deve ter pelo menos ${min} ${min === 1 ? 'item' : 'itens'}.`
  }

  static max(max: number): string {
    return `Deve ter no máximo ${max} ${max === 1 ? 'item' : 'itens'}.`
  }

  static range(min: number, max: number): string {
    return `Deve ter no mínimo ${min} e no máximo ${max} itens`
  }
}
