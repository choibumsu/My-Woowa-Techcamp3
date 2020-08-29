import { isEmpty } from '../../utils/regex.js'
import { CLASS_NAME } from '../../utils/constants.js'
import { getSubNodes } from '../../utils/functions.js'

export default function EmailPrefixInput({ selector, updateFormValue }) {
  if (new.target !== EmailPrefixInput) {
    return new EmailPrefixInput({ selector, updateFormValue })
  }

  this.init = () => {
    this.updateFormValue = updateFormValue
    const { $target, $inputWrapper, $errorNode } = getSubNodes(selector)
    this.$target = $target
    this.$inputWrapper = $inputWrapper
    this.$errorNode = $errorNode
    this.bindEvent()
  }

  this.validate = async () => {
    const { value } = this.$target
    this.errorMessage = null
    if (isEmpty(value)) {
      this.errorMessage = '이메일을 확인해주세요.'
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
      this.updateFormValue('emailPrefix', target.value)
    }

    this.$target.addEventListener('change', onChangeHandler)
  }

  this.init()
}
