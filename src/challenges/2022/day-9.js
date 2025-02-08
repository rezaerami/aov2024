const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-9.txt');

const input = readInput(inputFilePath);
timer.start();

const moveRope = (movements, ropeLength = 1) => {
  const rope = Array.from({ length: ropeLength }, () => ({ x: 0, y: 0 }));
  const visited = new Set();
  const getKey = (pos) => Object.values(pos).join('-');

  const directions = {
    U: { x: 0, y: 1 },
    D: { x: 0, y: -1 },
    L: { x: -1, y: 0 },
    R: { x: 1, y: 0 },
  };

  const moveHead = (dir) => {
    rope[0].x += directions[dir].x;
    rope[0].y += directions[dir].y;
  };

  const moveSegment = (index) => {
    const dx = rope[index - 1].x - rope[index].x;
    const dy = rope[index - 1].y - rope[index].y;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      rope[index].x += Math.sign(dx);
      rope[index].y += Math.sign(dy);
    }
  };

  visited.add(getKey(rope[ropeLength - 1]));
  for (let move of movements) {
    let [dir, steps] = move.split(' ');
    steps = parseInt(steps, 10);

    for (let i = 0; i < steps; i++) {
      moveHead(dir);
      for (let j = 1; j < ropeLength; j++) {
        moveSegment(j);
      }
      visited.add(getKey(rope[ropeLength - 1]));
    }
  }
  return visited.size;
};

const partOne = moveRope(input, 2);
const partTwo = moveRope(input, 10);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
