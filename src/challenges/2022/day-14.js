const path = require('path');
const { genericParser } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-14.txt');

const input = genericParser(inputFilePath, '\n', (line) =>
  line.split(' -> ').map((point) => point.split(',').map(Number)),
);

timer.start();

const createCave = (paths, withFloor = false) => {
  const cave = new Map();
  let maxHeight = 0;

  paths.forEach((path) => {
    for (let i = 0; i < path.length - 1; i++) {
      let [x1, y1] = path[i];
      let [x2, y2] = path[i + 1];

      if (x1 === x2) {
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
          cave.set(`${x1},${y}`, '#');
          maxHeight = Math.max(maxHeight, y);
        }
      } else {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
          cave.set(`${x},${y1}`, '#');
          maxHeight = Math.max(maxHeight, y1);
        }
      }
    }
  });

  if (withFloor) maxHeight += 2;
  return [cave, maxHeight, withFloor];
};

function simulateSand(input, withFloor = false) {
  const [cave, maxHeight] = createCave(input, withFloor);
  const sandSource = [500, 0];
  let sandCount = withFloor ? 1 : 0;

  function isEmpty(x, y) {
    return !cave.has(`${x},${y}`) && (!withFloor || y < maxHeight);
  }

  function dropSand() {
    let [x, y] = sandSource;

    while (y < maxHeight) {
      if (isEmpty(x, y + 1)) {
        y += 1;
      } else if (isEmpty(x - 1, y + 1)) {
        x -= 1;
        y += 1;
      } else if (isEmpty(x + 1, y + 1)) {
        x += 1;
        y += 1;
      } else {
        cave.set(`${x},${y}`, 'o');
        return !(x === 500 && y === 0);
      }
    }

    return false;
  }

  while (dropSand()) {
    sandCount++;
  }

  return sandCount;
}

const partOne = simulateSand(input);
const partTwo = simulateSand(input, true);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
