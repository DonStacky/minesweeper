export default function createField(width, height) {
  const fieldInner = document.createElement('div');
  fieldInner.classList.add('field__inner');
  document.querySelector('.field').append(fieldInner);

  const cellsQty = width * height;
  fieldInner.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
  fieldInner.style.gridTemplateRows = `repeat(${height}, 1fr)`;
  fieldInner.innerHTML = '<button class="field__cell field__cell--close"></button>'.repeat(cellsQty);
}
