const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { sum } = require('../../utils/math.utils');

const inputFilePath = path.resolve('inputs', '2025', 'day-2.txt');
const ranges = readInput(inputFilePath, false).trim().split(',');

function isRepeated(str) {
  if (str.length < 2) return false;
  return (str + str).slice(1, -1).includes(str);
}

timer.start();

const partOne = [];
const partTwo = [];

for (const range of ranges) {
  const [start, end] = range.split('-').map(Number);

  for (let n = start; n <= end; n++) {
    const s = n.toString();
    const len = s.length;

    if (len % 2 === 0) {
      const half = len / 2;
      if (s.slice(0, half) === s.slice(half)) {
        partOne.push(n);
      }
    }

    if (isRepeated(s)) {
      partTwo.push(n);
    }
  }
}
console.table({
  'Part 1': sum(partOne),
  'Part 2': sum(partTwo),
  'Duration(ms)': timer.end(),
});
