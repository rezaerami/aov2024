const fs = require('fs');
const path = require('path');
const { readInput } = require('../utils/input.utils');

const inputFilePath = path.resolve('inputs', 'day-24.txt');
const input = readInput(inputFilePath, false);

class Operation {
  constructor(a, op, b) {
    this.a = a;
    this.op = op;
    this.b = b;
  }
}

function min(a, b) {
  return a < b ? a : b;
}

function max(a, b) {
  return a > b ? a : b;
}

class Circuit {
  constructor() {
    this.vals = {};
    this.ops = {};
  }

  visit(vr) {
    if (this.vals.hasOwnProperty(vr)) {
      return this.vals[vr];
    }
    const op = this.ops[vr];
    let result;
    switch (op.op) {
      case 'AND':
        result = this.visit(op.a) & this.visit(op.b);
        break;
      case 'OR':
        result = this.visit(op.a) | this.visit(op.b);
        break;
      case 'XOR':
        result = this.visit(op.a) ^ this.visit(op.b);
        break;
    }
    this.vals[vr] = result;
    return result;
  }
}

fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    throw err;
  }

  const sections = data.trim().split('\n\n');
  const circuit = new Circuit();

  // Parse the first section for constant values
  sections[0].split('\n').forEach((line) => {
    const [name, value] = line.split(': ');
    circuit.vals[name] = parseInt(value, 10);
  });

  let xs = [],
    ys = [],
    zs = [];
  // Parse the second section for operations
  sections[1].split('\n').forEach((line) => {
    const parts = line.split(' ');
    const [a, op, b, c] = [parts[0], parts[1], parts[2], parts[4]];
    circuit.ops[c] = new Operation(min(a, b), op, max(a, b));
    if (c.startsWith('z')) {
      xs.push(c.replace('z', 'x'));
      ys.push(c.replace('z', 'y'));
      zs.push(c);
    }
  });

  // Part 1
  zs.sort();
  let p1 = 0;
  zs.forEach((z, i) => {
    p1 += circuit.visit(z) << i;
  });
  console.log(`Part 1: ${p1}`);

  // Reverse map operations for later use
  let opsrev = {};
  console.log({circuit})
  for (const [out, op] of Object.entries(circuit.ops)) {
    opsrev[`${op.a}:${op.op}:${op.b}`] = out;
  }

  xs.sort();
  ys.sort();
  zs.sort();


  let c = '',
    cc = '';
  const swaps = [];

  for (let i = 0; i < zs.length - 1; i++) {
    let xo = opsrev[`${min(xs[i], ys[i])}:XOR:${max(xs[i], ys[i])}`];
    let an = opsrev[`${min(xs[i], ys[i])}:AND:${max(xs[i], ys[i])}`];

    if (c === '') {
      c = an;
    } else {
      let pos = [];
      for (const [op, out] of Object.entries(opsrev)) {
        const [a, operation, b] = op.split(':');
        if (operation === 'AND') {
          if (a === xo) {
            pos.push({ s1: c, s2: b, gt: out });
          } else if (b === xo) {
            pos.push({ s1: c, s2: a, gt: out });
          } else if (a === c) {
            pos.push({ s1: xo, s2: b, gt: out });
          } else if (b === c) {
            pos.push({ s1: xo, s2: a, gt: out });
          }
        }
      }

      let ccFound = false;
      if (opsrev.hasOwnProperty(`${min(xo, c)}:AND:${max(xo, c)}`)) {
        cc = opsrev[`${min(xo, c)}:AND:${max(xo, c)}`];
        ccFound = true;
      }

      if (!ccFound && pos.length > 0) {
        const { s1, s2, gt } = pos[0];
        const sub = { [s1]: s2, [s2]: s1 };
        swaps.push(s1, s2);
        console.log(
          `Found swap: ${xo}, ${c}, ${circuit.ops[gt]}, ${s1}, ${s2}, ${gt}`,
        );

        if (sub[c]) c = sub[c];
        if (sub[xo]) xo = sub[xo];
        if (sub[an]) an = sub[an];

        // Update ops and opsrev
        const newOps = {};
        for (const [out, op] of Object.entries(circuit.ops)) {
          newOps[sub[out] || out] = op;
        }
        circuit.ops = newOps;

        opsrev = {};
        for (const [out, op] of Object.entries(circuit.ops)) {
          opsrev[`${op.a}:${op.op}:${op.b}`] = out;
        }

        cc = opsrev[`${min(xo, c)}:AND:${max(xo, c)}`];
      }

      pos = [];
      for (const [op, out] of Object.entries(opsrev)) {
        const [a, operation, b] = op.split(':');
        if (operation === 'OR') {
          if (a === cc) {
            pos.push({ s1: an, s2: b, gt: out });
          } else if (b === cc) {
            pos.push({ s1: an, s2: a, gt: out });
          } else if (a === an) {
            pos.push({ s1: cc, s2: b, gt: out });
          } else if (b === an) {
            pos.push({ s1: cc, s2: a, gt: out });
          }
        }
      }

      let cFound = false;
      if (opsrev.hasOwnProperty(`${min(cc, an)}:OR:${max(cc, an)}`)) {
        c = opsrev[`${min(cc, an)}:OR:${max(cc, an)}`];
        cFound = true;
      }

      if (!cFound && pos.length > 0) {
        const { s1, s2, gt } = pos[0];
        const sub = { [s1]: s2, [s2]: s1 };
        swaps.push(s1, s2);
        console.log(
          `Found swap: ${cc}, ${an}, ${circuit.ops[gt]}, ${s1}, ${s2}, ${gt}`,
        );

        if (sub[cc]) cc = sub[cc];
        if (sub[an]) an = sub[an];

        // Update ops and opsrev
        const newOps = {};
        for (const [out, op] of Object.entries(circuit.ops)) {
          newOps[sub[out] || out] = op;
        }
        circuit.ops = newOps;

        opsrev = {};
        for (const [out, op] of Object.entries(circuit.ops)) {
          opsrev[`${op.a}:${op.op}:${op.b}`] = out;
        }

        c = opsrev[`${min(cc, an)}:OR:${max(cc, an)}`];
      }
    }
    console.log(`Position ${i}: ${xo}, ${an}, ${c}, ${cc}`);
  }

  swaps.sort();
  const result = swaps.join(',');
  console.log(`\nPart 2: ${result}`);
});
