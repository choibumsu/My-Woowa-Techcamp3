Button.prototype.init = function () {
  this.$target = document.querySelector(this.selector)
  this.$target.addEventListener('click', this.onClickHandler)
}

export default function Button(props) {
  if (new.target !== Button) {
    return new Button(props)
  }
  const { selector, onClickHandler } = props
  this.selector = selector
  this.onClickHandler = onClickHandler

  this.init()
}
