document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('memory-grid');
    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    const bestScoreDisplay = document.getElementById('best-score');
    const resetBtn = document.getElementById('reset-button');
    const winOverlay = document.getElementById('win-overlay');
    const playAgainBtn = document.getElementById('play-again');
    const finalMovesDisplay = document.getElementById('final-moves');
    const finalTimeDisplay = document.getElementById('final-time');

    const cardIcons = ['🚀', '🎨', '💻', '⚡', '🎮', '🌈', '🔥', '💎'];
    let cards = [...cardIcons, ...cardIcons];
    let flippedCards = [];
    let matchedCards = [];
    let moves = 0;
    let timer = 0;
    let timerInterval = null;
    let isLocked = false;

    // Load best score from local storage
    let bestScore = localStorage.getItem('memoryGameBestScore') || '--';
    bestScoreDisplay.textContent = bestScore;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createCard(icon, index) {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.icon = icon;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="card-front">${icon}</div>
            <div class="card-back"></div>
        `;

        card.addEventListener('click', flipCard);
        return card;
    }

    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            timer++;
            const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
            const seconds = (timer % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function flipCard() {
        if (isLocked) return;
        if (this.classList.contains('flip')) return;
        if (flippedCards.length === 2) return;

        startTimer();

        this.classList.add('flip');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkMatch();
        }
    }

    function checkMatch() {
        isLocked = true;
        const [card1, card2] = flippedCards;

        if (card1.dataset.icon === card2.dataset.icon) {
            card1.removeEventListener('click', flipCard);
            card2.removeEventListener('click', flipCard);
            matchedCards.push(card1, card2);
            flippedCards = [];
            isLocked = false;

            if (matchedCards.length === cards.length) {
                gameWin();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flip');
                card2.classList.remove('flip');
                flippedCards = [];
                isLocked = false;
            }, 1000);
        }
    }

    function gameWin() {
        stopTimer();
        finalMovesDisplay.textContent = moves;
        finalTimeDisplay.textContent = timerDisplay.textContent;
        winOverlay.classList.add('active');

        if (bestScore === '--' || moves < parseInt(bestScore)) {
            bestScore = moves;
            localStorage.setItem('memoryGameBestScore', bestScore);
            bestScoreDisplay.textContent = bestScore;
        }
    }

    function initGame() {
        grid.innerHTML = '';
        flippedCards = [];
        matchedCards = [];
        moves = 0;
        timer = 0;
        movesDisplay.textContent = '0';
        timerDisplay.textContent = '00:00';
        winOverlay.classList.remove('active');
        stopTimer();

        const shuffledCards = shuffle(cards);
        shuffledCards.forEach((icon, index) => {
            grid.appendChild(createCard(icon, index));
        });
    }

    resetBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', initGame);

    initGame();
});
