import { templateToElement } from '../utils/ElementGenerator'

function $if(name, value = undefined) {
  if (value === undefined) return ''
  else return `${name}="${value}"`
}
function createSVGLine({
  id = undefined,
  className = undefined,
  x1,
  x2,
  y1,
  y2,
}) {
  return `<line ${$if('id', id)} ${$if(
    'class',
    className
  )} x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}"></line>`
}
function createSVGText({
  id = undefined,
  className = undefined,
  x,
  y,
  text = undefined,
}) {
  return `<text ${$if(
    'class',
    className
  )} id="${id}" x="${x}" y="${y}">${text}</text>`
}

function createSVGCircle({ id = undefined, className = undefined, cx, cy }) {
  return `<circle ${$if('class', className)} ${$if(
    'id',
    id
  )} cx="${cx}" cy="${cy}"></circle>`
}

function setText(element: HTMLElement, query: string, text: string | number) {
  const target = <HTMLDivElement>element.querySelector(query)
  target.innerText = String(text)
}

function getText(element: HTMLElement, query: string) {
  const target = <HTMLDivElement>element.querySelector(query)
  return target.innerText
}
function removeElement(element: Element) {
  element.parentElement.removeChild(element)
}

function getSibling(element: Element) {
  return element.parentElement.children
}
abstract class View {
  $element: HTMLElement
  constructor(template: string) {
    this.$element = templateToElement(template) as HTMLElement
    this.mount()
  }
  appendToElement($element: HTMLElement) {
    $element.appendChild(this.$element)
  }
  prependToView(view: View) {
    view.$element.prepend(this.$element)
  }
  appendToView(view: View) {
    this.appendToElement(view.$element)
  }
  remove() {
    const $parentElement = this.$element.parentElement
    if (!$parentElement) return
    $parentElement.removeChild(this.$element)
  }
  query(query: string) {
    return this.$element.querySelector(query)
  }
  queryAll(query: string) {
    return this.$element.querySelectorAll(query)
  }
  clear() {}
  hide() {
    this.$element.classList.add('hidden')
  }
  show() {
    this.$element.classList.remove('hidden')
  }
  abstract mount(): void
}

export {
  setText,
  getText,
  removeElement,
  getSibling,
  $if,
  createSVGLine,
  createSVGText,
  createSVGCircle,
  View,
}
