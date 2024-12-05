const path = require('path');
const { readInput, parseInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');
const { sum } = require('../utils/math.utils');

const inputFilePath = path.resolve('inputs', 'day-5.txt');

const input = readInput(inputFilePath, false);
timer.start();

const separatedInput = input.split('\n\n');
const rules = new Set(parseInput(separatedInput[0]));
const updates = parseInput(separatedInput[1]).map((line) =>
  line.split(',').map(Number),
);

const isValidUpdate = (update) => {
  for (let j = 0; j < update.length; j++) {
    for (let k = j + 1; k < update.length; k++) {
      const pair = `${update[j]}|${update[k]}`;
      if (!rules.has(pair)) {
        return false;
      }
    }
  }
  return true;
};

const fixUpdate = (update) => {
  const fixed = [...update];
  while (true) {
    for (let i = 0; i < fixed.length; i++) {
      for (let j = i + 1; j < fixed.length; j++) {
        const pair = `${fixed[i]}|${fixed[j]}`;
        if (!rules.has(pair)) {
          [fixed[i], fixed[j]] = [fixed[j], fixed[i]];
        }
      }
    }

    if (isValidUpdate(fixed)) break;
  }

  return fixed;
};

const validUpdates = [];
const fixedInvalidUpdates = [];
for (let i = 0; i < updates.length; i++) {
  const update = updates[i];
  if (isValidUpdate(update)) {
    validUpdates.push(update[Math.floor(update.length / 2)]);
  }
  else {
    const fixedUpdate = fixUpdate(update);
    fixedInvalidUpdates.push(fixedUpdate[Math.floor(fixedUpdate.length / 2)]);
  }
}

const partOne = sum(validUpdates);
const partTwo = sum(fixedInvalidUpdates);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
