const path = require('path');
const { sum } = require('../../utils/math.utils');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const input = readInput(path.resolve('inputs', '2024', 'day-21.txt'));

timer.start();

const directions = {
  '^': [0, -1],
  '>': [1, 0],
  v: [0, 1],
  '<': [-1, 0],
};

const numpad = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  [null, '0', 'A'],
];

const dirpad = [
  [null, '^', 'A'],
  ['<', 'v', '>'],
];

const bfs = (map, start, end) => {
  const getStartPosition = (map, start) => {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === start) return [x, y];
      }
    }
    return [];
  };

  const initialPosition = getStartPosition(map, start);
  const queue = [[initialPosition, [], 0]];
  const visited = new Map();
  let paths = [];
  let threshold = Infinity;

  while (queue.length) {
    const [position, path, cost] = queue.shift();
    const key = position.join('-');

    if (visited.get(key) < cost) continue;
    visited.set(key, cost);

    if (cost > threshold) continue;

    if (map[position[1]]?.[position[0]] === end) {
      if (cost < threshold) {
        paths = [];
        threshold = cost;
      }
      if (cost === threshold) paths.push(path);
      continue;
    }

    for (const [key, [dx, dy]] of Object.entries(directions)) {
      const [npx, npy] = [position[0] + dx, position[1] + dy];
      if (map?.[npy]?.[npx] == null) continue;
      queue.push([[npx, npy], [...path, key], cost + 1]);
    }
  }

  return paths.map((p) => p.join('') + 'A');
};

const getInstructionsLength = (map, code, depth, cache = new Map()) => {
  const key = `${code}-${depth}`;
  if (cache.has(key)) return cache.get(key);

  let pointer = 'A';
  let length = 0;

  for (const nextPos of code.split('')) {
    const paths = bfs(map, pointer, nextPos);
    length += depth
      ? Math.min(
          ...paths.map((path) =>
            getInstructionsLength(dirpad, path, depth - 1, cache),
          ),
        )
      : paths[0].length;
    pointer = nextPos;
  }

  cache.set(key, length);
  return length;
};

const calculatePoints = (codes, robotsCount) =>
  sum(
    codes.map(
      (code) =>
        parseInt(code) * getInstructionsLength(numpad, code, robotsCount),
    ),
  );

console.table({
  'Part 1': calculatePoints(input, 2),
  'Part 2': calculatePoints(input, 25),
  'Duration(ms)': timer.end(),
});
