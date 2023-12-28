import openCell from '../assets/audio/pl_tile4.mp3';
import win from '../assets/audio/bombdef.mp3';
import flag from '../assets/audio/c4_disarm.mp3';
import bang from '../assets/audio/bang.mp3';
import start from '../assets/audio/bombpl.mp3';
import beforeBang from '../assets/audio/ct_fireinhole.mp3';
import gogo from '../assets/audio/com_go.mp3';
import startMusic from '../assets/audio/bombplanted.mp3';
import winMusic from '../assets/audio/roundmvpanthem_01.mp3';
import clear from '../assets/audio/clear.mp3';

export const AudioClick = new Audio(openCell);
export const AudioWin = new Audio(win);
export const AudioSetFlag = new Audio(flag);
export const AudioLose = new Audio(bang);
export const AudioStartGame = new Audio(start);
export const AudioBeforeLose = new Audio(beforeBang);
export const AudioNewGame = new Audio(gogo);
export const AudioStartMusic = new Audio(startMusic);
export const AudioWinMusic = new Audio(winMusic);
export const AudioClear = new Audio(clear);

let newVolume;

function setVolume(volume) {
  AudioClick.volume = volume;
  AudioWin.volume = volume;
  AudioSetFlag.volume = volume;
  AudioLose.volume = volume;
  AudioStartGame.volume = volume;
  AudioBeforeLose.volume = volume;
  AudioNewGame.volume = volume;
  AudioStartMusic.volume = volume;
  AudioWinMusic.volume = volume;
  AudioClear.volume = volume;
}

export function setNewVolume() {
  const slider = document.querySelector('.aside__percentage');
  newVolume = slider.value / 100;
  document.querySelector('.aside__sound').classList.remove('aside__sound--off');
  setVolume(newVolume);
}

export function setVolumeOff() {
  document.querySelector('.aside__sound').classList.toggle('aside__sound--off');
  if (document.querySelector('.aside__sound').classList.contains('aside__sound--off')) {
    const volumeOff = 0;
    setVolume(volumeOff);
  } else {
    const slider = document.querySelector('.aside__percentage');
    newVolume = slider.value / 100;
    setVolume(newVolume);
  }
}
