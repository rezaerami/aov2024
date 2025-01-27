const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2024', 'day-4.txt');

const input = readInput(inputFilePath).map((line) => line.split(''));
timer.start();

let partOne = 0;
input.forEach((line, i) => {
  line.forEach((char, j) => {
    if (char === 'X') {
      const neighbors = [
        [input?.[i]?.[j + 1], input?.[i]?.[j + 2], input?.[i]?.[j + 3]],
        [input?.[i]?.[j - 1], input?.[i]?.[j - 2], input?.[i]?.[j - 3]],
        [input?.[i + 1]?.[j], input?.[i + 2]?.[j], input?.[i + 3]?.[j]],
        [input?.[i - 1]?.[j], input?.[i - 2]?.[j], input?.[i - 3]?.[j]],
        [
          input?.[i - 1]?.[j - 1],
          input?.[i - 2]?.[j - 2],
          input?.[i - 3]?.[j - 3],
        ],
        [
          input?.[i - 1]?.[j + 1],
          input?.[i - 2]?.[j + 2],
          input?.[i - 3]?.[j + 3],
        ],
        [
          input?.[i + 1]?.[j - 1],
          input?.[i + 2]?.[j - 2],
          input?.[i + 3]?.[j - 3],
        ],
        [
          input?.[i + 1]?.[j + 1],
          input?.[i + 2]?.[j + 2],
          input?.[i + 3]?.[j + 3],
        ],
      ];
      partOne += neighbors
        .map((d) => d.join(''))
        .filter((item) => item === 'MAS').length;
    }
  });
});

let partTwo = 0;
input.forEach((line, i) => {
  line.forEach((char, j) => {
    if (char === 'A') {
      const neighbors = [
        [input?.[i - 1]?.[j - 1], input?.[i + 1]?.[j + 1]],
        [input?.[i - 1]?.[j + 1], input?.[i + 1]?.[j - 1]],
      ];

      if (
        neighbors
          .map((d) => d.join(''))
          .every((item) => ['MS', 'SM'].includes(item))
      )
        partTwo += 1;
    }
  });
});

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
