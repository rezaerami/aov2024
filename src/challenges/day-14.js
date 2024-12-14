const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');
const { mul } = require('../utils/math.utils');

const inputFilePath = path.resolve('inputs', 'day-14.txt');

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
const hasUniquePositions = (arr) => {
  const seenPositions = new Set();

  for (const item of arr) {
    const positionKey = `${item.position.x},${item.position.y}`;
    if (seenPositions.has(positionKey)) {
      return false; // Position is not unique, return false
    }
    seenPositions.add(positionKey); // Add the position to the set
  }

  return true;
};

const solvePartTwo = (input) => {
  let time = 0;
  while (true) {
    const robots = getPositions(input, time);
    if (hasUniquePositions(robots)) break;
    time++;
  }
  return time;
};

const partOne = solvePartOne(parsedInput, MAX_TIME);
const partTwo = solvePartTwo(parsedInput);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
