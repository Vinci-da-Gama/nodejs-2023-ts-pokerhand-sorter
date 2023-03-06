import * as fs from "node:fs";
import * as readline from "node:readline";
import * as path from "path";
import { DateTime } from "luxon";

import { whoWins, resultDir } from "./constants/Variables";
import { KeyStrValNumInterface } from "./contracts/interface";
import { matchHands } from "./hooks/MatchHandRank";

// result dictionary
const scores: KeyStrValNumInterface = {
  [whoWins[0]]: 0,
  [whoWins[1]]: 0,
};

// Prompt user to enter path to file
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Enter Pocker Hand Sorter path to test file: ",
  function (testFile) {
    // Open file, read its contents, then compare
    const readingFile = fs.createReadStream(testFile, "utf-8");

    readingFile.on("data", (chunk: string | Buffer) => {
      const lines = Buffer.from(chunk).toString().split("\n");

      lines.forEach((line) => {
        // Ignore empty lines
        if (line.trim() === "") {
          return;
        }

        // Parse the hands
        const cards = line.trim().split(" ");
        const hand1 = cards.slice(0, 5);
        const hand2 = cards.slice(5);

        // Compare the hands and update the number of wins
        const result = matchHands(hand1, hand2);
        if (result !== whoWins[2]) {
          scores[result] += 1;
        }
      });
    });

    readingFile.on("end", () => {
      // Print the results to the terminal
      console.log(
        `\n\nPlayer 1: ${scores[whoWins[0]]}, Player 2: ${scores[whoWins[1]]}`
      );

      // Create test output directory if it doesn't exist
      fs.mkdirSync(resultDir, { recursive: true });

      // Save result to file, file name: result_date_time.txt
      const dateTimeStr = DateTime.now().toFormat("yyyy-MM-dd_HH-mm-ss");
      const resultFileName = `result_${dateTimeStr}.txt`;
      const outputPath = path.join(resultDir, resultFileName);

      const resultFile = fs.createWriteStream(outputPath);

      /* for (const [player, score] of Object.entries(scores)) {
        resultFile.write(`${player}: ${score}\n`);
      } */
      Object.keys(scores).forEach((player) => {
        resultFile.write(`${player}: ${scores[player]}\n`);
      });

      // finish and close file
      resultFile.end();

      // Print message confirming output file has been saved
      const outputFilePrintout = `
        file save to: ${outputPath}
        date and time: ${dateTimeStr}`;
      console.log(outputFilePrintout);
    });
  }
);
