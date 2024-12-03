const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');

const inputFilePath = path.resolve('inputs', 'day-3.txt');

const input = readInput(inputFilePath).join('');
timer.start();

let partOne = 0;
for (const match of input.matchAll(/mul\((\d+),(\d+)\)/gm)) {
  const [, left, right] = match;
  partOne += left * right;
}
let partTwo = 0;

const alteredInput = readInput(inputFilePath)
  .join()
  .replace(/don't\(\)(.*?)(do\(\)|$|\n)/gm, '');
for (const match of alteredInput.matchAll(/mul\((\d+),(\d+)\)/gm)) {
  const [, left, right] = match;

  partTwo += left * right;
}

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
