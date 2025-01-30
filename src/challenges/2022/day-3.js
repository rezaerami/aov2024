const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { sum } = require('../../utils/math.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-3.txt');

const input = readInput(inputFilePath);
timer.start();

const findCommonCharacters = (arr) => {
  let commonChars = new Set(arr[0]);

  for (let i = 1; i < arr.length; i++) {
    let currentSet = new Set(arr[i]);
    commonChars = new Set(
      [...commonChars].filter((char) => currentSet.has(char)),
    );
  }

  return [...commonChars];
};
const calculatePriority = (char) => {
  const asciiCode = char.charCodeAt(0);
  return asciiCode - (asciiCode >= 97 ? 96 : 38);
};

const solvePartOne = () => {
  return sum(
    input.map((line) => {
      const length = line.length / 2;
      const firstPart = line.substring(0, length).split('');
      const secondPart = line.substring(length, line.length).split('');
      const commonLetter = findCommonCharacters([firstPart, secondPart])[0];
      return calculatePriority(commonLetter);
    }),
  );
};

const solvePartTwo = () => {
  const result = [];
  for (let i = 0; i < input.length; i += 3) {
    const commonLetters = findCommonCharacters([
      input[i],
      input[i + 1],
      input[i + 2],
    ])[0];
    result.push(calculatePriority(commonLetters));
  }
  return sum(result);
};

console.table({
  'Part 1': solvePartOne(),
  'Part 2': solvePartTwo(),
  'Duration(ms)': timer.end(),
});
