const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');

const inputFilePath = path.resolve('inputs', 'day-18.txt');
timer.start();

const input = readInput(inputFilePath);
const bytePositions = input.map((cell) => cell.split(',').map(Number));

const gridSize = 71;
const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function calculateShortestPath(grid) {
  const queue = [[0, 0, 0]];
  const visited = new Set();
  visited.add(`0,0`);

  while (queue.length) {
    const [x, y, steps] = queue.shift();
    if (x === gridSize - 1 && y === gridSize - 1) return steps;
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 &&
        nx < gridSize &&
        ny >= 0 &&
        ny < gridSize &&
        grid[ny][nx] === '.' &&
        !visited.has(`${nx},${ny}`)
      ) {
        queue.push([nx, ny, steps + 1]);
        visited.add(`${nx},${ny}`);
      }
    }
  }
  return false;
}

function computeMinimumSteps() {
  const grid = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill('.'),
  );
  for (let i = 0; i < 1024; i++) {
    const [x, y] = bytePositions[i];
    grid[y][x] = '#';
  }
  return calculateShortestPath(grid);
}

function findBlockingByte() {
  const grid = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill('.'),
  );
  for (let i = 0; i < bytePositions.length; i++) {
    const [x, y] = bytePositions[i];
    grid[y][x] = '#';
    if (!calculateShortestPath(grid)) return `${x},${y}`;
  }
}

const resultPartOne = computeMinimumSteps();
const resultPartTwo = findBlockingByte();

console.table({
  'Part 1': resultPartOne,
  'Part 2': resultPartTwo,
  'Duration(ms)': timer.end(),
});
