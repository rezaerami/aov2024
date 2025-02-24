const path = require('path');
const { genericParser } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { manhattanDistance } = require('../../utils/path.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-15.txt');

const input = genericParser(inputFilePath, '\n', (line) =>
  line.match(/-?\d+/g).map(Number),
);
timer.start();

const TARGET_ROW = 2000000;
function findExcludedPositions() {
  const excludedPositions = new Set();
  const beaconPositions = new Set();

  for (const [sx, sy, bx, by] of input) {
    const distance = manhattanDistance([sx, sy], [bx, by]);

    if (by === TARGET_ROW) {
      beaconPositions.add(bx);
    }

    const dy = Math.abs(sy - TARGET_ROW);
    if (dy < distance) {
      const xRange = distance - dy;
      for (let x = sx - xRange; x <= sx + xRange; x++) {
        excludedPositions.add(x);
      }
    }
  }

  return excludedPositions.size - beaconPositions.size;
}

const SEARCH_BOUNDARY = 4000000;
function findDistressBeacon() {
  for (let y = 0; y <= SEARCH_BOUNDARY; y++) {
    let ranges = [];
    for (const [sx, sy, bx, by] of input) {
      const distance = manhattanDistance([sx, sy], [bx, by]);
      const yDistance = Math.abs(sy - y);
      if (yDistance <= distance) {
        const xRange = distance - yDistance;
        ranges.push([sx - xRange, sx + xRange]);
      }
    }

    ranges.sort((a, b) => a[0] - b[0]);
    let maxX = 0;
    for (const [start, end] of ranges) {
      if (start > maxX) {
        return maxX * SEARCH_BOUNDARY + y;
      }
      maxX = Math.max(maxX, end + 1);
    }
  }
}

const partOne = findExcludedPositions();
const partTwo = findDistressBeacon();

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
