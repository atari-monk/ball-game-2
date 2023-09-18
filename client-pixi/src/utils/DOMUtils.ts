export class DOMUtils {
  static getElementByIdOrThrow<T extends HTMLElement>(
    id: string,
    errorMessage: string
  ): T {
    const element = document.getElementById(id) as T
    if (!element) {
      throw new Error(errorMessage)
    }
    return element
  }
}
