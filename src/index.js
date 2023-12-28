import './styles/styles.css';
import createField from './modules/create-field';
import createLayout from './modules/create-layout';
import bombCreates from './modules/bomb-сreater';
import { timer, startTime } from './modules/start-time';
import {
  AudioClick, AudioWin, AudioSetFlag, AudioLose, AudioStartGame, AudioClear,
  AudioBeforeLose, AudioNewGame, AudioStartMusic, AudioWinMusic, setVolumeOff, setNewVolume,
} from './modules/game-sound';
import { setScoreTable, getScoreTable } from './modules/score-table';

createLayout();
const field = document.querySelector('.field');
const smile = document.querySelector('.header__face');
let countClick;
let time;
let estimBombQty = +document.querySelector('.field__user-bomb-qty').value;
if (estimBombQty < 10) {
  estimBombQty = 10;
} else if (estimBombQty > 99) {
  estimBombQty = 99;
}
let minesLeft = estimBombQty - document.querySelectorAll('.field__cell--flag').length;

if (localStorage.getItem('setSizeRSG') && localStorage.getItem('setBombRSG')) {
  const setSize = localStorage.getItem('setSizeRSG');
  const setBomb = localStorage.getItem('setBombRSG');
  initGame(setSize, setSize, setBomb);
} else {
  initGame(10, 10, 10);
}

document.querySelector('.header__face').addEventListener('click', () => {
  if (!(document.querySelector('.header__face').classList.contains('header__face--lose')
  || document.querySelector('.header__face').classList.contains('header__face--win'))) {
    resetGame();
  } else {
    return;
  }
});

document.querySelector('.play').addEventListener('click', () => {
  resetGame();
});

function initGame(width, height, bombsQty) {
  createField(width, height);
  let normalizeBombQty = bombsQty;
  if (bombsQty < 10) {
    normalizeBombQty = 10;
  } else if (bombsQty > 99) {
    normalizeBombQty = 99;
  }
  const openCellQty = document.querySelectorAll('.field__cell--open').length;
  const fieldInner = document.querySelector('.field__inner');
  function firstClick(event) {
    if (event.target.classList.contains('field__cell--flag')) {
      return;
    }
    startTime(time);
    if (!document.querySelectorAll('.field__cell--open').length) {
      AudioStartGame.play();
    }
    document.querySelectorAll('.field__cell').forEach((item, index) => {
      if (event.target.classList.contains('field__cell--flag')) {
        return;
      }
      if (event.target === item) {
        startGame(width, height, normalizeBombQty, index);
      }
    });
    if (!localStorage.getItem('setMovesQtyRSG')) {
      document.querySelector('.header__mines').textContent = 1;
      countClick = 1;
    } else {
      const count = localStorage.getItem('setMovesQtyRSG');
      document.querySelector('.header__mines').textContent = +count + 1;
      countClick += 1;
    }
    if (openCellQty !== document.querySelectorAll('.field__cell--open').length) {
      fieldInner.removeEventListener('click', firstClick);
    }
  }
  fieldInner.addEventListener('click', firstClick);
  document.querySelectorAll('.field__cell').forEach((item) => {
    item.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      if (!item.classList.contains('feild__cell--open')) {
        item.classList.toggle('field__cell--flag');
        document.querySelector('.aside__flags').innerHTML = `${document.querySelectorAll('.field__cell--flag').length}`;
        estimBombQty = +document.querySelector('.field__user-bomb-qty').value;
        if (estimBombQty < 10) {
          estimBombQty = 10;
        } else if (estimBombQty > 99) {
          estimBombQty = 99;
        }
        minesLeft = estimBombQty - document.querySelectorAll('.field__cell--flag').length;
        if (minesLeft < 0) {
          minesLeft = 0;
        }
        document.querySelector('.aside__mines').innerHTML = minesLeft;
        AudioSetFlag.play();
      }
    });
  });
  document.querySelector('.field__inner').addEventListener('click', () => {
    const openCell = document.querySelectorAll('.field__cell--open').length;
    if (openCell === width * height - +normalizeBombQty) {
      document.querySelectorAll('.field__cell').forEach((item) => {
        if (!item.classList.contains('field__cell--open')) {
          // item.classList.remove('field__cell--close');
          item.classList.add('field__cell--clear');
        }
      });
      document.querySelector('.header__face').classList.add('header__face--win');
      document.querySelector('.field__inner').classList.add('field__cell--disable');
      document.querySelector('.header__face--win').addEventListener('click', () => {
        resetGame();
      });
      const winTime = new Date();
      const options = {
        day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric',
      };
      const currentDate = winTime.toLocaleDateString('en-GB', options);
      setScoreTable(currentDate);
      clearInterval(timer);
      AudioWin.play();
      setTimeout(() => {
        AudioStartMusic.pause();
        AudioStartMusic.currentTime = 0;
        AudioWinMusic.play();
        alert(`Hooray! You found all mines in ${document.querySelector('.minutes').innerHTML}:${document.querySelector('.seconds').innerHTML} seconds and ${document.querySelector('.header__mines').innerHTML} moves!`);
      }, 500);
    } else {
      return;
    }
  });
}

function startGame(width, height, bombsQty, initCell) {
  const cellsQty = width * height;
  if (!localStorage.getItem('bombArrRSG')) {
    bombPosition = bombCreates(cellsQty, bombsQty, initCell);
  }
  if (!document.querySelectorAll('.field__cell--open').length) {
    setTimeout(() => {
      AudioStartMusic.play();
    }, 500);
  }
  const fieldInner = document.querySelector('.field__inner');
  fieldInner.addEventListener('click', (event) => {
    if (event.target.classList.contains('field__cell--flag')) {
      return;
    }
    if (event.target.tagName === 'BUTTON' && !event.target.classList.contains('field__cell--flag')) {
      countClick += 1;
      document.querySelector('.header__mines').textContent = +countClick;
    }
  });
  const firstCells = [];
  const lastCells = [];
  for (let i = 0; i < cellsQty; i += +width) {
    firstCells.push(i);
    lastCells.push(i + +width - 1);
  }
  document.querySelectorAll('.field__cell').forEach((cell) => {
    cell.addEventListener('click', (event) => {
      if (cell.classList.contains('field__cell--flag')) {
        return;
      }
      document.querySelectorAll('.field__cell').forEach((item, index) => {
        if (event.target === item) {
          getCount(event.target, index);
        }
      });
    });
  });

  getCount(document.querySelectorAll('.field__cell')[initCell], initCell);

  function isBomb(cellIndex) {
    return bombPosition.includes(cellIndex);
  }

  function getCount(cell, index) {
    if (isBomb(index)) {
      cell.classList.add('field__cell--bang');
      document.querySelectorAll('.field__cell').forEach((item, number) => {
        if (bombPosition.includes(number)) {
          item.classList.add('field__cell--bang');
        }
        if (!cell.classList.contains('field__cell--flag')) {
          item.classList.add('field__cell--disable');
        }
      });
      document.querySelector('.header__face').classList.add('header__face--lose');
      document.querySelector('.header__face--lose').addEventListener('click', () => {
        resetGame();
      });
      clearInterval(timer);
      AudioStartMusic.pause();
      AudioStartMusic.currentTime = 0;
      AudioBeforeLose.play();
      setTimeout(() => {
        AudioLose.play();
        alert('Game over. Try again');
      }, 1000);
    } else if (!cell.classList.contains('field__cell--flag')) {
      cell.classList.add('field__cell--open');
    }

    let siblingCells = [index - +width - 1, index - 1, index + +width - 1,
      index + +width, index - +width, index + +width + 1, index + 1, index - +width + 1];
    let count = 0;
    if (bombPosition.includes(index)) {
      return;
    }
    if (firstCells.includes(index)) {
      siblingCells = siblingCells.slice(3);
      siblingCells.forEach((number) => {
        if (bombPosition.includes(number)) count += 1;
      });
    } else if (lastCells.includes(index)) {
      siblingCells = siblingCells.slice(0, 5);
      siblingCells.forEach((number) => {
        if (bombPosition.includes(number)) count += 1;
      });
    } else {
      siblingCells.forEach((number) => {
        if (bombPosition.includes(number)) count += 1;
      });
    }
    const target = cell;
    if (count !== 0) {
      if (!cell.classList.contains('field__cell--flag')) {
        target.innerHTML = count;
      }
    }
    if (count === 1) {
      target.classList.add('field__cell--green');
    }
    if (count === 3 || count === 2) {
      target.classList.add('field__cell--yellow');
    }
    if (count === 4 || count === 5) {
      target.classList.add('field__cell--brown');
    }
    if (count > 5) {
      target.classList.add('field__cell--red');
    }
    if (count === 0) {
      if (AudioStartGame.currentTime) {
        AudioClear.play();
      }
      siblingCells.forEach((number) => {
        if (document.querySelectorAll('.field__cell')[number]) {
          if (!document.querySelectorAll('.field__cell')[number].classList.contains('field__cell--open')) {
            getCount(document.querySelectorAll('.field__cell')[number], number);
          }
        }
      });
    }
  }
}

document.querySelector('.aside__themes').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

document.body.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    AudioClick.play();
  }
});

const slider = document.querySelector('.aside__percentage');

slider.addEventListener('change', setNewVolume);
document.querySelector('.aside__sound').addEventListener('click', setVolumeOff);

let bombPosition;
function setLocalStorage() {
  localStorage.setItem('bombArrRSG', bombPosition);
  const openCellArr = [];
  const flagCellArr = [];
  document.querySelectorAll('.field__cell').forEach((item, index) => {
    if (item.classList.contains('field__cell--open')) {
      openCellArr.push(index);
    }
    if (item.classList.contains('field__cell--flag')) {
      flagCellArr.push(index);
    }
  });

  localStorage.setItem('openCellArrRSG', openCellArr);
  localStorage.setItem('flagCellArrRSG', flagCellArr);

  const setSize = document.querySelector('.aside__field-size').value;
  const setBomb = document.querySelector('.field__user-bomb-qty').value;
  const setMovesQty = countClick;
  const setTime = +document.querySelector('.minutes').innerHTML * 60 + +document.querySelector('.seconds').innerHTML;
  const theme = document.querySelectorAll('.dark').length;
  localStorage.setItem('setSizeRSG', setSize);
  localStorage.setItem('setBombRSG', setBomb);
  localStorage.setItem('setMovesQtyRSG', setMovesQty);
  localStorage.setItem('setTimeRSG', setTime);
  localStorage.setItem('themeRSG', theme);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  let setSize;
  let setBomb;
  let theme;
  if (localStorage.getItem('setSizeRSG')) {
    setSize = localStorage.getItem('setSizeRSG');
  }
  if (localStorage.getItem('setBombRSG')) {
    setBomb = localStorage.getItem('setBombRSG');
  }
  if (localStorage.getItem('themeRSG')) {
    const setTheme = localStorage.getItem('themeRSG');
    theme = +setTheme;
    if (theme) {
      document.body.classList.add('dark');
    }
  }
  if (setSize) {
    document.querySelector('.aside__field-size').value = setSize;
  }
  if (setBomb) {
    document.querySelector('.field__user-bomb-qty').value = setBomb;
  }
  if (localStorage.getItem('setTimeRSG')) {
    time = +localStorage.getItem('setTimeRSG');
    if (Math.floor(time / 60) < 10) {
      document.querySelector('.minutes').textContent = `0${Math.floor(time / 60)}`;
    } else {
      document.querySelector('.minutes').textContent = `${Math.floor(time / 60)}`;
    }
    if (time % 60 < 10) {
      document.querySelector('.seconds').textContent = `0${time % 60}`;
    } else {
      document.querySelector('.seconds').textContent = `${time % 60}`;
    }
  }
  if (localStorage.getItem('bombArrRSG')) {
    const strBomb = localStorage.getItem('bombArrRSG');
    bombPosition = strBomb.split(',').map((item) => +item);
  }
  if (localStorage.getItem('setMovesQtyRSG')) {
    const strMovesQty = localStorage.getItem('setMovesQtyRSG');
    countClick = +strMovesQty;
    document.querySelector('.header__mines').textContent = +countClick;
  }
  if (localStorage.getItem('flagCellArrRSG')) {
    const strFlag = localStorage.getItem('flagCellArrRSG');
    const flagPosition = strFlag.split(',').map((item) => +item);
    document.querySelectorAll('.field__cell').forEach((item, index) => {
      if (flagPosition.includes(index)) {
        item.classList.add('field__cell--flag');
      }
    });
  }
  document.querySelector('.aside__flags').innerHTML = `${document.querySelectorAll('.field__cell--flag').length}`;
  estimBombQty = +document.querySelector('.field__user-bomb-qty').value;
  if (estimBombQty < 10) {
    estimBombQty = 10;
  } else if (estimBombQty > 99) {
    estimBombQty = 99;
  }
  minesLeft = estimBombQty - document.querySelectorAll('.field__cell--flag').length;
  if (minesLeft < 0) {
    minesLeft = 0;
  }
  document.querySelector('.aside__mines').innerHTML = minesLeft;
  if (localStorage.getItem('openCellArrRSG')) {
    const strOpen = localStorage.getItem('openCellArrRSG');
    const array = strOpen.split(',').map((item) => +item);
    document.querySelectorAll('.field__cell').forEach((item, index) => {
      const firstCells = [];
      const lastCells = [];
      for (let i = 0; i < setSize * setSize; i += +setSize) {
        firstCells.push(i);
        lastCells.push(i + +setSize - 1);
      }
      if (array.includes(index)) {
        let siblingCells = [index - +setSize - 1, index - 1, index + +setSize - 1,
          index + +setSize, index - +setSize, index + +setSize + 1,
          index + 1, index - +setSize + 1];
        let count = 0;
        if (firstCells.includes(index)) {
          siblingCells = siblingCells.slice(3);
          siblingCells.forEach((number) => {
            if (bombPosition.includes(number)) count += 1;
          });
        } else if (lastCells.includes(index)) {
          siblingCells = siblingCells.slice(0, 5);
          siblingCells.forEach((number) => {
            if (bombPosition.includes(number)) count += 1;
          });
        } else {
          siblingCells.forEach((number) => {
            if (bombPosition.includes(number)) count += 1;
          });
        }
        const target = item;
        if (count !== 0) {
          if (!target.classList.contains('field__cell--flag')) {
            target.innerHTML = count;
            target.classList.add('field__cell--open');
          }
        }
        if (count === 1) {
          target.classList.add('field__cell--green');
        }
        if (count === 3 || count === 2) {
          target.classList.add('field__cell--yellow');
        }
        if (count === 4 || count === 5) {
          target.classList.add('field__cell--brown');
        }
        if (count > 5) {
          target.classList.add('field__cell--red');
        }
        if (count === 0) {
          if (!target.classList.contains('field__cell--flag')) {
            target.classList.add('field__cell--open');
          }
        }
      }
    });
  }
}
window.addEventListener('load', getLocalStorage);
document.querySelector('.aside__score').addEventListener('click', () => {
  const result = getScoreTable();
  const str = result.split(',').join('');
  if (localStorage.getItem('scoreTableRSG')) {
    alert(str);
  } else {
    alert('The most important thing is not to win, but to take part!🤷‍♂️');
  }
});

function resetGame() {
  smile.classList.remove('header__face--lose');
  smile.classList.remove('header__face--win');
  document.querySelector('.header__mines').textContent = '0';
  document.querySelector('.minutes').textContent = '00';
  document.querySelector('.seconds').textContent = '00';
  clearInterval(timer);
  field.innerHTML = '';
  AudioWinMusic.currentTime = 0;
  AudioWinMusic.pause();
  AudioStartMusic.currentTime = 0;
  AudioStartMusic.pause();
  AudioNewGame.play();
  const setSize = document.querySelector('.aside__field-size').value;
  const setBomb = document.querySelector('.field__user-bomb-qty').value;
  localStorage.removeItem('bombArrRSG');
  localStorage.removeItem('setMovesQtyRSG');
  localStorage.removeItem('setTimeRSG');
  document.querySelector('.aside__flags').innerHTML = '0';
  estimBombQty = +document.querySelector('.field__user-bomb-qty').value;
  if (estimBombQty < 10) {
    estimBombQty = 10;
  } else if (estimBombQty > 99) {
    estimBombQty = 99;
  }
  minesLeft = estimBombQty - document.querySelectorAll('.field__cell--flag').length;
  if (minesLeft < 0) {
    minesLeft = 0;
  }
  document.querySelector('.aside__mines').innerHTML = minesLeft;
  time = 0;
  countClick = 0;
  initGame(setSize, setSize, setBomb);
}
