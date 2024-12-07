const path = require('path');
const fs = require('fs');
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

function lineOfSight(map, startX, startY, direction) {
  const result = [];
  const [dx, dy] = directions[direction];
  let x = startX + dx;
  let y = startY + dy;
  let hasWall = false;

  while (x >= 0 && y >= 0 && x < map.length && y < map[0].length) {
    if (map[x][y] === '#') {
      hasWall = true;
      break;
    }
    result.push([x, y, direction]);
    x += dx;
    y += dy;
  }

  return { result, hasWall };
}

function causesLoop(visitedTiles, losTiles) {
  return losTiles.some(([x, y, direction]) =>
    visitedTiles.find(
      (item) => item[0] === x && item[1] === y && item[2] === direction,
    ),
  );
}

const stuckPositions = [];
const walk = (map) => {
  let guardPos = find2d(map, '^'); // Initial position
  let direction = '^'; // Start direction
  const visitedTiles = [[...guardPos, map[guardPos[0]][guardPos[1]]]];
  let stuckPossibilities = 0;

  while (true) {
    const [x, y] = guardPos;
    const [dx, dy] = directions[direction];
    const newPos = [x + dx, y + dy];

    if (map[newPos[0]][newPos[1]] === '#') {
      direction = rotateGuard(direction);
    } else {
      guardPos = newPos;
      map[newPos[0]][newPos[1]] = direction;
      map[x][y] = '.';

      if (
        !visitedTiles.find(
          (item) => item[0] === newPos[0] && item[1] === newPos[1],
        )
      ) {
        visitedTiles.push([x, y, direction]);
      }

      const { result: losTiles, hasWall } = lineOfSight(
        map,
        x,
        y,
        rotateGuard(direction),
      );
      const { result: actualLosTiles, hasWall: actualHasWall } = lineOfSight(
        map,
        x,
        y,
        direction,
      );
      const { result: nextLosTiles, hasWall: nextHasWall } = lineOfSight(
        map,
        ...newPos,
        rotateGuard(direction),
      );
      if (
        causesLoop(visitedTiles, losTiles) ||
        (hasWall && actualHasWall && nextHasWall&& actualLosTiles.length <= 1) ||
        (actualHasWall && nextHasWall && nextLosTiles.length < 1)
      ) {
        stuckPositions.push(newPos.join(','));
        stuckPossibilities++;
      }
    }
    if (isOnBorder(...guardPos)) break;
  }

  return { visitedTiles, stuckPossibilities };
};

const { stuckPossibilities, visitedTiles } = walk(
  JSON.parse(JSON.stringify(input)),
);
const partOne = visitedTiles.length;
const partTwo = stuckPossibilities;

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

fs.writeFileSync(path.resolve('day-6-new.output.txt'), output, 'utf-8');
console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
