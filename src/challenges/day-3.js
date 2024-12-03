const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');

const inputFilePath = path.resolve('inputs', 'day-3.txt');

const input = readInput(inputFilePath).join('');
timer.start();

const partOne = [...input.matchAll(/mul\((\d+),(\d+)\)/gm)].reduce(
  (acc, curr) => acc + curr[1] * curr[2],
  0,
);

const partTwo = [
  ...input
    .replace(/don't\(\)(.*?)(do\(\)|$|\n)/gm, '')
    .matchAll(/mul\((\d+),(\d+)\)/gm),
].reduce((acc, curr) => acc + curr[1] * curr[2], 0);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
