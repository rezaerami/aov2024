const https = require('https');
const { argv } = require('process');
const fs = require('fs');
const path = require('path');

if (argv.length < 3) {
  console.error('Usage: node fetchAdventInput.js <yearNumber> <dayNumber>');
  process.exit(1);
}

const yearNumber = argv[2];
const dayNumber = argv[3];
const sessionCookie = process.env.SESSION_COOKIE;

if (!sessionCookie) {
  console.error('SESSION environment variable not set in .env file');
  process.exit(1);
}

const url = `https://adventofcode.com/${yearNumber}/day/${dayNumber}/input`;

const options = {
  headers: {
    Cookie: `session=${sessionCookie}`,
  },
};

https
  .get(url, options, (res) => {
    let data = '';

    if (res.statusCode !== 200) {
      console.error(
        `Failed to fetch input: ${res.statusCode} ${res.statusMessage}`,
      );
      res.resume();
      return;
    }

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      // Write input to file
      const inputsDir = path.resolve('inputs', yearNumber);
      const inputFilePath = path.join(inputsDir, `day-${dayNumber}.txt`);

      if (!fs.existsSync(inputsDir)) {
        fs.mkdirSync(inputsDir);
      }

      fs.writeFileSync(inputFilePath, data);

      // Create challenge file if it does not exist
      const srcDir = path.resolve('src', 'challenges', yearNumber);
      const challengeFilePath = path.join(srcDir, `day-${dayNumber}.js`);

      if (!fs.existsSync(srcDir)) {
        fs.mkdirSync(srcDir);
      }

      if (!fs.existsSync(challengeFilePath)) {
        const challengeFileContent = `const path = require('path');
const { readInput } = require('../..//utils/input.utils');
const { timer } = require('../..//utils/timer.utils');

const inputFilePath = path.resolve('inputs', '${yearNumber}', 'day-${dayNumber}.txt');

const input = readInput(inputFilePath);
timer.start();

console.log(input);

const partOne = 'N/A';
const partTwo = 'N/A';

console.table({
  'Part 1': partOne,
  'Part 2': partTwo,
  'Duration(ms)': timer.end(),
});
`;

        fs.writeFileSync(
          challengeFilePath,
          challengeFileContent,
          { flag: 'wx' },
          (err) => {
            if (err && err.code !== 'EEXIST') {
              console.error(`Error writing challenge file: ${err.message}`);
            }
          },
        );
      }
    });
  })
  .on('error', (err) => {
    console.error(`Error: ${err.message}`);
  });
