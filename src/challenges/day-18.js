const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');

const inputFilePath = path.resolve('inputs', 'day-18.txt');
timer.start();

const input = readInput(inputFilePath);
const bytePositions = input.map((cell) => cell.split(',').map(Number));

const gridSize = 71;
const threshold = 1024;
const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function findResults() {
  const grid = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill('.'),
  );
  let shortestPath = null;
  let blockingByte = null;

  for (let i = 0; i < bytePositions.length; i++) {
    const [x, y] = bytePositions[i];
    grid[y][x] = '#';

    const currentPath = calculateShortestPath(grid);

    if (i < threshold) shortestPath = currentPath;
    if (!currentPath) {
      blockingByte = `${x},${y}`;
      break;
    }
  }

  return { shortestPath, blockingByte };
}

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

const { shortestPath, blockingByte } = findResults();

console.table({
  'Part 1': shortestPath,
  'Part 2': blockingByte,
  'Duration(ms)': timer.end(),
});
