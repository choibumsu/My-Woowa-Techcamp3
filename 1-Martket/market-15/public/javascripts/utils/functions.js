import { CLASS_NAME } from './constants.js'

export const getSubNodes = (selector) => {
  const $target = document.querySelector(selector)
  const $inputWrapper = $target.closest(`.${CLASS_NAME.INPUT_WRAPPER_CLASS}`)
  const $errorNode = $inputWrapper.querySelector(
    `.${CLASS_NAME.ERROR_MESSAGE_CLASS}`
  )
  return {
    $target,
    $inputWrapper,
    $errorNode,
  }
}
