const sum = (array) => array.reduce((a, b) => a + b, 0);
const mul = (array) => array.reduce((a, b) => a * b, 1);

module.exports = {
  sum,
  mul
}