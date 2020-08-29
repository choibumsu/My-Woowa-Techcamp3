import { getSubNodes } from '../../utils/functions.js'
import { isEmpty, checkHasEnglish, checkHasNumber } from '../../utils/regex.js'
import { CLASS_NAME } from '../../utils/constants.js'

export default function PasswordConfirmInput(props) {
  if (new.target !== PasswordConfirmInput) {
    return new PasswordConfirmInput(props)
  }
  const { selector, updateFormValue, password } = props

  this.init = () => {
    this.updateFormValue = updateFormValue
    this.password = password
    const { $target, $inputWrapper, $errorNode } = getSubNodes(selector)
    this.$target = $target
    this.$inputWrapper = $inputWrapper
    this.$errorNode = $errorNode
  }

  this.validate = () => {
    const { value } = this.$target

    this.errorMessage = null
    if (isEmpty(value)) {
      this.errorMessage = '비밀번호를 입력해주세요.'
    } else if (checkHasEnglish(value)) {
      this.errorMessage = '영문이 하나 이상 포함되어야 합니다.'
    } else if (checkHasNumber(value)) {
      this.errorMessage = '숫자가 하나 이상 포함되어야 합니다.'
    } else if (this.password !== value) {
      this.errorMessage = '비밀번호와 비밀번호 확인이 다릅니다.'
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
      this.updateFormValue('passwordConfirm', target.value)
    }

    this.$target.addEventListener('change', onChangeHandler)
  }

  this.setState = (newPassword) => {
    this.password = newPassword
  }

  this.init()
}
