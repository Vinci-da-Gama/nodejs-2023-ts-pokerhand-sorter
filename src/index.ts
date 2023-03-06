import * as fs from "node:fs";
import * as readline from "node:readline";
import * as path from "path";
import { DateTime } from "luxon";

import {
  cardValues,
  whoWins,
  royalFlushValues,
  /* resultDir, */
} from "./constants/Variables";
import { KeyStrValNumInterface } from "./contracts/interface";

// result dictionary
const scores: KeyStrValNumInterface = {
  [whoWins[0]]: 0,
  [whoWins[1]]: 0,
};

// Define func to find the rank of a hand
function findRank(hand: string[]) {
  const values = hand.map((card) => cardValues[card[0]]);
  console.log(`values: ${values}`);
  const suits = hand.map((card) => card[1]);
  values.sort((currentCard, nextCard) => currentCard - nextCard);
  if (
    new Set(suits).size === 1 &&
    values.join("") === royalFlushValues.join("")
  ) {
    return 9; // Royal Flush
  } else if (
    new Set(suits).size === 1 &&
    values.join("") ===
      Array.from(new Array(5), (_, i) => i + Math.min(...values)).join("")
  ) {
    return 8; // Straight flush
  } else if (new Set(values).size === 2) {
    return 7; // Four of a kind or Full house
  } else if (new Set(suits).size === 1) {
    return 6; // Flush
  } else if (
    values.join("") ===
    Array.from(new Array(5), (_, i) => i + Math.min(...values)).join("")
  ) {
    return 5; // Straight
  } else if (
    new Set(values).size === 3 &&
    [2, 3].includes(values.filter((v) => v === values[0]).length) &&
    [2, 3].includes(values.filter((v) => v === values[2]).length)
  ) {
    return 4; // Two pairs and Three of a kind
  } else if (new Set(values).size === 3) {
    return 3; // Three of a kind, maybe Two pairs
  } else if (new Set(values).size === 4) {
    return 2; // One pair
  } else {
    return 1; // High card
  }
}

// Define func to compare two hands and return the winner
function matchHands(hand1: string[], hand2: string[]) {
  const rank1 = findRank(hand1),
    rank2 = findRank(hand2);
  if (rank1 > rank2) {
    return whoWins[0];
  } else if (rank1 < rank2) {
    return whoWins[1];
  } else {
    const player1Values = hand1
      .map((card: string) => cardValues[card[0]])
      .sort((currentCard, nextCard) => nextCard - currentCard);
    const player2Values = hand2
      .map((card) => cardValues[card[0]])
      .sort((currentCard, nextCard) => nextCard - currentCard);
    // try reduce
    for (let i = 0; i < 5; i++) {
      if (player1Values[i] > player2Values[i]) {
        return whoWins[0];
      } else if (player1Values[i] < player2Values[i]) {
        return whoWins[1];
      }
    }
    return whoWins[2];
  }
}

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

    readingFile.on("data", function (chunk: string | Buffer) {
      const lines = Buffer.from(chunk).toString().split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Ignore empty lines
        if (line.trim() === "") {
          continue;
        }

        // Parse the hands
        const cards = line.trim().split(" ");
        const hand1 = cards.slice(0, 5);
        const hand2 = cards.slice(5);
        console.log("hand 1:", hand1);
        console.log("hand 2:", hand2);

        // Compare the hands and update the number of wins
        const result = matchHands(hand1, hand2);
        if (result !== whoWins[2]) {
          scores[result] += 1;
        }
      }
    });

    readingFile.on("end", function () {
      // Print the results to the terminal
      console.log(
        `\n\nPlayer 1: ${scores[whoWins[0]]}, Player 2: ${scores[whoWins[0]]}`
      );

      // Create test output directory if it doesn't exist
      const resultDir = "testOutcome";
      fs.mkdirSync(resultDir, { recursive: true });

      // Save result to file, file name: result_date_time.txt
      const now = DateTime.now();
      const dateTimeStr = now.toFormat("yyyy-MM-dd_HH-mm-ss");
      const resultFileName = `result_${dateTimeStr}.txt`;
      const outputPath = path.join(resultDir, resultFileName);

      const resultFile = fs.createWriteStream(outputPath);

      for (const [player, score] of Object.entries(scores)) {
        resultFile.write(`${player}: ${score}\n`);
      }

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
