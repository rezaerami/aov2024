const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');

const inputFilePath = path.resolve('inputs', 'day-24.txt');
const input = readInput(inputFilePath, false);
timer.start();

const parseWires = (wiresArray) =>
  Object.fromEntries(
    wiresArray.map((line) => {
      const [wire, value] = line.split(':').map((s) => s.trim());
      return [wire, parseInt(value, 10)];
    }),
  );

const parseInstructions = (instructionsArray) =>
  instructionsArray
    .map((line) => {
      const [expression, output] = line.split('->').map((s) => s.trim());
      const parts = expression.split(' ');
      if (parts.length === 3) {
        return {
          op: parts[1],
          input1: parts[0],
          input2: parts[2],
          output,
        };
      }
      return null;
    })
    .filter(Boolean);

const parseInput = (input) => {
  const [wiresSection, instructionsSection] = input.split('\n\n');
  return {
    wires: parseWires(wiresSection.split('\n')),
    instructions: parseInstructions(instructionsSection.split('\n')),
  };
};

const gateOps = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  XOR: (a, b) => a ^ b,
};

const simulateCircuit = (wires, instructions) => {
  let unresolved = true;

  while (unresolved) {
    unresolved = false;

    for (const { op, input1, input2, output } of instructions) {
      if (wires[output] === undefined) {
        const val1 = wires[input1];
        const val2 = wires[input2];

        if (val1 !== undefined && val2 !== undefined) {
          wires[output] = gateOps[op](val1, val2);
        } else {
          unresolved = true;
        }
      }
    }
  }

  const xWires = Object.keys(wires).filter((wire) => wire.startsWith('x'));
  const yWires = Object.keys(wires).filter((wire) => wire.startsWith('y'));
  const zWires = Object.keys(wires)
    .filter((wire) => wire.startsWith('z'))
    .sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));

  const result = parseInt(
    zWires
      .reverse()
      .map((wire) => wires[wire])
      .join(''),
    2,
  );

  return { xWires, yWires, zWires, result };
};

const findInstruction = (instructions, inputs, op) =>
  instructions.find(
    ({ input1, input2, op: instrOp }) =>
      inputs.includes(input1) && inputs.includes(input2) && instrOp === op,
  );

const findMismatches = (instructions, expectedLength) => {
  const mismatches = instructions
    .filter(
      ({ input1, input2, output, op }) =>
        !input1.startsWith('x') &&
        !input2.startsWith('x') &&
        !output.startsWith('z') &&
        op === 'XOR',
    )
    .map(({ output }) => output);

  for (let i = 0; i < expectedLength; i++) {
    const id = i.toString().padStart(2, '0');
    const inputs = [`x${id}`, `y${id}`];

    const andOp = findInstruction(instructions, inputs, 'AND');
    if (!andOp) continue;

    const zInstr = instructions.find(({ output }) => output === `z${id}`);
    if (zInstr.op !== 'XOR') mismatches.push(zInstr.output);

    const xorOp = findInstruction(instructions, inputs, 'XOR');
    const nextInstr = instructions.find(({ input1, input2 }) =>
      [input1, input2].includes(xorOp.output),
    );
    if (nextInstr && nextInstr.op === 'OR') mismatches.push(xorOp.output);

    const orInstr = instructions.find(({ input1, input2 }) =>
      [input1, input2].includes(andOp.output),
    );
    if (orInstr && orInstr.op !== 'OR' && i > 0) mismatches.push(andOp.output);
  }

  return mismatches.sort().join(',');
};

const { wires, instructions } = parseInput(input);
const { zWires, result } = simulateCircuit(wires, instructions);

console.table({
  'Part 1': result,
  'Part 2': findMismatches(instructions, zWires.length),
  'Duration(ms)': timer.end(),
});
