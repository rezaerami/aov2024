const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');
const { sum } = require('../utils/math.utils');

const inputFilePath = path.resolve('inputs', 'day-3.txt');

const input = readInput(inputFilePath).join('');
timer.start();

const pattern = /mul\((\d+),(\d+)\)/gm;
const partOne = sum(
  [...input.matchAll(pattern)].map((curr) => curr[1] * curr[2]),
);

const partTwo = sum(
  [...input.replace(/don't\(\)(.*?)(do\(\)|$|\n)/gm, '').matchAll(pattern)].map(
    (curr) => curr[1] * curr[2],
  ),
);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
