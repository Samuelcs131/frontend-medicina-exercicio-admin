/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Classe de utilitário para gerar mensagens de erro relacionadas a datas.
 */
export class DateForm {
  static min(min: any): string {
    return `Deve ser posterior a ${min}.`
  }

  static max(max: any): string {
    return `Deve ser anterior a ${max}.`
  }

  static date() {
    return 'Deve ser uma data válida'
  }
}
