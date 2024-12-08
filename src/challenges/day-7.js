const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');
const { sum } = require('../utils/math.utils');

const inputFilePath = path.resolve('inputs', 'day-7.txt');

const input = readInput(inputFilePath);
timer.start();

function evaluateExpression(numbers, operatorSeq) {
  let result = numbers[0];

  for (let i = 0; i < operatorSeq.length; i++) {
    const operator = operatorSeq[i];
    if (operator === '+') {
      result += numbers[i + 1];
    } else if (operator === '*') {
      result *= numbers[i + 1];
    } else if (operator === '||') {
      result = parseInt(result.toString() + numbers[i + 1].toString());
    }
  }

  return result;
}

function determineOperators(input, withConcat) {
  const [target, numbersStr] = input.split(':');
  const targetValue = parseInt(target.trim());
  const numbers = numbersStr.trim().split(' ').map(Number);

  const operators = ['+', '*'];
  if (withConcat) operators.push('||');

  function generateOperatorCombinations(idx, currentCombination) {
    if (idx === numbers.length - 1) {
      if (evaluateExpression(numbers, currentCombination) === targetValue) {
        return currentCombination;
      }
      return null;
    }

    for (const op of operators) {
      const result = generateOperatorCombinations(idx + 1, [
        ...currentCombination,
        op,
      ]);
      if (result) return result;
    }

    return null;
  }

  const validCombination = generateOperatorCombinations(0, []);
  return validCombination ? targetValue : 0;
}

const partOne = sum(input.map((item) => determineOperators(item, false)));
const partTwo = sum(input.map(determineOperators));

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
