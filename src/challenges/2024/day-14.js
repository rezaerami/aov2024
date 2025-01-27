const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { mul } = require('../../utils/math.utils');

const inputFilePath = path.resolve('inputs', '2024', 'day-14.txt');

const input = readInput(inputFilePath);

timer.start();

const parsedInput = input.map((line) => {
  const [p, v] = line.split(' ').map((part) => part.split('=')[1]);
  const [px, py] = p.split(',').map(Number);
  const [vx, vy] = v.split(',').map(Number);
  return { position: { x: px, y: py }, velocity: { x: vx, y: vy } };
});

const MAX_WIDTH = 101;
const MAX_HEIGHT = 103;
const MAX_TIME = 100;

const getPositions = (input, time) => {
  const robots = JSON.parse(JSON.stringify(input));
  robots.forEach((robot) => {
    robot.position.x = (robot.position.x + robot.velocity.x * time) % MAX_WIDTH;
    robot.position.y =
      (robot.position.y + robot.velocity.y * time) % MAX_HEIGHT;

    if (robot.position.x < 0) robot.position.x += MAX_WIDTH;
    if (robot.position.y < 0) robot.position.y += MAX_HEIGHT;
  });

  return robots;
};

const solvePartOne = (input, time) => {
  const robots = getPositions(input, time);
  const result = [0, 0, 0, 0];

  const midRow = Math.floor(MAX_WIDTH / 2);
  const midCole = Math.floor(MAX_HEIGHT / 2);

  robots.forEach((robot) => {
    const { x, y } = robot.position;
    if (x === midRow || y === midCole) {
      return;
    }

    if (x < midRow && y < midCole) {
      result[0]++;
    } else if (x >= midRow && y < midCole) {
      result[1]++;
    } else if (x < midRow && y >= midCole) {
      result[2]++;
    } else if (x >= midRow && y >= midCole) {
      result[3]++;
    }
  });

  return mul(result);
};

const solvePartTwo = (input) => {
  let time = 0;
  const densities = [];
  while (true) {
    time++;
    const robots = getPositions(input, time);
    const parsedGrid = parseGrid(robots);
    densities.push({ time, density: checkDensity(parsedGrid, robots) });

    if (JSON.stringify(robots) === JSON.stringify(input)) break;
  }
  densities.sort((a, b) => b.density - a.density);
  return densities[0].time;
};
const parseGrid = (robots) => {
  const grid = Array.from({ length: MAX_HEIGHT }, () =>
    Array(MAX_WIDTH).fill('.'),
  );
  robots.forEach((robot) => {
    grid[robot.position.y][robot.position.x] = '#';
  });
  return grid;
};

const checkDensity = (grid, itemsToCheck) => {
  function isWithinBounds(x, y) {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
  }

  const getDensity = (grid, x, y) => {
    let similarCount = 0;
    for (let dx = -1; dx <= 1; dx++) {
      // Iterate over -1, 0, 1
      for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx;
        const ny = y + dy;
        if (isWithinBounds(nx, ny) && grid[nx][ny] === grid[x][y]) {
          similarCount++;
        }
      }
    }
    return similarCount / 9;
  };

  let totalDensity = 0;
  for (const item of itemsToCheck) {
    const { x, y } = item.position;
    const density = getDensity(grid, x, y);
    totalDensity += density;
  }

  return itemsToCheck.length > 0 ? totalDensity / itemsToCheck.length : 0;
};

const partOne = solvePartOne(parsedInput, MAX_TIME);
const partTwo = solvePartTwo(parsedInput);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
