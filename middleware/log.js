const path = require("path");
const fs = require("fs");
function writeToLog(Path, logEntry) {
    let logFile = Path;
    fs.appendFile(logFile, logEntry + "\n", (err) => {
      if (err) {
        console.error(`Error writing to log file: ${err}`);
      }
    });
  }
  module.exports = { writeToLog };