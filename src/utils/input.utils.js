const fs = require('fs');

const readInput = (inputFilePath, parse = true, splitter = '\n') => {
  const fileContent = fs.readFileSync(inputFilePath, 'utf-8');
  if (parse) return parseInput(fileContent, splitter);

  return fileContent;
};
const genericParser = (inputFilePath, splitter, parserCallback) => {
  const chunks = readInput(inputFilePath, true, splitter);
  return chunks.map((chunk) => parserCallback(chunk));
};

const parseInput = (input, splitter = '\n') => input.trim().split(splitter);

const parseInputToCells = (input) =>
  readInput(input).map((line) => line.trim().split(''));

module.exports = {
  readInput,
  parseInput,
  parseInputToCells,
  genericParser,
};
