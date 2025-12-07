const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2025', 'day-5.txt');

const input = readInput(inputFilePath, false);
const [rangeSection, idSection] = input.split('\n\n');

const ranges = rangeSection
  .trim()
  .split('\n')
  .map((line) => line.split('-').map(Number));

const ids = idSection.trim().split('\n').map(Number);

timer.start();

function partOne(ranges, ids) {
  let total = 0;

  for (const id of ids) {
    for (const [min, max] of ranges) {
      if (id >= min && id <= max) {
        total++;
        break;
      }
    }
  }

  return total;
}

function partTwo(ranges) {
  if (ranges.length === 0) return 0;

  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);

  const merged = [];
  let [curStart, curEnd] = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];

    if (start <= curEnd + 1) {
      curEnd = Math.max(curEnd, end);
    } else {
      merged.push([curStart, curEnd]);
      [curStart, curEnd] = [start, end];
    }
  }

  merged.push([curStart, curEnd]);

  let count = 0;
  for (const [min, max] of merged) {
    count += max - min + 1;
  }

  return count;
}

console.table({
  'Part 1': partOne(ranges, ids),
  'Part 2': partTwo(ranges),
  'Duration(ms)': timer.end(),
});
