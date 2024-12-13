const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');

const inputFilePath = path.resolve('inputs', 'day-13.txt');
const input = readInput(inputFilePath, false);

timer.start();

const A_BUTTON_TOKEN_COST = 3;
const B_BUTTON_TOKEN_COST = 1;

const parseMachineInput = (input) =>
  input
    .trim()
    .split('\n\n')
    .map((machine) => {
      const lines = machine.split('\n');

      const buttonA = /Button A: X\+(\d+), Y\+(\d+)/.exec(lines[0]);
      const buttonB = /Button B: X\+(\d+), Y\+(\d+)/.exec(lines[1]);
      const prize = /Prize: X=(\d+), Y=(\d+)/.exec(lines[2]);

      return {
        buttonA: { x: parseInt(buttonA[1], 10), y: parseInt(buttonA[2], 10) },
        buttonB: { x: parseInt(buttonB[1], 10), y: parseInt(buttonB[2], 10) },
        prize: { x: parseInt(prize[1], 10), y: parseInt(prize[2], 10) },
      };
    });

const solveClawMachine = (buttonA, buttonB, prize) => {
  const determinant = buttonA.x * buttonB.y - buttonB.x * buttonA.y;
  if (!determinant) {
    return;
  }

  const determinantX = prize.x * buttonB.y - buttonB.x * prize.y;
  const determinantY = buttonA.x * prize.y - prize.x * buttonA.y;

  if (determinantX % determinant || determinantY % determinant) {
    return null;
  }
  return (
    A_BUTTON_TOKEN_COST * (determinantX / determinant) +
    B_BUTTON_TOKEN_COST * (determinantY / determinant)
  );
};

function findMinimumTokensCorrected(input, scale) {
  const machines = parseMachineInput(input);
  let totalCost = 0;

  machines.forEach((machine) => {
    const { buttonA, buttonB, prize } = machine;

    if (scale) {
      prize.x += 10 ** scale;
      prize.y += 10 ** scale;
    }

    const result = solveClawMachine(buttonA, buttonB, prize);
    if (result) totalCost += result;
  });

  return totalCost;
}

const partOne = findMinimumTokensCorrected(input);
const partTwo = findMinimumTokensCorrected(input, 13);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
