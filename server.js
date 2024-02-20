const express = require("express");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const words = require("./words");
const webPage = require("./webPage");

const app = express();
const PORT = 3000;

app.use(express.static("./public"));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const sessions = {};
const gameData = {};

//homepage route logic
app.get("/", (req, res) => {
  const sessionId = req.cookies.sessionId;
  const username = sessions[sessionId];

  if (username) {
    const game = gameData[username];
    const {
      guessedWords,
      secretWord,
      matchedLettersList,
      validGuesses,
      recentGuess,
      status,
      matchingLetters,
      wonGames,
    } = game;
    res.send(
      webPage.userHome(
        username,
        words,
        guessedWords,
        secretWord,
        matchedLettersList,
        validGuesses,
        recentGuess,
        matchingLetters,
        status,
        wonGames
      )
    );
  } else {
    res.send(webPage.loginForm());
  }
});

//login
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username || username === "dog" || !isValidUsername(username)) {
    res.send(webPage.erroPage());
    return;
  }

  const sessionId = uuidv4();
  sessions[sessionId] = username; 
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
  res.cookie("sessionId", sessionId);
  res.redirect("/");
});

//logout
app.post("/logout", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    delete sessions[sessionId];
    res.clearCookie("sessionId");
  }
  res.redirect("/");
});

//new game rouye logic
app.post("/new-game", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !sessions[sessionId]) {
    res.send(webPage.invalidSidPage);
    return;
  }

  const username = sessions[sessionId];
  const secretWord = words[Math.floor(Math.random() * words.length)];
  let game = gameData[username];

  if (!game) {
    res.redirect("/");
    return;
  }
  console.log(`Username: ${username}, Secret Word: ${secretWord}`);

  game.guessedWords = [];
  game.matchedLettersList = [];
  game.validGuesses = 0;
  game.secretWord = secretWord;
  game.recentGuess = null;
  game.status = null;
  game.matchingLetters = 0;

  res.redirect("/");
});

//guess route logic
app.post("/guess", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !sessions[sessionId]) {
    res.send(webPage.invalidSidPage);
    return;
  }

  const username = sessions[sessionId];
  const { guess } = req.body;
  const game = gameData[username];

  if (!game) {
    res.send(webPage.invalidSidPage);
    return;
  }

  if (
    !guess ||
    !words.map((word) => word.toLowerCase()).includes(guess.toLowerCase()) ||
    game.guessedWords.includes(guess.toLowerCase())
  ) {
    game.recentGuess = guess;
    game.matchingLetters = compare(game.recentGuess, game.secretWord);
    game.status = "invalid guess";
    res.redirect("/");
    return;
  } else if (guess.toLowerCase() === game.secretWord.toLowerCase()) {
    game.status = "won";
    game.wonGames++;
    game.validGuesses++;
    game.recentGuess = guess;
    game.matchingLetters = compare(game.recentGuess, game.secretWord);
    game.matchedLettersList.push(compare(guess, game.secretWord));
    game.guessedWords.push(guess.toLowerCase());
    res.redirect("/");
    return;
  }
  game.validGuesses++;
  game.recentGuess = guess;
  game.matchingLetters = compare(game.recentGuess, game.secretWord);
  game.status = "valid but incorrect guess";
  game.guessedWords.push(guess.toLowerCase());
  game.matchedLettersList.push(compare(guess, game.secretWord));
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

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
