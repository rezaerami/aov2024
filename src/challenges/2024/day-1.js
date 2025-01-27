const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2024', 'day-1.txt');

const input = readInput(inputFilePath);
const lists = { left: [], right: [] };

timer.start();
/**
 * separate lists into two arrays
 */
input.forEach((line) => {
  const [left, right] = line.split('   ');
  lists.left.push(left);
  lists.right.push(right);
});

/**
 * sort arrays
 */
lists.left.sort((a, b) => a - b);
lists.right.sort((a, b) => a - b);

/**
 * find distance of corresponding item in right list in left list
 */
const partOne = lists.left.reduce((result, item, index) => {
  return result + Math.abs(item - lists.right[index]);
}, 0);

/**
 * find number of repeats in both lists and multiply them in each other
 */
const getRepeats = (array) =>
  array.reduce((result, item) => {
    if (!result?.[item]) result[item] = 0;

    result[item] += 1;

    return result;
  }, {});

const leftRepeats = getRepeats(lists.left);
const rightRepeats = getRepeats(lists.right);
const partTwo = Object.keys(leftRepeats).reduce((result, key) => {
  return result + Number(key) * leftRepeats[key] * (rightRepeats?.[key] ?? 0);
}, 0);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
