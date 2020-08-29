export default function Modal() {
  if (new.target !== Modal) {
    return new Modal()
  }

  this.init = () => {
    this.$target = document.querySelector('.gray-bg')
    this.bindEvent()
  }

  this.setVisible = (value) => {
    this.$target.style.display = value
  }

  this.bindEvent = () => {
    this.$target.addEventListener('click', (e) => {
      if (e.target.className === 'close' || e.target.className === 'gray-bg') {
        this.$target.style.display = 'none'
      }
    })
  }

  this.init()
}
