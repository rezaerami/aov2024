const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');
const { find2d } = require('../utils/array.utils');

const inputFilePath = path.resolve('inputs', 'day-15.txt');

const parseInput = (inputPath) => {
  const input = readInput(inputPath, false).split('\n\n');
  const map = input[0].split('\n');
  const directions = input[1].replace(/\n/g, '');
  return { map, directions };
};

timer.start();

const movesMap = {
  '^': { dx: -1, dy: 0 },
  v: { dx: 1, dy: 0 },
  '<': { dx: 0, dy: -1 },
  '>': { dx: 0, dy: 1 },
};

const pushRobot = (grid, robotPos, nextX, nextY) => {
  grid[robotPos.x][robotPos.y] = '.';
  grid[nextX][nextY] = '@';
  return { x: nextX, y: nextY };
};

const calculateGpsSum = (grid, boxChar) => {
  let gpsSum = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === boxChar) {
        gpsSum += 100 * r + c;
      }
    }
  }
  return gpsSum;
};
const collectBoxes = (grid, startX, startY, dx, dy, boxChars) => {
  const boxes = [];
  let currentX = startX;
  let currentY = startY;

  while (boxChars.includes(grid[currentX]?.[currentY])) {
    boxes.push({ x: currentX, y: currentY });
    currentX += dx;
    currentY += dy;
  }

  return boxes;
};
const collectCluster = (grid, startX, startY, dx) => {
  const edges = [];
  const queue = [[startX, startY]];
  if (grid[startX][startY] === '[') queue.push([startX, startY + 1]);
  else queue.push([startX, startY - 1]);

  const visited = new Set();
  while (queue.length) {
    const edge = queue.shift();
    const [x, y] = edge;
    if (visited.has(`${x}-${y}`)) continue;

    const cell = grid[x][y];
    visited.add(`${x}-${y}`);

    if (!['[', ']'].includes(cell)) continue;

    let otherY = 1;
    if (cell === ']') otherY = -1;

    if (!visited.has(`${x}-${y + otherY}`)) {
      edges.push({ x, y }, { x, y: y + otherY });
    }

    queue.push([x + dx, y], [x + dx, y + otherY]);
  }
  return edges;
};

const canPushBoxes = (grid, boxes, dx, dy) => {
  return boxes.every(({ x, y }) => grid[x + dx]?.[y + dy] !== '#');
};
const pushBoxes = (grid, boxes, dx, dy) => {
  for (let i = boxes.length - 1; i >= 0; i--) {
    const { x, y } = boxes[i];
    grid[x + dx][y + dy] = grid[x][y];
    grid[x][y] = '.';
  }
};

const scaleMap = (map) => {
  return map.map((row) =>
    row
      .split('')
      .map((tile) => {
        if (tile === '#') return '##';
        if (tile === 'O') return '[]';
        if (tile === '.') return '..';
        if (tile === '@') return '@.';
      })
      .join(''),
  );
};

const isHorizontalMove = (move) => ['<', '>'].includes(move);

const simulateWarehouse = (map, directions) => {
  const grid = map.map((row) => row.split(''));
  const [x, y] = find2d(grid, '@');

  let robotPos = { x, y };

  for (const move of directions) {
    const { dx, dy } = movesMap[move];
    const nextX = robotPos.x + dx;
    const nextY = robotPos.y + dy;

    if (grid[nextX]?.[nextY] === '#') continue;

    if (grid[nextX]?.[nextY] === 'O') {
      const boxes = collectBoxes(grid, nextX, nextY, dx, dy, ['O']);
      if (!canPushBoxes(grid, boxes, dx, dy)) continue;
      pushBoxes(grid, boxes, dx, dy);
    }
    robotPos = pushRobot(grid, robotPos, nextX, nextY);
  }

  return calculateGpsSum(grid, 'O');
};

const simulateScaledWarehouse = (map, directions) => {
  const grid = scaleMap(map).map((row) => row.split(''));
  const [x, y] = find2d(grid, '@');
  let robotPos = { x, y };

  for (const move of directions) {
    const { dx, dy } = movesMap[move];

    const nextX = robotPos.x + dx;
    const nextY = robotPos.y + dy;

    if (grid[nextX][nextY] === '#') continue;

    if (['[', ']'].includes(grid[nextX][nextY])) {
      const boxes = [];
      if (isHorizontalMove(move)) {
        boxes.push(...collectBoxes(grid, nextX, nextY, dx, dy, ['[', ']']));
      } else {
        boxes.push(...collectCluster(grid, nextX, nextY, dx));
      }

      if (!canPushBoxes(grid, boxes, dx, dy)) continue;
      pushBoxes(grid, boxes, dx, dy);
    }

    robotPos = pushRobot(grid, robotPos, nextX, nextY);
  }

  return calculateGpsSum(grid, '[');
};

const { map, directions } = parseInput(inputFilePath);
const partOne = simulateWarehouse(map, directions);
const partTwo = simulateScaledWarehouse(map, directions);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
