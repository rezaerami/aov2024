const path = require('path');
const { parseInputToCells } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');
const { sum } = require('../../utils/math.utils');

const inputFilePath = path.resolve('inputs', '2024', 'day-12.txt');
const input = parseInputToCells(inputFilePath);

timer.start();

const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const edgeStart = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];
const edgeEnd = [
  [1, 0],
  [1, 1],
  [0, 1],
  [0, 0],
];

const isOutOfBounds = (x, y, grid) =>
  x < 0 || y < 0 || x >= grid.length || y >= grid[0].length;

const getRegionsInfo = (input) => {
  const visited = new Set();

  const floodFill = (sx, sy) => {
    const result = input.map((row) => row.slice().fill(false));
    const queue = [[sx, sy]];
    const value = input[sx][sy];

    while (queue.length) {
      const [x, y] = queue.pop();
      if (result[x][y]) continue;
      result[x][y] = true;

      directions.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (!isOutOfBounds(nx, ny, input) && input[nx][ny] === value) {
          queue.push([nx, ny]);
        }
      });
    }
    return result;
  };

  const regions = [];

  input.forEach((row, x) =>
    row.forEach((_, y) => {
      if (visited.has(`${x}-${y}`)) return;

      const region = floodFill(x, y);
      const area = [];
      const perimeter = [];
      const borders = [];

      region.forEach((row, i) =>
        row.forEach((cell, j) => {
          if (!cell) return;

          visited.add(`${i}-${j}`);
          area.push([x, y]);

          directions.forEach((direction, d) => {
            const dx = i + direction[0];
            const dy = j + direction[1];

            if (isOutOfBounds(dx, dy, input) || !region[dx][dy]) {
              perimeter.push([dx, dy]);
              borders.push([
                [i + edgeStart[d][0], j + edgeStart[d][1]],
                [i + edgeEnd[d][0], j + edgeEnd[d][1]],
              ]);
            }
          });
        }),
      );

      const sides = [];
      borders.forEach((border) => {
        const [start, end] = border;
        const [dx, dy] = [end[0] - start[0], end[1] - start[1]];

        const existingSide = sides.find((side) =>
          side.some((s) => {
            const [startX, startY] = [s[1][0] - s[0][0], s[1][1] - s[0][1]];
            return (
              startX === dx &&
              startY === dy &&
              ((s[0][0] === end[0] && s[0][1] === end[1]) ||
                (s[1][0] === start[0] && s[1][1] === start[1]))
            );
          }),
        );

        if (existingSide) existingSide.push(border);
        else sides.push([border]);
      });

      regions.push({ area, perimeter, sides });
    }),
  );

  return regions;
};

const regions = getRegionsInfo(input);

const partOne = sum(
  regions.map((region) => region.area.length * region.perimeter.length),
);
const partTwo = sum(
  regions.map((region) => region.area.length * region.sides.length),
);

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
