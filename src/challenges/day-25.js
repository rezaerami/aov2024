const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');

const inputFilePath = path.resolve('inputs', 'day-25.txt');

const input = readInput(inputFilePath, false);
timer.start();

const schematics = input.split('\n\n');
const lockSchematics = schematics.filter((schema) => {
  const lines = schema.split('\n');
  return !lines[0].match(/\./g) && !lines[lines.length - 1].match(/#/g);
});
const keySchematics = schematics.filter((schema) => {
  const lines = schema.split('\n');
  return !lines[0].match(/#/g) && !lines[lines.length - 1].match(/\./g);
});

// Function to parse a schematic into heights
function parseHeights(schematic) {
  const rows = schematic.trim().split('\n');
  const heights = [];

  for (let col = 0; col < rows[0].length; col++) {
    let height = 0;

    for (let row = 0; row < rows.length; row++) {
      if (rows[row][col] === '#') {
        height++;
      }
    }

    heights.push(height - 1);
  }

  return heights;
}

// Function to determine if a key fits a lock
function doesKeyFitLock(lockHeights, keyHeights, maxHeight) {
  for (let i = 0; i < lockHeights.length; i++) {
    if (lockHeights[i] + keyHeights[i] > maxHeight) {
      return false;
    }
  }
  return true;
}

// Parse lock and key heights
const locks = lockSchematics.map(parseHeights);
const keys = keySchematics.map(parseHeights);

//
const maxHeight = 5; // Maximum available height (from the problem statement)
let validPairs = 0;
// Check each lock against each key
for (const lock of locks) {
  for (const key of keys) {
    if (doesKeyFitLock(lock, key, maxHeight)) {
      validPairs++;
    }
  }
}

const partOne = validPairs;

console.table({
  'Part 1': partOne,
  'Part 2': 'Merry Christmas!',
  'Duration(ms)': timer.end(),
});
