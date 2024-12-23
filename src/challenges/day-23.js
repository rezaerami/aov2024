const path = require('path');
const { readInput } = require('../utils/input.utils');
const { timer } = require('../utils/timer.utils');

const inputFilePath = path.resolve('inputs', 'day-23.txt');
const input = readInput(inputFilePath);
timer.start();

const graph = buildGraph(input);
const COMPUTER_PREFIX = 't';

function buildGraph(connections) {
  const graph = {};
  for (const connection of connections) {
    const [nodeA, nodeB] = connection.split('-');
    if (!graph[nodeA]) graph[nodeA] = new Set();
    if (!graph[nodeB]) graph[nodeB] = new Set();
    graph[nodeA].add(nodeB);
    graph[nodeB].add(nodeA);
  }
  return graph;
}

function findTrios(graph) {
  const trios = new Set();
  for (const node in graph) {
    const neighbors = Array.from(graph[node]);
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        const neighborA = neighbors[i];
        const neighborB = neighbors[j];
        if (graph[neighborA].has(neighborB)) {
          const trio = [node, neighborA, neighborB].sort().join(',');
          trios.add(trio);
        }
      }
    }
  }
  return Array.from(trios);
}

function filterTriosByPrefix(trios) {
  return trios.filter((trio) =>
    trio.split(',').some((computer) => computer.startsWith(COMPUTER_PREFIX)),
  );
}

function findMaximalCliques(graph) {
  const cliques = [];
  const nodes = new Set(Object.keys(graph));
  bronKerbosch(new Set(), nodes, new Set(), graph, cliques);
  return cliques;
}

function bronKerbosch(R, P, X, graph, cliques) {
  if (P.size === 0 && X.size === 0) {
    cliques.push([...R]);
    return;
  }
  for (const v of Array.from(P)) {
    const neighbors = graph[v];
    bronKerbosch(
      new Set([...R, v]),
      new Set([...P].filter((u) => neighbors.has(u))),
      new Set([...X].filter((u) => neighbors.has(u))),
      graph,
      cliques,
    );
    P.delete(v);
    X.add(v);
  }
}

function findLargestClique(graph) {
  const cliques = findMaximalCliques(graph);
  return cliques.reduce(
    (largest, clique) => (clique.length > largest.length ? clique : largest),
    [],
  );
}

const allTrios = findTrios(graph);
const filteredTrios = filterTriosByPrefix(allTrios);
const largestCommunity = findLargestClique(graph).sort();

console.table({
  'Part 1': filteredTrios.length,
  'Part 2': largestCommunity.join(),
  'Duration(ms)': timer.end(),
});
