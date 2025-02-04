const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-6.txt');

const input = readInput(inputFilePath, false);
timer.start();

const findSignal = (chunkSize) => {
  for (let i = 0; i < input.length - chunkSize - 1; i++) {
    if (new Set(input.slice(i, i + chunkSize).split('')).size === chunkSize)
      return i + chunkSize;
  }
};

console.table({
  'Part 1': findSignal(4),
  'Part 2': findSignal(14),
  'Duration(ms)': timer.end(),
});
