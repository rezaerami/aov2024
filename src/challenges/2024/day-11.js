const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2024', 'day-11.txt');

const input = readInput(inputFilePath)[0].split(' ').map(Number);
timer.start();

const numbers = [...input];
function dp(numbers, blinks, cache = new Map()) {
  const cacheKey = `${numbers.join(',')}:${blinks}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (!blinks) {
    return numbers.length;
  }

  let count = 0;

  for (const number of numbers) {
    if (number === 0) {
      count += dp([1], blinks - 1, cache);
    } else if (number.toString().length % 2 === 0) {
      const length = number.toString().length;
      const firstPart = Number(number.toString().substring(0, length / 2));
      const secondPart = Number(number.toString().substring(length / 2));

      count += dp([firstPart, secondPart], blinks - 1, cache);
    } else {
      count += dp([number * 2024], blinks - 1, cache);
    }
  }

  cache.set(cacheKey, count);

  return count;
}

const partOne = dp(numbers, 25);
const partTwo = dp(numbers, 75);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
