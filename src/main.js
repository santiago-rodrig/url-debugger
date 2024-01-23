const pino = require("pino");
const pinoPretty = require("pino-pretty");
const { parse } = require("csv-parse");
const path = require("path");
const fs = require("fs");
const { URLSearchParams } = require("url");
const { program } = require("commander");

// Set the logger
const stream = pinoPretty({
  levelFirst: true,
  colorize: true,
  ignore: 'pid,time,hostname'
});
const logger = pino({}, stream);

// Bring the action
program
  .name("url-debugger")
  .description("CLI to debug URLs saved in a CSV file")
  .version("1.0.0")
  .argument("<CSV file path>", "Example file at https://raw.githubusercontent.com/santiago-rodrig/url-debugger/main/sample-input.csv")
  .argument(
    "[JSON file path]",
    "A path to a JSON file to be created",
    "parsed-urls.json"
  )
  .showHelpAfterError()
  .usage('<CSV file path> [JSON file path]')
  .action((csvFilePath, jsonFilePath) => {
    // Parse CSV file with URLs
    logger.info("Parsing CSV file with URLs");
    if (!csvFilePath) {
      logger.error("A CSV file argument is required");
      process.exit(1);
    }
    let csvFileContents;
    if (path.isAbsolute(csvFilePath)) {
      try {
        csvFileContents = fs.readFileSync(csvFilePath, {
          encoding: "utf-8",
        });
      } catch (error) {
        logger.error(error.message);
        process.exit(2);
      }
    } else {
      try {
        csvFileContents = fs.readFileSync(
          path.join(process.cwd(), csvFilePath),
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
      let record;
      while ((record = parser.read()) !== null) {
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
        fs.writeFileSync(jsonFilePath, JSON.stringify(result, null, 2), {
          encoding: "utf-8",
        });
      } catch (error) {
        logger.error(error.message);
        process.exit(4);
      }
      logger.info("Created JSON file with parsed URLs");
    });
    parser.write(csvFileContents)
    parser.end();
  })
  .parse();
