import { TAG_NAME, CLASS_NAME, KEY_NAME } from '../utils/constants.js'
import Button from '../components/common/Button.js'
import api from '../apis/api.js'

const ERROR_CASES = {
  id: {
    empty: '아이디를 입력해주세요.',
    lengthOver: '아이디는 100자를 넘을 수 없습니다.',
  },
  password: {
    empty: '비밀번호를 입력해주세요.',
    lengthOver: '비밀번호는 100자를 넘을 수 없습니다.',
  },
  common: '아이디와 비밀번호를 확인 후 다시 로그인해주세요.',
  unexcepted: '예상치 못한 오류가 발생했습니다. 새로고침 후 로그인해주세요.',
}

export default function LoginPage(props) {
  if (new.target !== LoginPage) {
    return new LoginPage(props)
  }

  const { loginFormSelector } = props

  this.init = () => {
    this.$loginForm = document.querySelector(loginFormSelector)
    this.$saveIdCheckBox = this.$loginForm.querySelector('#is-save-id')
    this.$errorNode = this.$loginForm.querySelector('.error-message')

    this.$idInput = this.$loginForm.querySelector('input[name=id]')
    this.$passwordInput = this.$idInput.nextElementSibling
    this.$inputs = [this.$idInput, this.$passwordInput]

    new Button({
      selector: '.woowa-btn',
      onClickHandler: (e) => onSendLoginRequestHandler(e),
    })

    this.bindEvent()
    this.setId()
  }

  this.setId = () => {
    const savedId = localStorage.getItem('id')
    if (savedId) {
      this.$idInput.value = savedId
      this.$saveIdCheckBox.checked = true
    }
  }

  this.bindEvent = () => {
    this.$inputs.forEach(($input) => {
      $input.addEventListener('keyup', onSendLoginRequestHandler)
    })
  }

  const checkError = () => {
    const errorMessages = this.$inputs.reduce((errorMessages, $input) => {
      const result = validateInput($input.value)
      if (result.isError) {
        errorMessages.push(ERROR_CASES[$input.name][result.code])
      }
      return errorMessages
    }, [])

    if (errorMessages.length > 0) {
      this.$loginForm.classList.add(CLASS_NAME.ERROR_CLASS)
      this.$errorNode.innerHTML = errorMessages[0]
      return true
    }

    return false
  }

  const onSendLoginRequestHandler = async (e) => {
    if (e.type === 'keyup' && e.key !== KEY_NAME.ENTER) {
      return
    }

    if (checkError()) return

    const response = await api.requestLogin(
      this.$idInput.value,
      this.$passwordInput.value
    )

    if (response.status === 200) {
      this.$loginForm.classList.remove(CLASS_NAME.ERROR_CLASS)
      alert('로그인에 성공하였습니다.')
      window.location = `https://ceo.baemin.com/`

      if (this.$saveIdCheckBox.checked) {
        const data = await response.json()
        localStorage.setItem('id', data.id)
        return
      }
      localStorage.removeItem('id')

      return
    } else if (response.status === 404) {
      this.$loginForm.classList.add(CLASS_NAME.ERROR_CLASS)
      this.$errorNode.innerHTML = ERROR_CASES.common

      this.$inputs.forEach(($input) => {
        $input.value = ''
      })
      this.$idInput.focus()

      return
    }

    this.$loginForm.classList.add(CLASS_NAME.ERROR_CLASS)
    this.$errorNode.innerHTML = ERROR_CASES.unexcepted
  }

  this.init()
}

function validateInput(value) {
  if (value.length > 100) {
    return {
      isError: true,
      code: 'lengthOver',
    }
  }

  if (value === '') {
    return {
      isError: true,
      code: 'empty',
    }
  }

  return {
    isError: false,
  }
}

try {
  new LoginPage({
    loginFormSelector: '.login-form',
  })
} catch (e) {
  console.error(e)
}
