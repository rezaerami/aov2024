const path = require('path');
const { genericParser } = require('../..//utils/input.utils');
const { timer } = require('../..//utils/timer.utils');
const { sum } = require('../../utils/math.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-1.txt');

const input = genericParser(inputFilePath, '\n\n', (chunk) =>
  sum(chunk.split('\n').map(Number)),
);
timer.start();

const elvesStorage = input.sort((a, b) => (a < b ? 1 : -1));

const partOne = elvesStorage[0];
const partTwo = sum(elvesStorage.slice(0, 3));

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
