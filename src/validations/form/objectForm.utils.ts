/* eslint-disable @typescript-eslint/no-base-to-string */
/**
 * Classe de utilitário para gerar mensagens de erro relacionadas a validações de objetos.
 */
export class ObjectForm {
  static noUnknown(obj: object): string {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `Devem ter chaves desconhecidas: ${obj}.`
  }
}
