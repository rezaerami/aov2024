const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { sum } = require('../../utils/math.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-2.txt');

const input = readInput(inputFilePath);
timer.start();

const solvePartOne = () => {
  const gamePoint = {
    'A Y': 6,
    'B Z': 6,
    'C X': 6,
    'A X': 3,
    'B Y': 3,
    'C Z': 3,
    'A Z': 0,
    'B X': 0,
    'C Y': 0,
  };

  const priorityPoint = { X: 1, Y: 2, Z: 3 };

  return sum(
    input.map((game) => {
      const [, player] = game.split(' ');
      return gamePoint[game] + priorityPoint[player];
    }),
  );
};

const solvePartTwo = () => {
  const gamePoint = { X: 0, Y: 3, Z: 6 };
  const priorityPoint = { A: 1, B: 2, C: 3 };

  const getChoice = {
    X: { A: 'C', B: 'A', C: 'B' },
    Y: { A: 'A', B: 'B', C: 'C' },
    Z: { A: 'B', B: 'C', C: 'A' },
  };

  return sum(
    input.map((game) => {
      const [opponent, outcome] = game.split(' ');
      const playerChoice = getChoice[outcome][opponent];
      return gamePoint[outcome] + priorityPoint[playerChoice];
    }),
  );
};

console.table({
  'Part 1': solvePartOne(),
  'Part 2': solvePartTwo(),
  'Duration(ms)': timer.end(),
});
