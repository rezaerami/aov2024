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

const getKey = (position, direction) =>
  `${position.join('-')}${direction ? `-${direction}` : ''}`;

const map = JSON.parse(JSON.stringify(input));

const startSign = '^';
const start = find2d(map, startSign);
let guardPos = start; // Initial position
let direction = startSign; // Start direction

const visitedTiles = [getKey(guardPos)];
const visitedTilesWithDirection = [getKey(guardPos, direction)];

while (true) {
  const [x, y] = guardPos;
  const [dx, dy] = directions[direction];
  const newPos = [x + dx, y + dy];
  if (
    isOnBorder(...guardPos) ||
    visitedTilesWithDirection.includes(getKey(newPos, direction))
  )
    break;

  if (map[newPos[0]][newPos[1]] === '#') {
    direction = rotateGuard(direction);
  } else {
    visitedTiles.push(getKey(newPos));
    visitedTilesWithDirection.push(getKey(newPos, direction));

    guardPos = newPos;
    map[newPos[0]][newPos[1]] = direction;
    map[x][y] = '.';
  }
}

const queue = [...visitedTilesWithDirection].map((key) => {
  const [x, y, d] = key.split('-');
  return { cell: [Number(x), Number(y), d] };
});
// const queue = [{ cell: [...start, startSign] }];

let obstructionCandidate = 0;
const cache = new Set();
while (queue.length) {
  const queueItem = queue.shift();
  const {
    cell: [x, y, dir],
  } = queueItem;

  const [dx, dy] = directions[dir];
  const newCell = [x + dx, y + dy];

  if (cache.has(getKey(queueItem.cell))) {
    // already visited
    obstructionCandidate++;
    continue;
  }

  cache.add(getKey(queueItem.cell));

  const { result: rotatedLos, hasWall: rotatedHasWall } = lineOfSight(
    input,
    x,
    y,
    rotateGuard(dir),
  );
  if (!rotatedHasWall)
    //free
    continue;

  if (!rotatedLos.length) {
    //bump to a wall
    obstructionCandidate++;
    break
  }

  const lastLos = rotatedLos[rotatedLos.length - 1];
  queue.unshift({ cell: lastLos });
}

const partOne = new Set(visitedTiles).size;
const partTwo = obstructionCandidate;

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
