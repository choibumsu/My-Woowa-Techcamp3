import { isEmpty, checkPhoneAuth } from '../../utils/regex.js'
import { CLASS_NAME, TAG_NAME } from '../../utils/constants.js'
import { getSubNodes } from '../../utils/functions.js'

export default function PhoneAuthInput(props) {
  if (new.target !== PhoneAuthInput) {
    return new PhoneAuthInput(props)
  }

  const { selector, updateFormValue, stopTimer, disablePhoneInput } = props
  this.init = () => {
    this.updateFormValue = updateFormValue
    const { $target, $inputWrapper, $errorNode } = getSubNodes(selector)
    this.$target = $target
    this.$inputWrapper = $inputWrapper
    this.$errorNode = $errorNode
    this.$phoneAuthButton = this.$inputWrapper.querySelector(TAG_NAME.BUTTON)
    this.bindEvent()
  }

  this.validate = async () => {
    const { value } = this.$target
    this.errorMessage = null
    if (isEmpty(value)) {
      this.errorMessage = '인증번호를 입력해주세요.'
    } else if (checkPhoneAuth(value)) {
      this.errorMessage = '인증번호를 확인해주세요.'
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
    const onKeyUpHandler = (e) =>
      (e.target.value = e.target.value.replace(/[^0-9]/g, ''))

    const onClickHandler = () => {
      if (!this.validate()) {
        return
      }
      if (this.$target.value === '123456') {
        // 임시 비밀번호
        this.$inputWrapper.classList.add(CLASS_NAME.DISPLAY_NONE_CLASS)
        stopTimer()
        disablePhoneInput()
      }
    }

    this.$target.addEventListener('keyup', onKeyUpHandler)
    this.$phoneAuthButton.addEventListener('click', onClickHandler)
  }

  this.render = () => {
    this.$inputWrapper.classList.remove('dp-none')
  }

  this.init()
}
