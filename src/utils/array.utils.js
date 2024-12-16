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

module.exports = {
  find2d,
  isOnBorder,
  alterArray,
  isOutOfBoundaries,
  findLastNumber,
  groupBy,
};
