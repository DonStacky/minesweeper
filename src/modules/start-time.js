export let timer;

export function startTime(time) {
  const seconds = document.querySelector('.seconds');
  const minutes = document.querySelector('.minutes');
  let i;
  if (!time) {
    i = 0;
  } else {
    i = time;
  }
  timer = setInterval(() => {
    let ss = i;
    if (ss >= 60) {
      ss = i % 60;
    }
    if (ss < 10) {
      seconds.textContent = `0${ss}`;
    } else if (ss <= 59) {
      seconds.textContent = `${ss}`;
    }
    const mm = Math.floor(i / 60);
    if (mm < 10) {
      minutes.textContent = `0${mm}`;
    } else {
      minutes.textContent = `${mm}`;
    }
    i += 1;
  }, 1000);
}
