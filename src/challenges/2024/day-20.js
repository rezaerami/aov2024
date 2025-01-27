const path = require('path');
const { parseInputToCells } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2024', 'day-20.txt');
const input = parseInputToCells(inputFilePath);

timer.start();

function findPositions(grid) {
  let start = null;
  let end = null;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'S') start = [x, y];
      if (grid[y][x] === 'E') end = [x, y];
    }
  }
  return [start, end];
}

const grid = input;

const MIN_SAVED_CELLS = 100;
const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function findPaths(input) {
  const [start, end] = findPositions(input);
  const paths = [];
  const visited = new Set();
  const queue = [[...start]];
  while (queue.length) {
    const [x, y] = queue.shift();
    paths.push([x, y]);

    if (x === end[0] && y === end[1]) break;

    visited.add(`${x},${y}`);

    for (const [dx, dy] of directions) {
      const [nx, ny] = [x + dx, y + dy];
      const withinBound =
        nx >= 0 && ny >= 0 && nx < grid[0].length && ny < grid.length;

      if (withinBound && grid[ny][nx] !== '#' && !visited.has(`${nx},${ny}`))
        queue.push([nx, ny]);
    }
  }
  return paths;
}

function calculateCheats(paths, cheatTime) {
  const savedCounts = {};
  let result = 0;

  for (let i = 0; i < paths.length - 1; i++) {
    for (let j = i + 1; j < paths.length; j++) {
      const distance = manhattanDistance(paths[i], paths[j]);
      if (distance > cheatTime) continue;

      const savedTime = j - i - distance;

      if (savedTime >= MIN_SAVED_CELLS) {
        result++;
        savedCounts[savedTime] = (savedCounts[savedTime] || 0) + 1;
      }
    }
  }

  return result;
}

function manhattanDistance([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function findCheats(input, cheatTime) {
  const paths = findPaths(input);
  return calculateCheats(paths, cheatTime);
}

console.table({
  'Part 1': findCheats(input, 2),
  'Part 2': findCheats(input, 20),
  'Duration(ms)': timer.end(),
});
