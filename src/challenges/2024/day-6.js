const path = require('path');
const { parseInputToCells } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { find2d, alterArray, isOutOfBoundaries} = require('../../utils/array.utils');

const inputFilePath = path.resolve('inputs', '2024', 'day-6.txt');

const input = parseInputToCells(inputFilePath);
timer.start();

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

const getKey = (position, direction) =>
  `${position.join('-')}${direction ? `-${direction}` : ''}`;

const walk = (map) => {
  const startSign = '^';
  const start = find2d(map, startSign);
  let guardPos = start; // Initial position
  let direction = startSign; // Start direction

  const visitedTiles = new Set();
  const visitedCells = new Set();
  const queue = [[...guardPos, direction]];
  let stuck = false;

  while (queue.length) {
    const queueItem = queue.shift();
    const [x, y, dir] = queueItem;

    const key = getKey([x, y], dir);

    if (visitedTiles.has(key)) {
      stuck = true;
      break;
    }

    visitedTiles.add(key);
    visitedCells.add(getKey([x, y]));

    const [dx, dy] = directions[dir];
    const newPos = [x + dx, y + dy];

    if (isOutOfBoundaries(map, ...newPos)) continue;

    if (map[newPos[0]][newPos[1]] === '#') {
      queue.unshift([x, y, rotateGuard(dir)]);
    } else {
      queue.unshift([...newPos, dir]);
    }
  }

  return { stuck, visitedCells, visitedTiles };
};

const map = JSON.parse(JSON.stringify(input));
const { visitedCells } = walk(map);
const candidates = [...visitedCells]
  .slice(1)
  .map((key) => key.split('-').map(Number));
const alteredMaps = candidates.map((item) => alterArray(map, ...item, '#'));
const loops = alteredMaps.filter((item) => walk(item).stuck);

const partOne = visitedCells.size;
const partTwo = loops.length;

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
