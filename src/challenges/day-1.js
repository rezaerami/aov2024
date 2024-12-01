const path = require('path');
const { readInput } = require('../utils/input.utils');

const inputFilePath = path.resolve('inputs', 'day-1.txt');

const input = readInput(inputFilePath);
const lists = { left: [], right: [] };

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
 * find number of matching values in right list and multiply by value in left list
 */
const partTwo = lists.left.reduce((result, item) => {
  return result + item * lists.right.filter((value) => item === value).length;
}, 0);

console.table({ 'Part 1': partOne, 'Part 2': partTwo });
