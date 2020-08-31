export const templateToElement = (template: string): HTMLElement => {
  const parser = new DOMParser()

  const $element: HTMLElement = parser.parseFromString(template, 'text/html')
    .body.firstElementChild as HTMLElement
  if ($element) return $element

  return undefined
}
