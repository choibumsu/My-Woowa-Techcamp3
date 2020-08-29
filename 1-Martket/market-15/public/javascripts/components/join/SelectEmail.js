export default function SelectEmail({ selector, onChangeSelectTag }) {
  if (new.target !== SelectEmail) {
    return new SelectEmail({ selector })
  }

  this.init = () => {
    this.$target = document.querySelector(selector)
    this.onChangeSelectTag = onChangeSelectTag
    this.bindEvent()
  }

  this.bindEvent = () => {
    this.$target.addEventListener('change', onChangeSelectTag)
  }

  this.init()
}
