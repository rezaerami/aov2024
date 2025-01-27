const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2024', 'day-2.txt');
const input = readInput(inputFilePath).map((report) =>
  report.split(' ').map((level) => Number(level)),
);

timer.start();

const isSafeReport = (report) => {
  let isSafe = true;
  let expectedOrder = null;
  for (let j = 0; j < report.length - 1; j++) {
    const current = report[j];
    const next = report[j + 1];
    if (current === next || Math.abs(current - next) > 3) {
      isSafe = false;
      continue;
    }
    const actualOrder = current > next ? 'DESC' : 'ASC';
    if (!expectedOrder) {
      expectedOrder = actualOrder;
    } else {
      if (expectedOrder !== actualOrder) {
        isSafe = false;
      }
    }
  }
  return isSafe;
};

const isPartiallySafe = (report) => {
  if (isSafeReport(report)) {
    return true;
  }

  for (let i = 0; i < report.length; i++) {
    const modified = report.slice(0, i).concat(report.slice(i + 1));
    if (isSafeReport(modified)) {
      return true;
    }
  }

  return false;
};

let safeReportsCount = 0;
let partiallySafeReportsCount = 0;
for (let i = 0; i < input.length; i++) {
  if (isSafeReport(input[i])) safeReportsCount++;
  if (isPartiallySafe(input[i])) partiallySafeReportsCount++;
}

console.table({
  'Part 1': safeReportsCount,
  'Part 2': partiallySafeReportsCount,
  'Duration(ms)': timer.end(),
});
