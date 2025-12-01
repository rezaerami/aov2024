const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2025', 'day-1.txt');

const input = readInput(inputFilePath).map((line) => {
  const dir = line[0];
  const num = Number(line.slice(1));
  return dir === 'L' ? -num : num;
});

const INITIAL_NUMBER = 50;

timer.start();

function rotate(value) {
  return ((value % 100) + 100) % 100;
}

function partOne(steps) {
  let current = INITIAL_NUMBER;
  let result = 0;

  for (const step of steps) {
    current = rotate(current + step);
    if (current === 0) result++;
  }

  return result;
}

function countZeroCrossings(start, move) {
  let steps = Math.abs(move);
  let direction = move > 0 ? 1 : -1;

  let passes = Math.floor(steps / 100);

  let leftover = steps % 100;
  let pos = start;

  for (let i = 0; i < leftover; i++) {
    pos = rotate(pos + direction);
    if (pos === 0) passes++;
  }

  return passes;
}

function partTwo(steps) {
  let current = INITIAL_NUMBER;
  let result = 0;

  for (const step of steps) {
    result += countZeroCrossings(current, step);
    current = rotate(current + step);
  }

  return result;
}

console.table({
  'Part 1': partOne(input),
  'Part 2': partTwo(input),
  'Duration(ms)': timer.end(),
});
