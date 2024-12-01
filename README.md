# Advent of Code 2024

[Advent of Code](https://adventofcode.com/) is an annual series of programming challenges released daily during December. Each challenge consists of two parts, testing problem-solving skills and coding proficiency in various programming languages. It's a great way to practice, learn, and compete with others around the world.

This repository provides Node.js solutions to the challenges for Advent of Code 2024.

## Installation of Packages

Run the following command to install the required dependencies:
```bash
yarn
```

## Setting Up the Repository

Copy the `.env.example` file to create your `.env` file:
```bash
cp .env.example .env
```

### Important Note
Ensure you retrieve your session cookie from the Advent of Code website and paste it into the `.env` file. This will make it easier to fetch and manage daily challenge inputs.

## Fetching Days

Use the following command to fetch the input for a specific day:
```bash
yarn fetch:day <dayNumber>
```

### How It Works
- The script fetches the input for the specified day from the Advent of Code website.
- It saves the input in the `inputs/` directory as `day-<dayNumber>.txt`.
- If a corresponding script file does not already exist in the `src/` directory, it creates a new file named `day-<dayNumber>-challenge.js` with boilerplate code to read and log the input.
- If a challenge file already exists, only the input is fetched and saved.

## Running Challenges

Use the following command to run a specific challenge:
```bash
node src/challenges/challenge-name.js
```

## Contribution
Feel free to fork this repository, improve the code, or add solutions for missing days. Contributions are always welcome!

