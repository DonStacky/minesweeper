export default function createLayout() {
  const main = document.createElement('main');
  main.classList.add('main');
  document.body.append(main);

  const header = document.createElement('div');
  header.classList.add('header');
  header.innerHTML = `<div class="header__item header__mines">000</div>
    <button class="header__face" title="Click for new game"></button>
    <div class="header__item header__time"><span class="minutes">00</span>:<span class="seconds">00</span></div>`;
  document.querySelector('.main').prepend(header);

  const field = document.createElement('div');
  field.classList.add('field');
  document.querySelector('.main').append(field);

  const aside = document.createElement('aside');
  aside.classList.add('aside');
  aside.innerHTML = `<div><div class="aside__btnbox"><button class="aside__themes"></button>
  <button class="aside__sound"></button></div>
  <div class="aside__slider">
  <input type='range' min='0' max='100' value='50' class="aside__percentage"></input>
  </div></div>
  <div>Flags <span class="aside__flags">0</span></div>
  <div>Left mines <span class="aside__mines">10</span></div>
  <label>Field size<br>
    <select name="select" class="aside__field-size">
      <option value="10">10 x 10</option>
      <option value="15">15 x 15</option>
      <option value="25">25 x 25</option>
    </select>
  </label>
  <label>Bombs<br>
  <input type="number" min="10" max="99" value="10" class="field__user-bomb-qty">
</label>
<div>
<button class="play">Play</button>
<h1 class='aside__score'>Score</h1></div>`;
  document.body.append(aside);
}
