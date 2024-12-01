const fs = require('fs');

const readInput = (inputFilePath) => {
  const fileContent = fs.readFileSync(inputFilePath, 'utf-8');
  return parseInput(fileContent);
};

const parseInput = (input) => input.trim().split('\n');

module.exports = {
  readInput,
  parseInput,
};
