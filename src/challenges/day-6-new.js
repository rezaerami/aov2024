const path = require('path');
const fs = require('fs');
const { parseInputToCells } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');
const { find2d } = require('../utils/array.utils');

const inputFilePath = path.resolve('inputs', 'day-6.txt');

const input = parseInputToCells(inputFilePath);
timer.start();

const isOutOfBoundaries = (x, y) =>
  x < 0 || x >= input.length || y < 0 || y >= input.length;

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

const getKey = (position, direction) =>
  `${position.join('-')}${direction ? `-${direction}` : ''}`;

const map = JSON.parse(JSON.stringify(input));

const startSign = '^';
const start = find2d(map, startSign);
let guardPos = start; // Initial position
let direction = startSign; // Start direction

const visitedTiles = new Set();
const visitedCells = new Set();
const queue = [[...guardPos, direction, null, new Set()]];
const loopPossibilities = [];
const log = [];
while (queue.length) {
  const queueItem = queue.shift();
  const [x, y, dir, causedBy, history] = queueItem;

  const key = getKey([x, y], dir);

  if (history.has(key) || visitedTiles.has(key)) {
    if (causedBy) {
      loopPossibilities.push(causedBy)
    }
    continue;
  }
  history.add(key);

  if (!causedBy) {
    visitedTiles.add(key);
    visitedCells.add(getKey([x, y]));
  }

  const [dx, dy] = directions[dir];
  const newPos = [x + dx, y + dy];
  if (isOutOfBoundaries(...newPos)) continue;

  if (map[newPos[0]][newPos[1]] === '#') {

    queue.unshift([x, y, rotateGuard(dir), causedBy, history]);
  } else {
    queue.unshift([...newPos, dir, causedBy, history]);
    if (!causedBy) {
      // queue.unshift([x, y, rotateGuard(dir), newPos, new Set()]);
      const { hasWall, result: los } = lineOfSight(map, x, y, rotateGuard(dir));
      if (hasWall && los.length) {
        const lastLos = los[los.length - 1];
        queue.unshift([...lastLos, newPos, new Set()]);
      }
    }
  }
}

const output = input
  .map((line, i) =>
    line
      .map((char, j) => {
        if (loopPossibilities.find(([li, lj]) => li === i && lj === j))
          return 'o';

        return char;
      })
      .join(''),
  )
  .join('\n');

fs.writeFileSync(path.resolve('day-6-new.output.txt'), output, 'utf-8');
fs.writeFileSync(
  path.resolve('day-6-new.log.json'),
  JSON.stringify(log, null, 2),
  'utf-8',
);

const partOne = visitedCells.size;
const partTwo = loopPossibilities.length;

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
