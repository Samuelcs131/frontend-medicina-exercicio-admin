/**
 * Classe de utilitário para gerar mensagens de erro relacionadas a enumerações.
 */

export class EnumForm {
  static formattedString<T>(enumOptions: T) {
    const enumOptionsData = []

    for (const key in enumOptions) {
      if (isNaN(Number(key))) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        enumOptionsData.push(`${key}: ${enumOptions[key]}`)
      }
    }

    const value = enumOptionsData.slice(0, 3).toString().replace(/,/g, ', ')

    const moreEnumOptions = enumOptionsData.length > 2

    return { value, moreEnumOptions }
  }

  static enum<T>(enumOptions: T): string {
    const { value, moreEnumOptions } = this.formattedString(enumOptions)

    return `Deve corresponder as opções (${value}${
      moreEnumOptions ? ', ...)' : ')'
    }`
  }
}
