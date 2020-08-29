import {
  IdInput,
  PasswordInput,
  PasswordConfirmInput,
  NameInput,
  EmailPrefixInput,
  EmailSuffixInput,
  SelectEmail,
  PhoneInput,
  PhoneAuthInput,
  AddressForm,
  TermForm,
} from '../components/join/index.js'
import { Timer, Button, Modal } from '../components/common/index.js'
import { TAG_NAME, CLASS_NAME } from '../utils/constants.js'
import api from '../apis/api.js'

Object.prototype.renderErrorNode = function () {
  this.$inputWrapper.classList.add(CLASS_NAME.ERROR_CLASS)
  this.$errorNode.innerHTML = this.errorMessage
}

function JoinPage(props) {
  if (new.target !== JoinPage) {
    return new JoinPage(props)
  }

  const { sectionOneSelector } = props

  this.init = () => {
    this.formValue = {
      id: '',
      password: '',
      emailPrefix: '',
      emailSuffix: '',
      phone: '',
      postalCode: '',
      address: '',
      addressDetail: '',
      isEssentialTerm: false,
      isOptionalTerm: false,
    }
    this.verrifyPhoneInput = false // 인풋 인증했는지 check

    this.$essentialForm = document.querySelector(sectionOneSelector)
    this.$idInput = new IdInput({
      selector: 'input[name=id]',
      updateFormValue: this.setState,
    })
    this.$passwordInput = new PasswordInput({
      selector: 'input[name=password]',
      updateFormValue: this.setState,
    })
    this.$passwordConfirmInput = new PasswordConfirmInput({
      selector: 'input[name=passwordConfirm]',
      updateFormValue: this.setState,
      password: this.formValue.password,
    })
    this.$nameInput = new NameInput({
      selector: 'input[name=name]',
      updateFormValue: this.setState,
    })
    this.$emailPrefixInput = new EmailPrefixInput({
      selector: `input[name=emailPrefix]`,
      updateFormValue: this.setState,
    })
    this.$emailSuffixInput = new EmailSuffixInput({
      selector: `input[name=emailSuffix]`,
      updateFormValue: this.setState,
    })
    this.$selectEmail = new SelectEmail({
      selector: `.${CLASS_NAME.SELECT_EMAIL_CLASS}`,
      onChangeSelectTag: this.onChangeSelectTag,
    })
    this.$phoneInput = new PhoneInput({
      selector: 'input[name=phone]',
      updateFormValue: this.setState,
      displayPhoneAuthInput: this.displayPhoneAuthInput,
    })
    this.timer = new Timer({ selector: '.time' })

    this.$phoneAuthInput = new PhoneAuthInput({
      selector: 'input[name=phoneAuth]',
      updateFormValue: this.setState,
      stopTimer: this.timer.deleteCount,
      disablePhoneInput: this.disablePhoneInput,
    })
    this.$addressForm = new AddressForm({
      selector: `.${CLASS_NAME.ADDRESS_FORM_CLASS}`,
      updateFormValue: this.setState,
    })
    this.$termForm = new TermForm({
      selector: `.${CLASS_NAME.TERM_FORM_CLASS}`,
      updateFormValue: this.setState,
    })
    this.$term = new Button({
      selector: `.${CLASS_NAME.WOOWA_BUTTON_CLASS}`,
      onClickHandler: this.handleSubmit,
    })
    this.bindEvent()
  }

  this.bindEvent = () => {
    this.$essentialForm.addEventListener('focusout', (e) => {
      if (e.target.tagName !== TAG_NAME.INPUT) {
        return
      }
      this[e.target.dataset.type].validate()
    })
  }

  this.setState = (key, value) => {
    this.formValue = { ...this.formValue, [key]: value }
    console.log(this.formValue)
    if (key === 'password') {
      this.$passwordConfirmInput.setState(value)
    } // 비밀번호와 비밀번호 확인이 같은지 체크하기 위해 update
  }

  this.onChangeSelectTag = ({ target }) => {
    this.$emailSuffixInput.setState(target.value)
  }
  this.disablePhoneInput = () => {
    this.$phoneInput.disable()
    this.verrifyPhoneInput = true
  }
  this.displayPhoneAuthInput = () => {
    this.$modal = new Modal()
    this.$modal.setVisible('block')
    if (this.timer.interval) {
      this.timer.deleteCount()
    }
    this.timer.setCount()
    this.$phoneAuthInput.render()
  }

  this.handleSubmit = async () => {
    const components = [
      '$idInput',
      '$passwordInput',
      '$passwordConfirmInput',
      '$nameInput',
      '$emailPrefixInput',
      '$emailSuffixInput',
      '$phoneInput',
    ]
    let hasError = false
    components.forEach((component) => {
      const isValid = this[component].validate()
      if (!isValid) {
        hasError = true
      }
    })
    if (hasError) {
      console.log('hasError', hasError)
      return
    }
    if (!this.verrifyPhoneInput) {
      this.$phoneInput.renderNeedCertificationComplete()
      return
    } // 휴대폰 인증x
    if (!this.formValue.isEssentialTerm) {
      return alert('필수 약관을 동의해주세요.')
    }
    delete this.formValue.isEssentialTerm
    await api.requestJoin(this.formValue)
    // const { name, id, email, phone, isOptionalTerm } = this.formValue
    window.location.href = `/join/success/${this.formValue.id}`
  }

  this.init()
}

try {
  new JoinPage({
    sectionOneSelector: '.essential-form',
  })
} catch (e) {
  console.error(e)
}
