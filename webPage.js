const webPage = {
  userHome: function (
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
  ) {
    return `
      <html>
      <head>
      <title>HomePage</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sono:wght@200..800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Coiny&family=Sono:wght@200..800&display=swap" rel="stylesheet">


        <link rel="stylesheet" href="/user-home.css">
      </head>
      <body>
        <h1>Welcome, ${username}!</h1>
        <div class="words-list"><span class="words-title">Available Words: </span>${words
          .map(
            (availableWord) =>
              `<span class="word-box ${
                guessedWords.includes(availableWord.toLowerCase())
                  ? availableWord.toLowerCase() === secretWord
                    ? "correct-guess"
                    : "valid-guess"
                  : ""
              } word-clickable" onclick="wordClicked('${availableWord}')">${availableWord}</span>`
          )
          .join(" ")}</div>

<div class="playarea-container">
    <div class="left-area">
          <div class="guessed-words"><span class="guessed-words-title"> Guessed Words: </span>${guessedWords
            .map((word, index) => {
              const num = matchedLettersList[index];
              return `<span class="word-box ${
                word === secretWord ? "correct-guess" : "valid-guess"
              }">${word}[${num}]</span>`;
            })
            .join("")}</div>
        <p>Valid Guesses: <span class="result">${validGuesses}</span></p>
        <p>Recent Guess: <span class="result">${
          recentGuess || "None"
        }</span></p>
        <p>Matching Letters: <span class="result">${
          matchingLetters || "None"
        }</span></p>
        <p>Games Won: <span class="result">${wonGames || "0"}</span></p>
        ${
          status === "won"
            ? "<p class='guess-message'>Correct Guess! You Won!</p>"
            : status === "invalid guess"
            ? "<p class='guess-message'>Invalid Guess!</p>"
            : status === "valid but incorrect guess"
            ? "<p class='guess-message'>Incorrect! Have Another Try!</p>"
            : ""
        }
        <form action="/guess" method="POST" id="guessForm">
          <input type="text" id="guessInput" name="guess" placeholder="Enter your guess" required>
          <button type="submit">Guess</button>
        </form>
        </div>

        <div class="right-area">
        <form action="/new-game" method="POST">
          <button type="submit">Start New Game</button>
        </form>
        <form action="/logout" method="POST">
          <button type="submit" class="logout-button">Logout</button>
        </form>
        <button id="rules-button" class="rules-button">Game Rules</button>
        </div>
</div>

<div id="popup" class="popup">
    <h2>Game Rules</h2>
    <p>1.Each time you start a new game, there will be a secret word for you. In order to win, you need to pick a word from "Available Words" to match the secret word(case-insenstive).
    </p>
    <p>2.When you have picked a word, the corresponding word in "Available Words" will change its color. If you made a correct guess, it would turn colorful; otherwise, it would turn purple.</p>
    <p>3.The number behind each guessed word represents the number of letters that are matched with the secret word(case-insenstive).
    <p>3.You can only choose the word which color is grey(original color) in "Available Words". Otherwise, it would be an invalid guess.</p>
    <p>4.There is no limitation of guesses. But whenever you want to restart the game, you can click "Start New Game" button.</p>
    <p>5.To make a guess, you can either click the word or input the word in the input box.</p>



    

    <button id="closePopup" class="close-popup">close</button>
</div>

<script>
          function wordClicked(word) {
            document.getElementById('guessInput').value = word;
            document.getElementById('guessForm').submit();
          }

          const rulesBtn = document.getElementById('rules-button');
          const popup = document.getElementById('popup');
          const closePopup = document.getElementById('closePopup');
      
        
          rulesBtn.addEventListener('click', function() {
            popup.classList.remove('popup');
              popup.classList.add('active');
          });

          closePopup.addEventListener('click', function(){
            popup.classList.remove('active');
            popup.classList.add('popup');
          });



        </script>


      </body>
    </html>
          `;
  },
  loginForm: function () {
    return `<!doctype html>
        <html>
          <head>
            <title>Login</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Coiny&family=Sono:wght@200..800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Sono:wght@200..800&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="/login.css">
          </head>
          <body>
            <div class="form-container">
            <form action="/login" method="post">
                <label for="username">Welcome</label>
                <input type="text" id="username" name="username" placeholder="Please Enter Your Username" required>
                <button type="submit">Login</button>
                <p>letters or numbers only</p> 
            </form>
            </div>
          </body>
        </html>`;
  },
  erroPage: function () {
    return `
        <html>
          <head>
          <title>Erro</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Coiny&family=Sono:wght@200..800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Sono:wght@200..800&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="/erro-page.css">
          </head>
          <body>
          <div class="form-container">
            <h1>Oops! Invalid username. Please try again!</h1>
            <form action="/login" method="POST">
              <input type="text" name="username" placeholder="Enter your username" required>
              <button type="submit">Login</button>
              <p>letters or numbers only</p> 
            </form>
          </div>
          </body>
        </html>
      `;
  },
  invalidSidPage: function () {
    return `
    <html>
    <head>
    <title>Erro</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Coiny&family=Sono:wght@200..800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Sono:wght@200..800&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="/invalidsid-page.css">
    </head>
    <body>
    <div class="form-container">
      <h1>Oops! Wrong Session ID. Please try again!</h1>
      <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Enter your username" required>
        <button type="submit">Login</button>
        <p>letters or numbers only</p> 
      </form>
    </div>
    </body>
  </html>
    `;
  },
};

module.exports = webPage;
