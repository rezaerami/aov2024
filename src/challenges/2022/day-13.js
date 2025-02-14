const path = require('path');
const { genericParser } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-13.txt');

const input = genericParser(inputFilePath, '\n\n', (section) =>
  JSON.parse(`[${section.split('\n').join(',')}]`),
);
timer.start();

const compare = (left, right) => {
  if (Number.isInteger(left) && Number.isInteger(right)) return left - right;

  if (!Array.isArray(left)) left = [left];
  if (!Array.isArray(right)) right = [right];

  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    const result = compare(left[i], right[i]);
    if (result !== 0) return result;
  }

  return left.length - right.length;
};

const sumOfOrderedPair = (pairs) => {
  return pairs.reduce(
    (sum, [left, right], index) =>
      compare(left, right) < 0 ? sum + index + 1 : sum,
    0,
  );
};

const DIVIDER_PACKETS = [[[2]], [[6]]];
const findDecoderKey = (input) => {
  const packets = input.flat().concat(DIVIDER_PACKETS);

  packets.sort(compare);

  const index2 =
    packets.findIndex((p) => JSON.stringify(p) === JSON.stringify([[2]])) + 1;
  const index6 =
    packets.findIndex((p) => JSON.stringify(p) === JSON.stringify([[6]])) + 1;

  return index2 * index6;
};

const partOne = sumOfOrderedPair(input);
const partTwo = findDecoderKey(input);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
