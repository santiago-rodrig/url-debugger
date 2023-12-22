const pino = require("pino");
const pinoPretty = require('pino-pretty')
const { parse } = require("csv-parse");
const path = require("path");
const fs = require("fs");
const { URLSearchParams } = require("url");

// Set the logger
const stream = pinoPretty({
  levelFirst: true,
  colorize: true
})
const logger = pino({}, stream);

// Parse the the output file path
const args = process.argv.slice(2);
const urlsCsvFilePath = args[0];
const defaultOutputFilePath = "parsed-urls.json";
const outputFilePath = args[1] || defaultOutputFilePath;

// Parse CSV file with URLs
logger.info("Parsing CSV file with URLs");
if (!urlsCsvFilePath) {
  logger.error("A CSV file argument is required");
  process.exit(1);
}
let urlsCsvFileContents;
if (path.isAbsolute(urlsCsvFilePath)) {
  try {
    urlsCsvFileContents = fs.readFileSync(urlsCsvFilePath, {
      encoding: "utf-8",
    });
  } catch (error) {
    logger.error(error.message);
    process.exit(2);
  }
} else {
  try {
    urlsCsvFileContents = fs.readFileSync(
      path.join(process.cwd(), urlsCsvFilePath),
      {
        encoding: "utf-8",
      }
    );
  } catch (error) {
    logger.error(error.message);
    process.exit(2);
  }
}
let records = [];
const parser = parse({ columns: true, skip_empty_lines: true });
parser.on("readable", () => {
  let record = parser.read();
  while (record !== null) {
    records.push(record);
  }
});
parser.on("error", (error) => {
  logger.error(error.message);
  process.exit(3);
});
parser.on("end", () => {
  // Records are accessible here
  logger.info("Parsed CSV file with URLs");
  const result = {};
  records.forEach((record) => {
    try {
      const url = new URL(record.url);
      const params = new URLSearchParams(url.search);
      const urlData = {
        origin: url.origin,
        path: url.pathname,
        query: {},
      };
      params.forEach((value, name) => {
        urlData.query[name] = value;
      });
      result[record.name] = urlData;
    } catch (error) {
      logger.warn(error.message);
    }
  });
  // Write parsed data to JSON file
  logger.info("Creating JSON file with parsed URLs");
  try {
    fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2), {
      encoding: "utf-8",
    });
  } catch (error) {
    logger.error(error.message);
    process.exit(4);
  }
  logger.info("Created JSON file with parsed URLs");
});
const csvFileLines = urlsCsvFileContents.split("\n");
csvFileLines.forEach((line) => {
  parser.write(line);
});
parser.end();
