const words = require("./words");

const gameData = {};

function logIn(username) {
  if (!gameData[username]) {
    const secretWord = words[Math.floor(Math.random() * words.length)];
    console.log(`Username: ${username}, Secret Word: ${secretWord}`);

    gameData[username] = {
      guessedWords: [],
      matchedLettersList: [],
      validGuesses: 0,
      recentGuess: null,
      status: null,
      secretWord: secretWord,
      matchingLetters: 0,
      wonGames: 0,
    };
  }
}

function newGame(sessions, sessionId) {
  const username = sessions[sessionId];
  const secretWord = words[Math.floor(Math.random() * words.length)];
  let game = gameData[username];
  game.guessedWords = [];
  game.matchedLettersList = [];
  game.validGuesses = 0;
  game.secretWord = secretWord;
  game.recentGuess = null;
  game.status = null;
  game.matchingLetters = 0;
  console.log(`Username: ${username}, Secret Word: ${secretWord}`);
}

function makeGuess(guess, username) {
  const game = gameData[username];
  if (
    !guess ||
    !words.map((word) => word.toLowerCase()).includes(guess.toLowerCase()) ||
    game.guessedWords.includes(guess.toLowerCase())
  ) {
    game.recentGuess = guess;
    game.matchingLetters = compare(game.recentGuess, game.secretWord);
    game.status = "invalid guess";
    return;
  } else if (guess.toLowerCase() === game.secretWord.toLowerCase()) {
    game.status = "won";
    game.wonGames++;
    game.validGuesses++;
    game.recentGuess = guess;
    game.matchingLetters = compare(game.recentGuess, game.secretWord);
    game.matchedLettersList.push(compare(guess, game.secretWord));
    game.guessedWords.push(guess.toLowerCase());
    return;
  }
  game.validGuesses++;
  game.recentGuess = guess;
  game.matchingLetters = compare(game.recentGuess, game.secretWord);
  game.status = "valid but incorrect guess";
  game.guessedWords.push(guess.toLowerCase());
  game.matchedLettersList.push(compare(guess, game.secretWord));
}

function isValidUsername(username) {
  const allowedChars = /^[a-zA-Z0-9]+$/;
  return allowedChars.test(username);
}

function compare(word1, word2) {
  word1 = word1.toUpperCase();
  word2 = word2.toUpperCase();

  const letterFrequency = {};
  let matchingCount = 0;

  for (const letter of word1) {
    letterFrequency[letter] = (letterFrequency[letter] || 0) + 1;
  }

  for (const letter of word2) {
    if (letterFrequency[letter] && letterFrequency[letter] > 0) {
      matchingCount++;
      letterFrequency[letter]--;
    }
  }
  return matchingCount;
}

module.exports = {
  gameData,
  logIn,
  newGame,
  makeGuess,
  isValidUsername,
};
