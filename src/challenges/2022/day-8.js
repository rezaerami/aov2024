const path = require('path');
const { genericParser } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { isOnBorder, getLineOfSight } = require('../../utils/array.utils');
const { mul } = require('../../utils/math.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-8.txt');
const input = genericParser(inputFilePath, '\n', (line) =>
  line.split('').map(Number),
);

timer.start();

let visibleTrees = 0;
let highestScore = 0;

input.forEach((line, i) => {
  line.forEach((cell, j) => {
    if (isOnBorder(input, i, j)) {
      visibleTrees++;
    } else {
      const lineOfSight = Object.values(getLineOfSight(input, i, j));
      if (
        lineOfSight.some((neighbors) => neighbors.every((item) => item < cell))
      ) {
        visibleTrees++;
      }

      const score = lineOfSight
        .map((neighbors) => {
          let count = 0;
          for (let neighbor of neighbors) {
            count++;
            if (neighbor >= cell) break;
          }
          return count;
        })
        .filter(Boolean);

      highestScore = Math.max(highestScore, mul(score));
    }
  });
});

console.table({
  'Part 1': visibleTrees,
  'Part 2': highestScore,
  'Duration(ms)': timer.end(),
});
