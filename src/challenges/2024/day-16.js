const path = require('path');
const { parseInputToCells } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2024', 'day-16.txt');

const input = parseInputToCells(inputFilePath);
const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

timer.start();

function parseGrid(grid) {
  let start = null;
  let end = null;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 'S') start = [r, c];
      if (grid[r][c] === 'E') end = [r, c];
    }
  }
  return [start, end];
}

function findBestPath(grid) {
  const [start, end] = parseGrid(grid);
  const queue = [];
  const visited = new Set();
  queue.push([start[0], start[1], 1, 0, [[...start]]]);
  const result = [];

  while (queue.length) {
    queue.sort((a, b) => a[3] - b[3]);
    const current = queue.shift();
    const [x, y, direction, score, path] = current;

    const key = `${x}-${y}-${direction}`;
    if (visited.has(key) || grid[x][y] === '#') continue;
    visited.add(key);

    if (x === end[0] && y === end[1]) {
      result.push({
        score,
        path,
      });
    }

    const [dx, dy] = directions[direction];
    const [nx, ny] = [x + dx, y + dy];
    queue.push([nx, ny, direction, score + 1, [...path, [nx, ny]]]);

    for (const d of [-1, 1]) {
      const di = (d + direction + 4) % 4;
      queue.push([x, y, di, score + 1000, [...path]]);
    }
  }

  return result[0];
}

function findSimilarPaths(grid, rateLimit) {
  const [start, end] = parseGrid(grid);
  const queue = [];
  const visited = new Map();
  queue.push([start[0], start[1], 1, 0, [[...start]]]);
  const result = [];

  while (queue.length) {
    const current = queue.shift();
    const [x, y, direction, score, path] = current;
    if (score > rateLimit) continue;

    const key = `${x}-${y}-${direction}`;
    if ((visited.has(key) && visited.get(key) < score) || grid[x][y] === '#')
      continue;
    visited.set(key, score);

    if (x === end[0] && y === end[1] && score === rateLimit) {
      result.push({
        score,
        path,
      });
      continue;
    }

    const [dx, dy] = directions[direction];
    const [nx, ny] = [x + dx, y + dy];
    queue.push([nx, ny, direction, score + 1, [...path, [nx, ny]]]);

    for (const d of [-1, 1]) {
      const di = (d + direction + 4) % 4;
      queue.push([x, y, di, score + 1000, [...path]]);
    }
  }

  return result;
}

const bestScore = findBestPath(input);
const similarPaths = findSimilarPaths(input, bestScore.score);
const uniqueCells = new Set(
  similarPaths.flatMap((item) => item.path.map(([x, y]) => `${x}-${y}`)),
);

console.table({
  'Part 1': bestScore.score,
  'Part 2': uniqueCells.size,
  'Duration(ms)': timer.end(),
});
