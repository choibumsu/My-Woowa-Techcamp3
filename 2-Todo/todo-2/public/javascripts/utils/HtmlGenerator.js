export const templateToElement = (template) => {
  const parser = new DOMParser()

  return parser.parseFromString(template, 'text/html').body.firstElementChild
}
