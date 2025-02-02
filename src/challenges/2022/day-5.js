const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-5.txt');

const input = readInput(inputFilePath, false);
timer.start();
const parseStacks = (input) => {
  const lines = input.split('\n');
  const columns = lines[lines.length - 1];
  const stacks = [];
  let index = 0;
  for (const char of columns) {
    if (Number(char)) {
      stacks.push(
        lines
          .slice(0, lines.length - 1)
          .map((line) => line[index])
          .filter((char) => char && char !== ' '),
      );
    }
    index++;
  }
  return stacks;
};

const parseInstructions = (input) =>
  input.map((line) => line.match(/\d+/g).map((i) => Number(i) - 1));

const [s, i] = input.split('\n\n');
const instructions = parseInstructions(i.trim().split('\n'));

const solvePartOne = () => {
  const stacks = parseStacks(s);
  instructions.forEach(([row, src, dist]) => {
    for (let i = 0; i <= row; i++) {
      stacks[dist].unshift(stacks[src].shift());
    }
  });
  return stacks.map((stack) => stack[0]).join('');
}

const solvePartTwo = () => {
  const stacks = parseStacks(s);
  instructions.forEach(([row, src, dist]) => {
    const chunk = [];
    for (let i = 0; i <= row; i++) {
      chunk.push(stacks[src].shift());
    }
    stacks[dist].unshift(...chunk);
  });
  return stacks.map((stack) => stack[0]).join('');
}


console.table({
  'Part 1': solvePartOne(),
  'Part 2': solvePartTwo(),
  'Duration(ms)': timer.end(),
});
