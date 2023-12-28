let setScore;
if (localStorage.getItem('scoreTableRSG')) {
  setScore = localStorage.getItem('scoreTableRSG').split(',');
} else {
  setScore = [];
}

export function setScoreTable(time) {
  let score;
  if (setScore.length === 10) {
    score = `${setScore.length}. ${time} -- You win in ${document.querySelector('.minutes').innerHTML}:${document.querySelector('.seconds').innerHTML} seconds and ${document.querySelector('.header__mines').innerHTML} moves!\n`;
  } else {
    score = `${setScore.length + 1}. ${time} -- You win in ${document.querySelector('.minutes').innerHTML}:${document.querySelector('.seconds').innerHTML} seconds and ${document.querySelector('.header__mines').innerHTML} moves!\n`;
  }
  if (setScore.length < 10) {
    setScore.push(score);
  } else {
    setScore.shift();
    setScore.forEach((item, index) => {
      setScore[index] = `${index + 1}.${item.slice(2)}`;
    });
    setScore.forEach((item, index) => {
      setScore[index] = item.replace('..', '.');
    });
    setScore.push(score);
  }
  localStorage.setItem('scoreTableRSG', setScore);
}

export function getScoreTable() {
  let scoreTable;
  if (localStorage.getItem('scoreTableRSG')) {
    scoreTable = localStorage.getItem('scoreTableRSG');
  }
  localStorage.setItem('scoreTableRSG', scoreTable);
  return scoreTable;
}
