import { cardValues, whoWins, royalFlushValues } from "../constants/Variables";

// Define func to find the rank of a hand
const findRank = (hand: string[]): number => {
  const values = hand.map((card) => cardValues[card[0]]);
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
};

// Get player values
const getPlayerValues = (hand: string[]): number[] =>
  hand
    .map((card: string) => cardValues[card[0]])
    .sort((currentCard, nextCard) => nextCard - currentCard);

// Define func to compare two hands and return the winner
export const matchHands = (hand1: string[], hand2: string[]) => {
  const rank1 = findRank(hand1),
    rank2 = findRank(hand2);
  if (rank1 > rank2) {
    return whoWins[0];
  } else if (rank1 < rank2) {
    return whoWins[1];
  } else {
    const player1Values = getPlayerValues(hand1);
    const player2Values = getPlayerValues(hand2);
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
};
