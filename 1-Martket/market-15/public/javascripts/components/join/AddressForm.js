import { CLASS_NAME, TAG_NAME } from '../../utils/constants.js'

export default function AddressForm({ selector, updateFormValue }) {
  if (new.target !== AddressForm) {
    return new AddressForm({ selector, updateFormValue })
  }

  this.init = () => {
    this.$target = document.querySelector(selector)
    this.$addressCheckInput = this.$target.querySelector('#address-check')
    this.$addressSearchBtn = this.$target.querySelector('.address-search-btn')

    this.$postalInput = this.$target.querySelector('input[name=postal]') // 우편번호
    this.$addressInput = this.$target.querySelector('input[name=address]') // 주소
    this.$addressDetailInput = this.$target.querySelector(
      'input[name=address-detail]'
    ) // 상세주소

    this.$previewWrapper = this.$target.querySelector('.preview-wrapper')
    this.$prePreview = this.$previewWrapper.querySelector('.pre')
    this.$detailPreview = this.$previewWrapper.querySelector('.detail')

    this.bindEvent()
  }

  this.bindEvent = () => {
    // 선택 정보 입력 활성화 이벤트 등록
    const changeCheckboxHandler = (e) => {
      if (e.target.checked) {
        this.$addressSearchBtn.classList.add(CLASS_NAME.ACTIVE_CLASS)
        this.$addressDetailInput.disabled = false
        return
      }

      this.$postalInput.value = ''
      this.$addressInput.value = ''
      this.$previewWrapper.classList.add(CLASS_NAME.DISPLAY_NONE_CLASS)
      this.$addressSearchBtn.classList.remove(CLASS_NAME.ACTIVE_CLASS)
      this.$addressDetailInput.disabled = true
      this.$addressDetailInput.value = ''
    }

    const onClickAddressSearchHandler = () => {
      if (!this.$addressCheckInput.checked) return

      new daum.Postcode({
        this: this,
        oncomplete: (data) => {
          const postalCode = data.zonecode
          const address =
            data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress
          const jibunAddress = data.jibunAddress || data.autoJibunAddress

          this.$postalInput.value = postalCode
          this.$addressInput.value = address
          this.$addressDetailInput.value = ''
          this.$previewWrapper.classList.remove(CLASS_NAME.DISPLAY_NONE_CLASS)
          this.$prePreview.innerHTML = jibunAddress
          this.$detailPreview.innerHTML = ''
          updateFormValue('postalCode', postalCode)
          updateFormValue('address', address)
        },
      }).open()
    }

    const onChangeDetailInputHandler = (e) => {
      this.$detailPreview.innerHTML = ' ' + e.target.value
      updateFormValue(e.target.dataset.type, e.target.value)
    }

    this.$addressCheckInput.addEventListener('change', changeCheckboxHandler)
    // 주소 api 호출
    this.$addressSearchBtn.addEventListener(
      'click',
      onClickAddressSearchHandler
    )
    // 상세주소를 지번주소에 추가하기
    this.$addressDetailInput.addEventListener(
      'input',
      onChangeDetailInputHandler
    )
  }

  this.init()
}
