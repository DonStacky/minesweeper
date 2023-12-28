export default function bombCreates(cellsQty, bombsQty, initCell) {
  const bomb = [...Array(cellsQty).keys()]
    .filter((item) => item !== initCell)
    .sort(() => Math.random() - 0.5)
    .slice(0, bombsQty);

  return bomb;
}
