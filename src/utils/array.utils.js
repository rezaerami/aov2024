function find2d(array, value) {
  for (let row = 0; row < array.length; row++) {
    for (let col = 0; col < array[row].length; col++) {
      if (array[row][col] === value) {
        return [row, col];
      }
    }
  }
  return null;
}

const isOnBorder = (array, x, y) => {
  const boundaries = [0, 0, array.length - 1, array[0].length - 1];
  return boundaries.includes(x) || boundaries.includes(y);
};

module.exports = { find2d, isOnBorder };
