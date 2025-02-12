const path = require('path');
const { parseInputToCells } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { find2d, isOutOfBoundaries } = require('../../utils/array.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-12.txt');
const input = parseInputToCells(inputFilePath);

timer.start();

const getKey = ([x, y]) => `${x},${y}`;
const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const hike = (start) => {
  const end = find2d(input, 'E');
  const queue = [[...start, 0, []]];
  const visited = new Set();

  while (queue.length) {
    const [x, y, steps, path] = queue.shift();
    const key = getKey([x, y]);

    if (visited.has(key)) continue;
    visited.add(key);

    if (x === end[0] && y === end[1]) return [x, y, steps, path];

    for (const [dx, dy] of directions) {
      const nx = x - dx;
      const ny = y - dy;

      if (isOutOfBoundaries(input, nx, ny)) continue;

      const current = input[x][y];
      const next = input[nx][ny];

      if (current !== 'z' && next === 'E') continue;
      if (current === 'S' || next.charCodeAt(0) - current.charCodeAt(0) <= 1) {
        queue.push([nx, ny, steps + 1, [...path, [x, y]]]);
      }
    }
  }
  return null;
};

const start = find2d(input, 'S');
const partOne = hike(start)?.[2] || 0;

const startPositions = input
  .flatMap((row, i) => row.map((cell, j) => (cell === 'a' ? [i, j] : null)))
  .filter(Boolean);

const shortestTrack = startPositions
  .map(hike)
  .filter(Boolean)
  .sort((a, b) => a[2] - b[2])[0];

const partTwo = shortestTrack?.[2] || 0;

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration (ms)': timer.end(),
});
