const path = require('path');
const { parseInputToCells, readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');

const inputFilePath = path.resolve('inputs', 'day-8.txt');

const inputString = readInput(inputFilePath, false).replace(/\n/gm, '');
const input = parseInputToCells(inputFilePath);

timer.start();
function findAllDirectionPositions(grid, letter, enableScaling = false) {
  const positions = [];
  const nodes = new Set();

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === letter) {
        positions.push([i, j]);
      }
    }
  }

  for (let i = 0; i < positions.length; i++) {
    for (let j = 0; j < positions.length; j++) {
      if (i === j) continue;

      const [x1, y1] = positions[i];
      const [x2, y2] = positions[j];

      const rowDiff = x2 - x1;
      const colDiff = y2 - y1;

      if (enableScaling) {
        let scale = 0;
        while (true) {
          const scaledPosition = [x2 + rowDiff * scale, y2 + colDiff * scale];

          const isWithinBounds = ([row, col]) =>
            row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;

          if (!isWithinBounds(scaledPosition)) break;

          nodes.add(scaledPosition.toString());
          scale++;
        }
      } else {
        const nextPosition = [x2 + rowDiff, y2 + colDiff];

        const isWithinBounds = ([row, col]) =>
          row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;

        if (isWithinBounds(nextPosition)) {
          nodes.add(nextPosition.toString());
        }
      }
    }
  }

  return Array.from(nodes).map((str) => str.split(',').map(Number));
}

const antennas = [...new Set(inputString.match(/[^(.|#)]/gm))];
const antiNodes = new Set(
  antennas
    .flatMap((n) => findAllDirectionPositions(input, n, false))
    .map((item) => item.join('-')),
);

const extendedAntiNodes = new Set(
  antennas
    .flatMap((n) => findAllDirectionPositions(input, n, true))
    .map((item) => item.join('-')),
);

const partOne = antiNodes.size;
const partTwo = extendedAntiNodes.size;


console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
