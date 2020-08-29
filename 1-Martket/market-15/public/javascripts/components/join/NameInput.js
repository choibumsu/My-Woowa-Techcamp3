import { getSubNodes } from '../../utils/functions.js'
import { isEmpty, checkName } from '../../utils/regex.js'
import { CLASS_NAME } from '../../utils/constants.js'

export default function NameInput({ selector, updateFormValue }) {
  if (new.target !== NameInput) {
    return new NameInput({ selector, updateFormValue })
  }

  this.init = () => {
    this.updateFormValue = updateFormValue
    const { $target, $inputWrapper, $errorNode } = getSubNodes(selector)
    this.$target = $target
    this.$inputWrapper = $inputWrapper
    this.$errorNode = $errorNode
    this.bindEvent()
  }

  this.validate = () => {
    const { value } = this.$target

    this.errorMessage = null
    if (isEmpty(value)) {
      this.errorMessage = '이름을 입력해주세요.'
    } else if (value.length < 2) {
      this.errorMessage = '2자 이상으로 입력해주세요.'
    } else if (checkName(value)) {
      this.errorMessage =
        '이름에 특수문자, 숫자는 입력하실 수 없습니다. 다시 입력해 주세요.'
    }
    if (this.errorMessage) {
      this.renderErrorNode()
      return false
    }

    // success
    this.$inputWrapper.classList.remove(CLASS_NAME.ERROR_CLASS) // error 클래스 남아있을 수 있으니
    return true
  }

  this.bindEvent = () => {
    const onChangeHandler = ({ target }) => {
      if (!target.value.trim()) {
        return
      }
      this.updateFormValue('name', target.value)
    }

    this.$target.addEventListener('change', onChangeHandler)
  }

  this.init()
}
