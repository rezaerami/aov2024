const path = require('path');
const { genericParser } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-11.txt');

timer.start();

const parseOperation = (operationStr) => {
  if (operationStr.includes('* old')) {
    return (old) => old * old;
  }
  const match = operationStr.match(/([+*])\s*(\d+)/);
  if (!match) throw new Error('Invalid operation format');
  const [, operator, number] = match;
  return (old) =>
    operator === '+' ? old + Number(number) : old * Number(number);
};

const parseInput = () => {
  return genericParser(inputFilePath, '\n\n', (section) => {
    const lines = section.split('\n').map((line) => line.trim());
    return {
      id: Number(lines[0].match(/\d+/)),
      items: lines[1].match(/\d+/g).map(Number),
      inspection: 0,
      operation: parseOperation(lines[2].split('old ')[1]),
      test: Number(lines[3].match(/\d+/)),
      destinations: {
        1: Number(lines[4].match(/\d+/)),
        0: Number(lines[5].match(/\d+/)),
      },
    };
  });
};

const processMonkeyItems = (monkeys, steps, moduloMod) => {
  const modulo = monkeys.reduce((acc, monkey) => acc * monkey.test, 1);

  for (let i = 0; i < steps; i++) {
    monkeys.forEach((monkey) => {
      while (monkey.items.length) {
        const item = monkey.items.shift();
        const newItem = moduloMod
          ? monkey.operation(item) % modulo
          : Math.floor(monkey.operation(item) / 3);
        const testResult = Number(!(newItem % monkey.test));
        monkeys[monkey.destinations[testResult]].items.push(newItem);
        monkey.inspection++;
      }
    });
  }
};

const getInspectionResult = (steps, worryLevel = false) => {
  const monkeys = parseInput();
  processMonkeyItems(monkeys, steps, worryLevel);

  const [first, second] = monkeys.sort((a, b) => b.inspection - a.inspection);
  return first.inspection * second.inspection;
};

const partOne = getInspectionResult(20);
const partTwo = getInspectionResult(10000, true);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
