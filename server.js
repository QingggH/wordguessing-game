const express = require("express");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const words = require("./words");
const webPage = require("./webPage");
const {
  gameData,
  logIn,
  newGame,
  makeGuess,
  isValidUsername,
} = require("./gameLogic");

const app = express();
const PORT = 3000;

app.use(express.static("./public"));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const sessions = {};

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
  logIn(username);

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

//new game route logic
app.post("/new-game", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !sessions[sessionId]) {
    res.send(webPage.invalidSidPage());
    return;
  }

  newGame(sessions, sessionId);
  res.redirect("/");
});

//guess route logic
app.post("/guess", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !sessions[sessionId]) {
    res.send(webPage.invalidSidPage());
    return;
  }

  const username = sessions[sessionId];
  const { guess } = req.body;

  makeGuess(guess, username);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
