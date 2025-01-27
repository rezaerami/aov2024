const path = require('path');
const { readInput } = require('../../utils/input.utils');
const { timer } = require('../../utils/timer.utils');

const inputFilePath = path.resolve('inputs', '2024', 'day-22.txt');
const input = readInput(inputFilePath);
timer.start();

const NUM_OF_SECRETS = 2000;
const MODULO = 16777216;

function getNextSecretNumber(secret) {
  secret = (secret ^ (secret * 64)) % MODULO;

  secret = (secret ^ Math.floor(secret / 32)) % MODULO;

  secret = (secret ^ (secret * 2048)) % MODULO;

  if (secret < 0) {
    secret += MODULO;
  }

  return secret;
}

function simulateSecrets(initialSecret) {
  const secrets = [initialSecret];
  const prices = [initialSecret % 10];

  for (let i = 0; i < NUM_OF_SECRETS; i++) {
    const secret = getNextSecretNumber(secrets[secrets.length - 1]);
    secrets.push(secret);
    prices.push(secret % 10);
  }
  return { secrets, prices };
}

function getPriceChange(prices) {
  const differences = [];
  for (let i = 0; i < prices.length - 1; i++) {
    differences.push(prices[i + 1] - prices[i]);
  }
  return differences;
}

function calculateSumOfSecrets(initialSecrets) {
  let totalSum = 0;
  const cache = new Map();

  for (const initialSecret of initialSecrets) {
    const { secrets, prices } = simulateSecrets(initialSecret);
    const changes = getPriceChange(prices);

    totalSum += secrets[secrets.length - 1];

    const visited = new Set();
    for (let i = 0; i < changes.length - 3; i++) {
      const sequence = changes.slice(i, i + 4).toString();

      if (visited.has(sequence)) continue;

      const price = prices[i + 4];
      cache.set(sequence, (cache.get(sequence) || 0) + price);
      visited.add(sequence);
    }
  }

  const maxSell = Math.max(...cache.values());
  return { totalSum, maxSell };
}

const { totalSum, maxSell } = calculateSumOfSecrets(input);

console.table({
  'Part 1': totalSum,
  'Part 2': maxSell,
  'Duration(ms)': timer.end(),
});
