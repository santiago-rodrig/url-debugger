#!/usr/bin/env node

const pino = require("pino");
const flags = require("flags");
const { parse: parseCsvSync } = require("csv-parse/sync");
const path = "path";
const fs = "fs";
const { URLSearchParams } = require("url");

// Set the logger
const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

// Parse the flags to read the output file path
const defaultOutputFilePath = "parsed-urls.json";
flags.defineString("output", defaultOutputFilePath);
flags.parse();

// Parse CSV file with URLs
logger.info("Parsing CSV file with URLs");
const args = process.argv.slice(2);
const urlsCsvFilePath = args[0];
if (!urlsCsvFilePath) {
  logger.error("A CSV file argument is required")
  process.exit(1)
}
let urlsCsvFileContents;
if (path.isAbsolute(urlsCsvFilePath)) {
  try {
    urlsCsvFileContents = fs.readFileSync(urlsCsvFilePath, { encoding: "utf-8" });
  } catch (error) {
    logger.error(error.message)
    process.exit(2)
  }
} else {
  try {
    urlsCsvFileContents = fs.readFileSync(path.join(__dirname, urlsCsvFilePath), {
      encoding: "utf-8",
    });
  } catch (error) {
    logger.error(error.message)
    process.exit(2)
  }
}
let csvRecords
try {
  csvRecords = parseCsvSync(urlsCsvFileContents, {
    columns: true,
    skip_empty_lines: true,
  });
} catch (error) {
  logger.error(error.message)
  process.exit(3)
}
logger.info("Parsed CSV file with URLs");

// Write parsed data to JSON file
logger.info("Creating JSON file with parsed URLs");
const result = {};
csvRecords.forEach((record) => {
  try {
    const url = new URL(record.url);
    const params = new URLSearchParams(url.search);
    const urlData = {
      origin: url.origin,
      path: url.pathname,
      query: {},
    };
    params.forEach((value, name) => {
      urlData.query[name] = value
    })
    result[record.name] = urlData;
  } catch (error) {
    logger.warn(error.message)
  }
});
try {
  fs.writeFileSync(flags.get("output"), JSON.stringify(result, null, 2), {
    encoding: "utf-8",
  });
} catch (error) {
  logger.error(error.message)
  process.exit(4)
}
logger.info("Created JSON file with parsed URLs");
