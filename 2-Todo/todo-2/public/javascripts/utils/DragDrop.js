import { CLASS_NAME, COLUMN_CLASS, CARD_CLASS } from '../utils/Constants'

export const copyDragElement = (e, $element, scrollOffset, gap) => {
  const $copyElement = $element.cloneNode(true)
  $copyElement.style.left = `${$element.offsetLeft - scrollOffset.left + gap}px`
  $copyElement.style.top = `${$element.offsetTop - scrollOffset.top - gap}px`
  $copyElement.style.height = `${$element.offsetHeight}px`
  $copyElement.style.width = `${$element.offsetWidth}px`
  $copyElement.classList.add(CLASS_NAME.COPY)

  const offsetDiff = {
    left: e.pageX + scrollOffset.left - $element.offsetLeft - gap,
    top: e.pageY + scrollOffset.top - $element.offsetTop + gap,
  }

  return [$copyElement, offsetDiff]
}

export const dragElement = (e, $element, offsetDiff) => {
  $element.style.left = `${e.pageX - offsetDiff.left}px`
  $element.style.top = `${e.pageY - offsetDiff.top}px`
}

export const toggleMovingStyle = ($element) => {
  if ($element.classList.contains(CLASS_NAME.MOVING)) {
    document.body.classList.remove(CLASS_NAME.US_NONE)
    document.body.classList.remove(CLASS_NAME.GRABBING)
    $element.classList.remove(CLASS_NAME.MOVING)
    return
  }

  document.body.classList.add(CLASS_NAME.US_NONE)
  document.body.classList.add(CLASS_NAME.GRABBING)
  $element.classList.add(CLASS_NAME.MOVING)
}

// 카드 컨테이너 사이의 가로 간격을 계산
export const getContainerHalfGap = () => {
  const $firstContainer = document.querySelector(
    `.${COLUMN_CLASS.CONTENT_CONTAINER}`
  )
  if (!$firstContainer) return 0

  const $secondColumn = $firstContainer.closest(`.${COLUMN_CLASS.COLUMN}`)
    .nextElementSibling
  if (!$secondColumn || !$secondColumn.classList.contains(COLUMN_CLASS.COLUMN))
    return 0

  const $secondContainer = $secondColumn.querySelector(
    `.${COLUMN_CLASS.CONTENT_CONTAINER}`
  )

  const columnHalfGap =
    ($secondContainer.offsetLeft -
      $firstContainer.offsetLeft -
      $firstContainer.offsetWidth) /
    2

  return columnHalfGap
}

// 카드 사이의 세로 간격을 계산
export const getCardHalfGap = () => {
  const $containers = Array.from(
    document.querySelectorAll(`.${COLUMN_CLASS.CONTENT_CONTAINER}`)
  )
  const twoCardsContainer = $containers.find(
    ($container) =>
      $container.querySelectorAll(`.${CARD_CLASS.CARD}`).length > 1
  )

  if (!twoCardsContainer) return 0

  const $firstCard = twoCardsContainer.querySelector(`.${CARD_CLASS.CARD}`)
  const $secondCard = $firstCard.nextElementSibling

  const cardHalfGap =
    ($secondCard.offsetTop - $firstCard.offsetTop - $firstCard.offsetHeight) / 2

  return cardHalfGap
}
