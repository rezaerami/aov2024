const path = require('path');
const { parseInputToCells } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { getNeighbors } = require('../../utils/array.utils');

const inputFilePath = path.resolve('inputs', '2025', 'day-4.txt');
const originalGrid = parseInputToCells(inputFilePath);

const isRoll = (cell) => cell === '@';

function canAccess(grid, y, x) {
  if (!isRoll(grid[y][x])) return false;
  const neighbors = getNeighbors(grid, y, x, true);
  const rollCount = neighbors.filter((n) => isRoll(n.value)).length;
  return rollCount < 4;
}

function cloneGrid(grid) {
  return grid.map((row) => [...row]);
}

function partOne(grid) {
  let total = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (canAccess(grid, y, x)) {
        total++;
      }
    }
  }

  return total;
}

function partTwo(grid) {
  const input = cloneGrid(grid);
  let total = 0;

  while (true) {
    const remaining = [];

    for (let y = 0; y < input.length; y++) {
      for (let x = 0; x < input[y].length; x++) {
        if (!isRoll(input[y][x])) continue;

        remaining.push({ y, x });

        if (canAccess(input, y, x)) {
          remaining.pop();
          input[y][x] = '.';
          total++;
        }
      }
    }

    const frozen = remaining.every(({ y, x }) => !canAccess(input, y, x));
    if (frozen) break;
  }

  return total;
}

timer.start();

console.table({
  'Part 1': partOne(originalGrid),
  'Part 2': partTwo(originalGrid),
  'Duration(ms)': timer.end(),
});
