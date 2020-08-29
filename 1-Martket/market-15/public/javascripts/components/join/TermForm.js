import { TAG_NAME } from '../../utils/constants.js'

export default function TermForm({ selector, updateFormValue }) {
  if (new.target !== TermForm) {
    return new TermForm({ selector, updateFormValue })
  }

  this.init = () => {
    this.$target = document.querySelector(selector)
    this.$terms = {
      all: this.$target.querySelector('input[name=all]'),
      essential: this.$target.querySelector('input[name=essential]'),
      optional: this.$target.querySelector('input[name=optional]'),
    }

    this.bindEvent()
  }

  this.bindEvent = () => {
    const onTermHandler = (e) => {
      if (e.target.tagName !== TAG_NAME.INPUT) {
        return
      }

      const { name } = e.target
      const termKeys = Object.keys(this.$terms)

      if (name === 'all') {
        termKeys.forEach(
          (key) => (this.$terms[key].checked = this.$terms.all.checked)
        )
        updateFormValue('isOptionalTerm', this.$terms.all.checked)
        updateFormValue('isEssentialTerm', this.$terms.all.checked)
        return
      }
      updateFormValue('isOptionalTerm', this.$terms.optional.checked)
      updateFormValue('isEssentialTerm', this.$terms.essential.checked)
      this.$terms.all.checked = termKeys.reduce((isAllChekced, key) => {
        if (key !== 'all')
          isAllChekced = isAllChekced && this.$terms[key].checked
        return isAllChekced
      })
    }

    this.$target.addEventListener('change', onTermHandler)
  }

  this.init()
}
