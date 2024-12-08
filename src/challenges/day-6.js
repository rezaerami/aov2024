const fs = require('fs');
const path = require('path');
const { parseInputToCells } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');
const { find2d } = require('../utils/array.utils');

const inputFilePath = path.resolve('inputs', 'day-6.txt');

const input = parseInputToCells(inputFilePath);
timer.start();

const isOnBorder = (x, y) => {
  const boundaries = [0, 0, input.length - 1, input[0].length - 1];
  return boundaries.includes(x) || boundaries.includes(y);
};

const directions = {
  '>': [0, 1],
  v: [1, 0],
  '<': [0, -1],
  '^': [-1, 0],
};

function rotateGuard(current) {
  const keys = Object.keys(directions);
  const currentIndex = keys.indexOf(current);
  const nextIndex = (currentIndex + 1) % keys.length;
  return keys[nextIndex];
}

const alteredMaps = {};
const walk = (map, simulate) => {
  let guardPos = find2d(map, '^');
  const visitedTiles = [[...guardPos, map[guardPos[0]][guardPos[1]]]];

  let stuck = false;

  while (true) {
    if (isOnBorder(...guardPos)) break;

    const [x, y] = guardPos;
    const guard = map[x][y];
    const newPos = [
      guardPos[0] + directions[guard][0],
      guardPos[1] + directions[guard][1],
    ];

    const rotatedGuard = rotateGuard(guard);
    const stuckPos = visitedTiles.find(
      (item) =>
        item[0] === newPos[0] && item[1] === newPos[1] && item[2] === guard,
    );
    if (stuckPos) {
      stuck = true;
      break;
    }

    if (map[newPos[0]][newPos[1]] === '#') {
      map[x][y] = rotatedGuard;
    } else {
      if (
        !visitedTiles.find(
          (item) => item[0] === newPos[0] && item[1] === newPos[1],
        )
      ) {
        visitedTiles.push([...newPos, guard]);
        if (simulate) {
          const newMap = JSON.parse(JSON.stringify(input));
          newMap[newPos[0]][newPos[1]] = '#';
          alteredMaps[newPos.join(',')] = newMap;
        }
      }

      guardPos = newPos;
      map[x][y] = '.';
      map[newPos[0]][newPos[1]] = guard;
    }
  }

  return { visitedTiles, stuck };
};

const stuckPositions = [];
const {visitedTiles} = walk(JSON.parse(JSON.stringify(input)), true);
const partOne = visitedTiles.length;
Object.keys(alteredMaps).filter((key) => {
  const { stuck } = walk(alteredMaps[key], false);
  if (stuck) stuckPositions.push(key);
});

const output = input
  .map((line, i) =>
    line
      .map((char, j) => {
        if (stuckPositions.includes(`${i},${j}`)) return 'o';

        // if (visitedTiles.some(([vi, vj]) => vi === i && vj === j)) return 'X';

        return char;
      })
      .join(''),
  )
  .join('\n');

fs.writeFileSync(path.resolve('day-6.output.txt'), output, "utf-8");

console.table({
  'Part 1': partOne,
  'Part 2': stuckPositions.length,
  'Duration(ms)': timer.end(),
});
