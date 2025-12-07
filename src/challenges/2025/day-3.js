const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { sum } = require('../../utils/math.utils');

const inputFilePath = path.resolve('inputs', '2025', 'day-3.txt');

const input = readInput(inputFilePath);
timer.start();

function maxKDigits(str, k) {
  if (k <= 0) return '';
  if (k >= str.length) return str;

  const n = str.length;
  let toRemove = n - k;
  const stack = [];

  for (const ch of str) {
    while (stack.length > 0 && toRemove > 0 && stack[stack.length - 1] < ch) {
      stack.pop();
      toRemove--;
    }
    stack.push(ch);
  }
  return Number(stack.slice(0, k).join(''));
}
const partOne = sum(input.map((item) => maxKDigits(item, 2)));
const partTwo = sum(input.map((item) => maxKDigits(item, 12)));

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
