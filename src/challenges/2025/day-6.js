const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { sum } = require('../../utils/math.utils');

const inputFilePath = path.resolve('inputs', '2025', 'day-6.txt');

const input = readInput(inputFilePath, false);
timer.start();

function computeColumns(input) {
  const lines = input
    .trim()
    .split('\n')
    .map((line) => line.trim());

  const operators = lines.pop().split(/\s+/);

  const rows = lines.map((line) => line.split(/\s+/).map(Number));

  const numCols = rows[0].length;
  const result = [];

  for (let col = 0; col < numCols; col++) {
    const op = operators[col];
    const values = rows.map((r) => r[col]);

    let value;

    if (op === '+') value = values.reduce((a, b) => a + b, 0);
    else if (op === '*') value = values.reduce((a, b) => a * b, 1);
    else if (op === '-') value = values.reduce((a, b) => a - b);
    else if (op === '/') value = values.reduce((a, b) => a / b);
    else throw new Error(`Unknown operator: ${op}`);

    result.push(value);
  }

  return result;
}
function computeColumnsPartTwo(input) {
  const lines = input.trimEnd().split('\n');

  const operatorLine = lines[lines.length - 1];
  const dataLines = lines.slice(0, -1);

  const height = dataLines.length;

  const width = Math.max(
    operatorLine.length,
    ...dataLines.map((l) => l.length),
  );

  const grid = dataLines.map((line) => line.padEnd(width, ' ').split(''));
  const opRow = operatorLine.padEnd(width, ' ').split('');

  function isBlankColumn(x) {
    if (opRow[x] !== ' ') return false;
    for (let r = 0; r < height; r++) {
      if (grid[r][x] !== ' ') return false;
    }
    return true;
  }

  const blocks = [];
  let current = null;

  for (let x = 0; x < width; x++) {
    if (isBlankColumn(x)) {
      if (current) {
        blocks.push(current);
        current = null;
      }
    } else {
      if (!current) {
        current = { left: x, right: x };
      } else {
        current.right = x;
      }
    }
  }
  if (current) blocks.push(current);

  const results = [];

  for (const { left, right } of blocks) {
    let op = null;
    for (let x = left; x <= right; x++) {
      if (opRow[x] !== ' ') {
        op = opRow[x];
        break;
      }
    }

    const numbers = [];
    for (let x = right; x >= left; x--) {
      const digits = [];
      for (let r = 0; r < height; r++) {
        const ch = grid[r][x];
        if (ch >= '0' && ch <= '9') {
          digits.push(ch);
        }
      }
      if (digits.length > 0) {
        numbers.push(Number(digits.join('')));
      }
    }

    let value;
    if (op === '+') {
      value = numbers.reduce((a, b) => a + b, 0);
    } else if (op === '*') {
      value = numbers.reduce((a, b) => a * b, 1);
    } else {
      throw new Error(`Unknown operator: ${op}`);
    }

    results.push(value);
  }

  return results;
}

const partOne = sum(computeColumns(input));
const partTwo = sum(computeColumnsPartTwo(input));

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
