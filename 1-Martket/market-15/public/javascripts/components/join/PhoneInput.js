import { isEmpty, checkPhone } from '../../utils/regex.js'
import { CLASS_NAME } from '../../utils/constants.js'
import { getSubNodes } from '../../utils/functions.js'

export default function PhoneInput(props) {
  if (new.target !== PhoneInput) {
    return new PhoneInput(props)
  }
  const { selector, updateFormValue, displayPhoneAuthInput } = props

  this.init = () => {
    this.updateFormValue = updateFormValue
    const { $target, $inputWrapper, $errorNode } = getSubNodes(selector)
    this.$target = $target
    this.$inputWrapper = $inputWrapper
    this.$errorNode = $errorNode
    this.$phoneButton = this.$target.nextElementSibling
    this.bindEvent()
  }

  this.validate = async () => {
    const { value } = this.$target
    this.errorMessage = null
    if (isEmpty(value)) {
      this.errorMessage = '휴대폰번호를 입력해주세요.'
    } else if (checkPhone(value)) {
      this.errorMessage = '유효하지 않은 휴대전화번호입니다.'
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

    const onChangeHandler = ({ target }) => {
      if (!target.value) {
        return
      }
      this.updateFormValue('phone', target.value)
      if (checkPhone(target.value)) {
        this.$phoneButton.classList.remove(CLASS_NAME.ACTIVE_CLASS)
        return
      }
      this.$phoneButton.classList.add(CLASS_NAME.ACTIVE_CLASS)
    }

    const onClickHandler = (e) => {
      if (!e.target.classList.contains(CLASS_NAME.ACTIVE_CLASS)) {
        return
      }
      // phoneAuth component show
      displayPhoneAuthInput()
      this.$phoneButton.innerHTML = '재인증'
    }

    this.$target.addEventListener('change', onChangeHandler)
    this.$target.addEventListener('keyup', onKeyUpHandler)
    this.$phoneButton.addEventListener('click', onClickHandler)
  }

  this.renderNeedCertificationComplete = () => {
    this.errorMessage = '휴대폰 인증이 필요합니다.'
    this.renderErrorNode()
  }

  this.disable = () => {
    this.$target.disabled = true
    this.$inputWrapper.classList.remove(CLASS_NAME.ERROR_CLASS)
    this.$phoneButton.classList.remove(CLASS_NAME.ACTIVE_CLASS)
  }

  this.init()
}
