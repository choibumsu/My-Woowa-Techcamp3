import { isEmpty, checkHasEnglish, checkId } from '../../utils/regex.js'
import { CLASS_NAME } from '../../utils/constants.js'
import api from '../../apis/api.js'
import { getSubNodes } from '../../utils/functions.js'

export default function IdInput({ selector, updateFormValue }) {
  if (new.target !== IdInput) {
    return new IdInput({ selector, updateFormValue })
  }

  this.init = () => {
    this.updateFormValue = updateFormValue
    const { $target, $inputWrapper, $errorNode } = getSubNodes(selector)
    this.$target = $target
    this.$inputWrapper = $inputWrapper
    this.$errorNode = $errorNode
    this.bindEvent()
  }

  this.renderSuccessNode = () => {
    this.$inputWrapper.classList.add(CLASS_NAME.SUCCESS_CLASS)
  } // id input은 success div가 있음

  this.validateIdDuplication = async (id) => {
    const { status } = await api.checkIdDuplication(id)
    if (status === 409) {
      return true
    }
    return false
  }

  this.validate = async () => {
    const { value } = this.$target
    this.errorMessage = null
    if (isEmpty(value)) {
      this.errorMessage = '아이디를 입력해주세요.'
    } else if (checkHasEnglish(value)) {
      this.errorMessage = '영문이 하나 이상 포함되어야 합니다.'
    } else if (checkId(value)) {
      this.errorMessage = '유효하지 않은 아이디입니다.'
    } else if (await this.validateIdDuplication(value)) {
      this.errorMessage =
        '이미 사용중인 아이디 입니다. 다른 아이디를 입력해 주세요.'
    }
    if (this.errorMessage) {
      this.renderErrorNode()
      return false
    }

    // success
    this.$inputWrapper.classList.remove(CLASS_NAME.ERROR_CLASS) // error 클래스 남아있을 수 있으니
    this.renderSuccessNode()
    return true
  }

  this.bindEvent = () => {
    const onChangeHandler = ({ target }) => {
      if (!target.value.trim()) {
        return
      }
      this.updateFormValue('id', target.value)
    }

    this.$target.addEventListener('change', onChangeHandler)
  }

  this.init()
}
