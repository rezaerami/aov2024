const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { sum } = require('../../utils/math.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-7.txt');

const input = readInput(inputFilePath);
timer.start();

const getDirectorySizes = (lines) => {
  const stack = [];
  const dirSizes = {};

  for (const line of lines) {
    if (line.startsWith('$ cd ')) {
      const dir = line.split('$ cd ')[1].trim();
      if (dir === '..') {
        stack.pop();
      } else {
        stack.push(dir);
      }
    } else if (!line.startsWith('$ ls')) {
      const parts = line.split(' ');
      if (parts[0] === 'dir') {
        continue;
      }
      const size = parseInt(parts[0], 10);
      let path = '';
      for (let i = 0; i < stack.length; i++) {
        path = stack.slice(0, i + 1).join('/') || '/';
        dirSizes[path] = (dirSizes[path] || 0) + size;
      }
    }
  }
  return dirSizes;
};

const directorySizes = getDirectorySizes(input);
const solvePartOne = () =>
  sum(Object.values(directorySizes).filter((item) => item <= 100000));

const solvePartTwo = () => {
  const totalSize = 70000000;
  const usedSize = directorySizes['/'];
  const freeSpace = totalSize - usedSize;
  const neededSize = 30000000 - freeSpace;
  const candidates = Object.values(directorySizes).filter(
    (item) => item >= neededSize,
  );
  candidates.sort((a, b) => a - b);
  return candidates[0];
};

console.table({
  'Part 1': solvePartOne(),
  'Part 2': solvePartTwo(),
  'Duration(ms)': timer.end(),
});
