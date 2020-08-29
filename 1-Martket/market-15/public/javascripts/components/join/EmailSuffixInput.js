import { isEmpty } from '../../utils/regex.js'
import { CLASS_NAME, SELECT_VALUE } from '../../utils/constants.js'
import { getSubNodes } from '../../utils/functions.js'

export default function EmailSuffixInput({ selector, updateFormValue }) {
  if (new.target !== EmailSuffixInput) {
    return new EmailSuffixInput({ selector, updateFormValue })
  }

  this.init = () => {
    this.updateFormValue = updateFormValue
    const { $target, $inputWrapper, $errorNode } = getSubNodes(selector)
    this.$target = $target
    this.$target.disabled = true // 처음엔 비활성화
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
      return
    }

    // success
    this.$inputWrapper.classList.remove(CLASS_NAME.ERROR_CLASS) // error 클래스 남아있을 수 있으니
  }

  this.bindEvent = () => {
    const onChangeHandler = ({ target }) => {
      if (!target.value.trim()) {
        return
      }
      this.updateFormValue('emailSuffix', target.value)
    }

    this.$target.addEventListener('change', onChangeHandler)
  }

  this.setState = (emailSuffixValue) => {
    if (emailSuffixValue === SELECT_VALUE.SELF) {
      this.$target.value = ''
      this.$target.disabled = false
      return
    }
    this.$target.value = emailSuffixValue
    this.updateFormValue('emailSuffix', emailSuffixValue)
    this.$target.disabled = true
  }

  this.init()
}
