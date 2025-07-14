const cards = document.querySelectorAll('.memory-card')
const counterDisplay = document.getElementById('click-counter');

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let clickCount = 0;
let matchedPairs = 0;

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flip');  // This line adds or removes the class flip on the element that was clicked.
    clickCount++;
    counterDisplay.textContent = `Clicks: ${clickCount}`;

    if (!hasFlippedCard) {
        // first click
        hasFlippedCard = true;
        firstCard = this;

        return; 
    } 
        // second click
        hasFlippedCard = false;
        secondCard = this;

        checkForMatch()
}


function checkForMatch() {
    // do cards match?
    let isMatch = firstCard.dataset.attribute === secondCard.dataset.attribute

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    // it's a match
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

     matchedPairs++;
    if (matchedPairs === cards.length / 2) {
        setTimeout(() => {
            showEndGamePopup();
        }, 500); // slight delay to allow final card to finish flipping
    }

    resetBoard()
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
                firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard()
            }, 1500);   
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null]
}

(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

function showEndGamePopup() {
  const popup = document.createElement('div');
  popup.id = 'end-game-popup';
  popup.innerHTML = `
    <div style="
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 30px;
      border: 2px solid #000;
      text-align: center;
      z-index: 1000;
    ">
      <h2>Well done!</h2>
      <p>You matched all the cards in ${clickCount} clicks.</p>
      <button id="restart-btn">Play Again</button>
    </div>
  `;
  document.body.appendChild(popup);
  document.getElementById('restart-btn').addEventListener('click', () => {
    location.reload();
  });
}


// This line adds a click event listener to every card in the cards list. So when you click a card, it will run the flipCard function.
cards.forEach(card => card.addEventListener('click', flipCard))