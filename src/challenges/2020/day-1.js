const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2020', 'day-1.txt');

const nums = readInput(inputFilePath).map(Number).filter(Number.isFinite);

timer.start();

let partOne = null;
{
  const seen = new Set();
  for (const x of nums) {
    const y = 2020 - x;
    if (seen.has(y)) {
      partOne = x * y;
      break;
    }
    seen.add(x);
  }
}

let partTwo = null;
{
  const arr = [...nums].sort((a, b) => a - b);
  const target = 2020;

  outer: for (let i = 0; i < arr.length - 2; i++) {
    // Optional pruning
    if (arr[i] + arr[i + 1] + arr[i + 2] > target) break;
    if (arr[i] + arr[arr.length - 2] + arr[arr.length - 1] < target) continue;

    let l = i + 1;
    let r = arr.length - 1;
    while (l < r) {
      const sum = arr[i] + arr[l] + arr[r];
      if (sum === target) {
        partTwo = arr[i] * arr[l] * arr[r];
        break outer;
      }
      if (sum < target) l++;
      else r--;
    }
  }
}

console.table({
  'Part 1': partOne ?? 'No pair found',
  'Part 2': partTwo ?? 'No triple found',
  'Duration(ms)': timer.end(),
});
