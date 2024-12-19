const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');

const inputFilePath = path.resolve('inputs', 'day-19.txt');

const input = readInput(inputFilePath, false);

timer.start();

function parseInput(input) {
  const [patterns, designs] = input.split('\n\n');
  return [patterns.trim().split(', '), designs.trim().split('\n')];
}


function canFormDesign(patterns, design, cache) {
  if (cache.has(design)) return cache.get(design);

  if (!design) {
    cache.set(design, true);
    return true;
  }

  for (const pattern of patterns) {
    if (design.startsWith(pattern)) {
      const nextDesign = design.slice(pattern.length);
      if (canFormDesign(patterns, nextDesign, cache)) {
        cache.set(design, true);
        return true;
      }
    }
  }

  cache.set(design, false);
  return false;
}

function findAllArrangements(patterns, design, cache) {
  if (cache.has(design)) return cache.get(design);

  if (!design) {
    return 1;
  }

  let arrangements = 0;

  for (const pattern of patterns) {
    if (design.startsWith(pattern)) {
      const nextDesign = design.slice(pattern.length);
      arrangements += findAllArrangements(patterns, nextDesign, cache);
    }
  }

  cache.set(design, arrangements);
  return arrangements;
}

function calculateResults(patterns, designs) {
  let possibleCount = 0;
  let totalArrangements = 0;

  const cacheForPossible = new Map();
  const cacheForArrangements = new Map();

  patterns.sort((a, b) => b.length - a.length);

  designs.forEach((design) => {
    if (canFormDesign(patterns, design, cacheForPossible)) {
      possibleCount++;
    }

    totalArrangements += findAllArrangements(
      patterns,
      design,
      cacheForArrangements,
    );
  });

  return { possibleCount, totalArrangements };
}

const [patterns, designs] = parseInput(input);

const { possibleCount, totalArrangements } = calculateResults(
  patterns,
  designs,
);

console.table({
  'Part 1': possibleCount,
  'Part 2': totalArrangements,
  'Duration(ms)': timer.end(),
});
