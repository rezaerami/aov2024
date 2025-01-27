const path = require('path');
const { readInput } = require('../..//utils/input.utils');
const { timer } = require('../..//utils/timer.utils');
const { sum } = require('../../utils/math.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-1.txt');

const input = readInput(inputFilePath, false);
timer.start();

const elvesStorage = input
  .split('\n\n')
  .map((item) => sum(item.split('\n').map(Number)))
  .sort((a, b) => (a < b ? 1 : -1));

const partOne = elvesStorage[0];
const partTwo = sum(elvesStorage.slice(0, 3));

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
