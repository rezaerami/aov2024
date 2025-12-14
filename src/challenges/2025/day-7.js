const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2025', 'day-7.txt');

const input = readInput(inputFilePath).map((line) => line.trim().split(''));
timer.start();

function countSplits(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  const startCol = grid[0].indexOf('S');
  if (startCol === -1) throw new Error('No S found');

  let queue = [{ r: 1, c: startCol }];
  const seen = new Set();

  let splits = 0;

  function key(r, c) {
    return `${r},${c}`;
  }

  while (queue.length > 0) {
    const { r, c } = queue.shift();

    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;

    const state = key(r, c);
    if (seen.has(state)) continue;
    seen.add(state);

    const cell = grid[r][c];

    if (cell === '.' || cell === 'S') {
      queue.push({ r: r + 1, c });
    } else if (cell === '^') {
      splits++;
      queue.push({ r: r + 1, c: c - 1 });
      queue.push({ r: r + 1, c: c + 1 });
    }
  }

  return splits;
}

function countTimelines(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  const startCol = grid[0].indexOf('S');
  if (startCol === -1) throw new Error('No S found');

  const ways = Array.from({ length: rows }, () => Array(cols).fill(0n));

  ways[0][startCol] = 1n;
  let exits = 0n;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const w = ways[r][c];
      if (w === 0n) continue;

      const cell = grid[r][c];

      if (cell === '.' || cell === 'S') {
        const nr = r + 1;
        const nc = c;

        if (nr >= rows) {
          exits += w;
        } else {
          ways[nr][nc] += w;
        }
      } else if (cell === '^') {
        const nr = r + 1;

        let nc = c - 1;
        if (nr < rows && nc >= 0 && nc < cols) {
          ways[nr][nc] += w;
        } else {
          exits += w;
        }

        nc = c + 1;
        if (nr < rows && nc >= 0 && nc < cols) {
          ways[nr][nc] += w;
        } else {
          exits += w;
        }
      }
    }
  }

  return exits;
}

const partOne = countSplits(input);
const partTwo = parseInt(countTimelines(input).toString());

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
