const gameBoard = document.getElementById('game-board');
const bgColorPicker = document.getElementById('bg-color');
const timeLeftDisplay = document.getElementById('time-left');
const pointsDisplay = document.getElementById('points');
const confettiCanvas = document.getElementById('confetti-canvas');

let timer;
let timeLeft = 120; // 2 menit
let points = 0;
let timerStarted = false;

// Data kartu dan pasangan match-nya (10 pasang, 20 kartu)
const cards = [
    { name: 'Bung Tomo', match: 'Tokoh Pertempuran Surabaya?' },
    { name: 'Tokoh Pertempuran Surabaya?', match: 'Bung Tomo' },
    { name: '1945-1949', match: 'Puncak perjuangan bangsa ada pada tahun?' },
    { name: 'Puncak perjuangan bangsa ada pada tahun?', match: '1945-1949' },
    { name: 'Deklarasi kemerdekaan dilakukan di?', match: 'Jakarta' },
    { name: 'Jakarta', match: 'Deklarasi kemerdekaan dilakukan di?' },
    { name: '2 perjanjian diplomasi yang terjadi?', match: 'Perjanjian Linggarjati dan Perjanjian Renville' },
    { name: 'Perjanjian Linggarjati dan Perjanjian Renville', match: '2 perjanjian diplomasi yang terjadi?' },
    { name: 'Konferensi Meja Bundar terjadi di?', match: 'Den Haag' },
    { name: 'Den Haag', match: 'Konferensi Meja Bundar terjadi di?' },
    { name: 'Pemimpin pasukan gerilya melawan Belanda adalah?', match: 'Jenderal Soedirman' },
    { name: 'Jenderal Soedirman', match: 'Pemimpin pasukan gerilya melawan Belanda adalah?' },
    { name: 'Kapan berakhirnya revolusi Indonesia?', match: '27 Desember 1949' },
    { name: '27 Desember 1949', match: 'Kapan berakhirnya revolusi Indonesia?' },
    { name: 'Beberapa penyebab revolusi Indonesia?', match: 'Kolonialisme Belanda, krisis ekonomi, dan pengaruh global' },
    { name: 'Kolonialisme Belanda, krisis ekonomi, dan pengaruh global', match: 'Beberapa penyebab revolusi Indonesia?' },
    { name: 'Siapa proklamator kemerdekaan RI?', match: 'Ir. Soekarno' },
    { name: 'Ir. Soekarno', match: 'Siapa proklamator kemerdekaan RI?' },
    { name: 'Partai-partai pelopor revolusi Indonesia?', match: 'Budi Utomo, Sarekat Islam, dan Partai Nasional Indonesia' },
    { name: 'Budi Utomo, Sarekat Islam, dan Partai Nasional Indonesia', match: 'Partai-partai pelopor revolusi Indonesia?' }
];

// Gandakan kartu untuk membuat pasangan
let cardData = [...cards]; // Tetap 20 kartu, sudah ada pasangannya

// Acak posisi kartu
cardData = shuffle(cardData);

// Buat kartu
cardData.forEach(cardItem => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = cardItem.name;
    card.dataset.match = cardItem.match;

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back">${cardItem.name}</div>
        </div>
    `;
    gameBoard.appendChild(card);
});

// Fungsi untuk mengacak array
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

// Variabel untuk melacak status permainan
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;

// Event Listener untuk klik kartu
gameBoard.addEventListener('click', function(e) {
    const clickedCard = e.target.closest('.card');
    if (!clickedCard || lockBoard || clickedCard.classList.contains('flipped')) return;

    // Mulai timer saat membuka kartu pertama
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    clickedCard.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = clickedCard;
    } else {
        secondCard = clickedCard;
        lockBoard = true;

        checkForMatch();
    }
});

// Fungsi cek apakah kartu cocok
function checkForMatch() {
    let isMatch = firstCard.dataset.match === secondCard.dataset.name;
    if (isMatch) {
        disableCards();
        addPoints(10);
        launchConfetti();
        checkWinCondition();
    } else {
        unflipCards();
    }
}

// Fungsi untuk sembunyikan kartu yang cocok
function disableCards() {
    setTimeout(() => {
        firstCard.classList.add('hidden');
        secondCard.classList.add('hidden');
        resetBoard();
    }, 1000);
}

// Fungsi untuk membalik kembali kartu yang tidak cocok
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Reset variabel setelah percobaan selesai
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Fungsi untuk menambah poin
function addPoints(num) {
    points += num;
    pointsDisplay.textContent = points;
}

// Fungsi untuk cek kondisi menang (poin 100)
function checkWinCondition() {
    if (points >= 100) {
        setTimeout(() => {
            alert('terima kasih yaaw-!!');
            resetGame();
        }, 500);
    }
}

// Fungsi untuk meluncurkan confetti
function launchConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
    setTimeout(() => {
        confetti.reset();
    }, 3000); // Confetti berhenti setelah 7 detik
}

// Fungsi untuk memulai timer
function startTimer() {
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('Waktu habis! Permainan akan direset.');
            resetGame();
        } else {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timeLeftDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeLeft--;
        }
    }, 1000);
}

// Fungsi untuk mereset permainan
function resetGame() {
    clearInterval(timer);
    location.reload();
}

// Mengubah warna background
bgColorPicker.addEventListener('input', function() {
    document.body.style.backgroundColor = bgColorPicker.value;
});







