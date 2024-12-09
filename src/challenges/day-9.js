const path = require('path');
const fs = require('fs');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');
const { sum } = require('../utils/math.utils');

const inputFilePath = path.resolve('inputs', 'day-9.txt');

const input = readInput(inputFilePath, false).trim();
timer.start();

const flattenFileSystem = (fileSystem) =>
  fileSystem.flatMap(({ id, length }) => Array.from({ length }, () => id));

const getDisk = (input) => {
  const fileSystem = [];
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    if (i % 2) fileSystem.push({ id: '.', length: Number(input[i]) });
    else {
      fileSystem.push({ id: id, length: Number(input[i]) });
      id++;
    }
  }
  return {
    flattenFiles: flattenFileSystem(fileSystem),
    fileSystem,
  };
};

const getKey = (item) => Object.values(item).join();

function defragmentBlock(files) {
  let freeSpaceIndex = files.indexOf('.'); // Start with the first free space

  for (let i = files.length - 1; i >= 0; i--) {
    if (files[i] === '.' || freeSpaceIndex > i) continue;

    files[freeSpaceIndex] = files[i];
    files[i] = '.';

    freeSpaceIndex++;
    while (files[freeSpaceIndex] !== '.' && freeSpaceIndex < i) {
      freeSpaceIndex++;
    }
  }
  return files;
}

function defragmentFile(input) {
  let files = JSON.parse(JSON.stringify(input));
  const defragged = new Set();
  for (let i = files.length - 1; i >= 0; i--) {
    if (files[i].id === '.' || defragged.has(getKey(files[i]))) continue;

    defragged.add(getKey(files[i]));

    const freeSpaceIndex = files.findIndex(
      (item) => item.id === '.' && item.length >= files[i].length,
    );
    const freeSpace = files[freeSpaceIndex];

    if (!freeSpace || freeSpaceIndex >= i) continue;

    files[freeSpaceIndex] = JSON.parse(JSON.stringify(files[i]));

    if (freeSpace.length === files[i].length) files[i] = freeSpace;
    else if (freeSpace.length > files[i].length) {
      files[i].id = '.';
      files.splice(freeSpaceIndex + 1, 0, {
        id: '.',
        length: freeSpace.length - files[i].length,
      });
    }
  }

  return flattenFileSystem(files);
}

const getChecksum = (array) =>
  sum(array.map((item, index) => (item === '.' ? 0 : item * index)));

const { flattenFiles, fileSystem } = getDisk(input);

console.table({
  'Part 1': getChecksum(defragmentBlock(flattenFiles)),
  'Part 2': getChecksum(defragmentFile(fileSystem)),
  'Duration(ms)': timer.end(),
});
