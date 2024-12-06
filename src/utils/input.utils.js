const fs = require('fs');

const readInput = (inputFilePath, parse = true) => {
  const fileContent = fs.readFileSync(inputFilePath, 'utf-8');
  if (parse) return parseInput(fileContent);

  return fileContent;
};

const parseInput = (input) => input.trim().split('\n');
const parseInputToCells = (input) =>
  readInput(input).map((line) => line.trim().split(''));

module.exports = {
  readInput,
  parseInput,
  parseInputToCells,
};
