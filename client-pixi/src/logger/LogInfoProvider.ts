import { DOMUtils } from '../utils/DOMUtils'

export class LogInfoProvider {
  private textArea: HTMLTextAreaElement
  private logFilterOption: string = 'Text'

  constructor(textAreaId: string, logFilterId: string) {
    this.textArea = DOMUtils.getElementByIdOrThrow(
      textAreaId,
      'Log text area not available'
    )

    const logFilter = DOMUtils.getElementByIdOrThrow<HTMLSelectElement>(
      logFilterId,
      'Log filter not available'
    )

    logFilter.value = this.logFilterOption
    logFilter.addEventListener('change', () => {
      this.logFilterOption = logFilter.value
    })
  }

  getTextArea(): HTMLTextAreaElement {
    return this.textArea
  }

  getLogFilterOption(): string {
    return this.logFilterOption
  }
}
