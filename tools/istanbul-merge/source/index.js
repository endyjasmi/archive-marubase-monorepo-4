#!/usr/bin/env node

/* eslint-disable */
const { program } = require("commander");
const libCoverage = require("istanbul-lib-coverage");
const fs = require("fs");
const glob = require("glob");
const package = require("../package.json");
const path = require("path");

program
  .name("istanbul-merge")
  .requiredOption("-i, --inputs <input...>", "input coverage files path")
  .requiredOption("-o, --output <output>", "output coverage file path")
  .version(package.version, "-v, --version")
  .parse();

const { inputs, output } = program.opts();

const inputPathSet = new Set();
for (const inputPattern of inputs)
  for (const inputPath of glob.sync(inputPattern))
    inputPathSet.add(path.resolve(inputPath));

const toNormalizeEntries = ([key, value]) => [
  path.resolve(key),
  { ...value, path: path.resolve(value.path) },
];

const outputCoveragMap = libCoverage.createCoverageMap({});
for (const inputPath of inputPathSet) {
  const inputRawData = fs.readFileSync(inputPath);
  const inputRawCoverage = JSON.parse(inputRawData);
  const inputRawEntries = Object.entries(inputRawCoverage);
  const inputEntries = inputRawEntries.map(toNormalizeEntries);
  const inputCoverage = Object.fromEntries(inputEntries);

  const inputCoverageMap = libCoverage.createCoverageMap(inputCoverage);
  outputCoveragMap.merge(inputCoverageMap);
}

const outputPath = path.resolve(output);
const outputParentPath = path.dirname(outputPath);
if (!fs.existsSync(outputParentPath))
  fs.mkdirSync(outputParentPath, { recursive: true });

const outputRawCoverage = outputCoveragMap.toJSON();
const outputRawData = JSON.stringify(outputRawCoverage);
fs.writeFileSync(outputPath, outputRawData);
