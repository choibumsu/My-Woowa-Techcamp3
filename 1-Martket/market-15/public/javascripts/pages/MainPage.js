import Button from '../components/common/Button.js'

export default function MainPage() {
  if (new.target !== MainPage) {
    return new MainPage()
  }
  new Button({
    selector: '.woowa-btn',
    onClickHandler: () => (window.location.href = '/login'),
  })
}

try {
  new MainPage()
} catch (e) {
  console.error(e)
}
