const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-4.txt');
const input = readInput(inputFilePath);

timer.start();

const parseRanges = (item) =>
  item.replace(/(,|-)/g, ' ').split(' ').map(Number);

const isFullyContained = ([a, b, c, d]) =>
  (c >= a && d <= b) || (c <= a && d >= b);
const hasOverlap = ([a, b, c, d]) => (c >= a && c <= b) || (a >= c && a <= d);

const solvePartOne = () =>
  input.map(parseRanges).filter(isFullyContained).length;
const solvePartTwo = () => input.map(parseRanges).filter(hasOverlap).length;

console.table({
  'Part 1': solvePartOne(),
  'Part 2': solvePartTwo(),
  'Duration(ms)': timer.end(),
});
