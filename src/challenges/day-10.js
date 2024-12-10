const path = require('path');
const { parseInputToCells } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');
const { isOutOfBoundaries } = require('../utils/array.utils');

const inputFilePath = path.resolve('inputs', 'day-10.txt');

const input = parseInputToCells(inputFilePath).map((line) => line.map(Number));
timer.start();

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const starts = [];
input.forEach((line, i) => {
  line.forEach((number, j) => {
    if (!number) starts.push([i, j, []]);
  });
});
const queue = starts;
const paths = [];
while (queue.length) {
  const [x, y, h] = queue.shift();
  if (isOutOfBoundaries(input, x, y)) continue;
  const value = input[x][y];
  if (value === 9) {
    paths.push(`${h[0]},${x}-${y}`);
  }

  for (let i = 0; i < directions.length; i++) {
    const [nx, ny] = [x + directions[i][0], y + directions[i][1]];
    if (isOutOfBoundaries(input, nx, ny)) continue;

    const nv = input[nx][ny];
    if (nv - value === 1) queue.push([nx, ny, [...h, [x, y].join("-")]]);
  }
}

const partOne = new Set(paths).size;
const partTwo = paths.length;

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
