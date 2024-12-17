const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');

const inputFilePath = path.resolve('inputs', 'day-17.txt');

const input = readInput(inputFilePath);

timer.start();

const parseInput = (lines) => {
  const registers = [];
  let program = [];

  for (let line of lines) {
    if (line.startsWith('Register')) {
      const value = parseInt(line.split(':')[1].trim(), 10);
      registers.push(value);
    } else if (line.startsWith('Program')) {
      program = line.split(':')[1].trim().split(',').map(Number);
    }
  }
  return [...registers, program];
};

const operate = (A, B, C, program) => {
  let output = [];
  let pointer = 0;
  const getComboValue = (operand) => {
    return [0, 1, 2, 3].includes(operand)
      ? operand
      : [A, B, C][operand - 4] || 0;
  };
  const opcodeHandlers = {
    0: (operand) => {
      A = Math.floor(A / 2 ** getComboValue(operand));
    },
    1: (operand) => {
      B ^= operand;
    },
    2: (operand) => {
      B = getComboValue(operand) & 7;
    },
    3: (operand) => {
      if (A !== 0) {
        pointer = operand;
      }
    },
    4: () => {
      B ^= C;
    },
    5: (operand) => {
      output.push((getComboValue(operand) & 7).toString());
    },
    6: (operand) => {
      B = Math.floor(A / 2 ** getComboValue(operand));
    },
    7: (operand) => {
      C = Math.floor(A / 2 ** getComboValue(operand));
    },
  };

  while (pointer < program.length) {
    const opcode = program[pointer];
    const operand = program[pointer + 1];

    opcodeHandlers[opcode](operand);

    pointer += 2;
  }

  return output.map(Number);
};

const findLowestA = (initialA, program) => {
  const BIT_SIZE = 8;
  const queue = [];
  const lengthIndex = program.length - 1;

  queue.push({ currentValue: initialA, lengthIndex });

  while (queue.length) {
    const { currentValue, lengthIndex } = queue.shift();
    if (lengthIndex < 0) return currentValue;

    const startRange = currentValue * BIT_SIZE;
    const endRange = startRange + BIT_SIZE;

    for (let value = startRange; value < endRange; value++) {
      const [result] = operate(value, 0, 0, program);
      if (result === program[lengthIndex]) {
        queue.push({ currentValue: value, lengthIndex: lengthIndex - 1 });
      }
    }
  }
};

const parsedInput = parseInput(input);
const partOne = operate(...parsedInput).join(',');
const partTwo = findLowestA(0, parsedInput[3]);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
