const find2d = (array, value) => {
  for (let row = 0; row < array.length; row++) {
    for (let col = 0; col < array[row].length; col++) {
      if (array[row][col] === value) {
        return [row, col];
      }
    }
  }
  return null;
};

const isOnBorder = (array, x, y) => {
  const boundaries = [0, 0, array.length - 1, array[0].length - 1];
  return boundaries.includes(x) || boundaries.includes(y);
};

const isOutOfBoundaries = (array, x, y) =>
  x < 0 || x >= array.length || y < 0 || y >= array[0].length;

const alterArray = (array, x, y, newValue) => {
  const newArray = JSON.parse(JSON.stringify(array));
  if (newArray?.[x]?.[y]) {
    newArray[x][y] = newValue;
  }

  return newArray;
};
const findLastNumber = (arr) => {
  const index = arr
    .slice()
    .reverse()
    .findIndex((item) => typeof item === 'number');

  if (index === -1) return null;

  const realIndex = arr.length - 1 - index;
  return { index: realIndex, value: arr[realIndex] };
};

const groupBy = (array, property) => {
  return Object.values(
    array.reduce((result, item) => {
      const key = String(item[property]);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    }, {}),
  );
};
const getLineOfSight = (grid, row, col, includeDiagonals = false) => {
  const rows = grid.length;
  const cols = grid[0].length;
  let result = {
    top: [],
    right: [],
    bottom: [],
    left: [],
  };

  // Collect top neighbors
  for (let r = row - 1; r >= 0; r--) {
    result.top.push(grid[r][col]);
  }

  // Collect right neighbors
  for (let c = col + 1; c < cols; c++) {
    result.right.push(grid[row][c]);
  }

  // Collect bottom neighbors
  for (let r = row + 1; r < rows; r++) {
    result.bottom.push(grid[r][col]);
  }

  // Collect left neighbors
  for (let c = col - 1; c >= 0; c--) {
    result.left.push(grid[row][c]);
  }

  if (includeDiagonals) {
    result = {
      ...result,
      topLeft: [],
      topRight: [],
      bottomLeft: [],
      bottomRight: [],
    };
    // Top-left diagonal
    for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
      result.topLeft.push(grid[r][c]);
    }

    // Top-right diagonal
    for (let r = row - 1, c = col + 1; r >= 0 && c < cols; r--, c++) {
      result.topRight.push(grid[r][c]);
    }

    // Bottom-left diagonal
    for (let r = row + 1, c = col - 1; r < rows && c >= 0; r++, c--) {
      result.bottomLeft.push(grid[r][c]);
    }

    // Bottom-right diagonal
    for (let r = row + 1, c = col + 1; r < rows && c < cols; r++, c++) {
      result.bottomRight.push(grid[r][c]);
    }
  }

  return result;
};

function getNeighbors(grid, row, col, includeDiagonals = false) {
  const dirs = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
  ];

  if (includeDiagonals) {
    dirs.push(
      [-1, -1], // up-left
      [-1, 1], // up-right
      [1, -1], // down-left
      [1, 1], // down-right
    );
  }

  const neighbors = [];

  for (const [dr, dc] of dirs) {
    const r = row + dr;
    const c = col + dc;

    if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
      neighbors.push({
        row: r,
        col: c,
        value: grid[r][c],
      });
    }
  }

  return neighbors;
}

module.exports = {
  find2d,
  isOnBorder,
  alterArray,
  isOutOfBoundaries,
  findLastNumber,
  groupBy,
  getLineOfSight,
  getNeighbors,
};
