const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { sum } = require('../../utils/math.utils');

const inputFilePath = path.resolve('inputs', '2022', 'day-10.txt');

const input = readInput(inputFilePath);
timer.start();

let cycle = 0;
let value = 1;
const result = [];
const screenWidth = 40;
const screenHeight = 6;
const screen = Array.from({ length: screenHeight }, () =>
  Array(screenWidth).fill('.'),
);

// Process input instructions
for (const line of input) {
  if (line.startsWith('noop')) {
    drawPixel();
    cycle++;
    result.push({ cycle, value });
  } else {
    const [, n] = line.split(' ');
    drawPixel();
    cycle++;
    result.push({ cycle, value });

    drawPixel();
    cycle++;
    result.push({ cycle, value });

    value += Number(n);
  }
}

function drawPixel() {
  const row = Math.floor(cycle / screenWidth);
  const col = cycle % screenWidth;

  if (row < screenHeight && col >= value - 1 && col <= value + 1) {
    screen[row][col] = '#';
  }
}

function betterView(input) {
  return input.replaceAll('.', ' ').replaceAll('#', '\u2588');
}

const chosenCycles = [20, 60, 100, 140, 180, 220];
const filteredResults = result.filter((item) =>
  chosenCycles.includes(item.cycle),
);
const partOne = sum(filteredResults.map((item) => item.cycle * item.value));
const partTwo = screen.map((row) => row.join('')).join('\n');

console.table({
  'Part 1': partOne,
  'Duration(ms)': timer.end(),
});

console.log('Part 2 Output:');
console.log(betterView(partTwo));
