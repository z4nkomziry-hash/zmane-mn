// flashcards.js - سیستەمێ فلاش کارتان ب تەکنیکا SRS

class FlashcardSystem {
    constructor() {
        this.decks = [];
        this.loadDecks();
    }
    
    // بارکرنا دەکێن فلاش کارتان
    loadDecks() {
        const saved = localStorage.getItem('flashcardDecks');
        this.decks = saved ? JSON.parse(saved) : this.getDefaultDecks();
    }
    
    // وەرگرتنا دەکێن پێشفرێ کرنێ
    getDefaultDecks() {
        return [
            {
                id: 'deck_ku_bhd_1',
                name: 'کوردی بەهدینی - سلاڤ و دانوستان',
                language: 'ku-BHD',
                cards: [
                    { front: 'سلاڤ', back: 'Hello / Peace', difficulty: 0, nextReview: new Date().toISOString() },
                    { front: 'سپاس', back: 'Thank you', difficulty: 0, nextReview: new Date().toISOString() },
                    { front: 'باش', back: 'Good / Well', difficulty: 0, nextReview: new Date().toISOString() },
                    { front: 'ئەرێ', back: 'Yes', difficulty: 0, nextReview: new Date().toISOString() },
                    { front: 'نە', back: 'No', difficulty: 0, nextReview: new Date().toISOString() },
                    { front: 'چاوا یی؟', back: 'How are you?', difficulty: 0, nextReview: new Date().toISOString() },
                    { front: 'باشم', back: 'I am fine', difficulty: 0, nextReview: new Date().toISOString() },
                    { front: 'نافێ تە چییە؟', back: 'What is your name?', difficulty: 0, nextReview: new Date().toISOString() }
                ]
            },
            {
                id: 'deck_en_1',
                name: 'English - Basic Phrases',
                language: 'en',
                cards: [
                    { front: 'Hello', back: 'سلاڤ', difficulty: 0, nextReview: new Date().toISOString() },
                    { front: 'Thank you', back: 'سپاس', difficulty: 0, nextReview: new Date().toISOString() },
                    { front: 'Good morning', back: 'بەیانیت باش', difficulty: 0, nextReview: new Date().toISOString() },
                    { front: 'Good night', back: 'شەڤ باش', difficulty: 0, nextReview: new Date().toISOString() },
                    { front: 'How are you?', back: 'چاوا یی؟', difficulty: 0, nextReview: new Date().toISOString() }
                ]
            }
        ];
    }
    
    // وەرگرتنا دەکەکی ب ناڤێ
    getDeck(deckId) {
        return this.decks.find(d => d.id === deckId);
    }
    
    // وەرگرتنا کارتێن بو پێداچوونێ ئەمڕۆ
    getCardsForReview(deckId) {
        const deck = this.getDeck(deckId);
        if (!deck) return [];
        
        const now = new Date();
        return deck.cards.filter(card => new Date(card.nextReview) <= now);
    }
    
    // نویکرنا کارتەکی دویسە SRS
    updateCardDifficulty(deckId, cardFront, difficulty) {
        const deck = this.getDeck(deckId);
        if (!deck) return;
        
        const card = deck.cards.find(c => c.front === cardFront);
        if (!card) return;
        
        // SRS ئەلگۆریتم:
        // difficulty: 0=ئاسان, 1=ناڤەندی, 2=زەحمەت
        card.difficulty = difficulty;
        
        const intervals = [7, 3, 1]; // رۆژ
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + intervals[difficulty]);
        card.nextReview = nextReview.toISOString();
        
        this.saveDecks();
        
        // زێدەکرنا XP
        if (auth.isLoggedIn()) {
            const xpGain = difficulty === 0 ? 20 : difficulty === 1 ? 10 : 5;
            auth.addXP(xpGain);
            auth.getCurrentUser().wordsLearned++;
            auth.saveCurrentUser();
            auth.updateUserInStorage();
        }
    }
    
    // پاراستنا دەکان
    saveDecks() {
        localStorage.setItem('flashcardDecks', JSON.stringify(this.decks));
    }
    
    // زێدەکرنا دەکەکی نوی
    addDeck(name, language) {
        const newDeck = {
            id: 'deck_' + Date.now(),
            name: name,
            language: language,
            cards: []
        };
        this.decks.push(newDeck);
        this.saveDecks();
        return newDeck;
    }
    
    // زێدەکرنا کارتەکی بو دەکەکی
    addCard(deckId, front, back) {
        const deck = this.getDeck(deckId);
        if (!deck) return;
        
        deck.cards.push({
            front: front,
            back: back,
            difficulty: 0,
            nextReview: new Date().toISOString()
        });
        
        this.saveDecks();
    }
}

const flashcardSystem = new FlashcardSystem();

// --- UI فەنکشن ---

let currentReviewDeck = null;
let currentReviewCards = [];
let currentCardIndex = 0;
let isFlipped = false;

function openFlashcards(deckId) {
    if (!auth.isLoggedIn()) {
        alert('🛑 بو بکارئینانا فلاش کارتان، دەبیت ئێکێ چوویە ژوور!');
        showLoginForm();
        return;
    }
    
    currentReviewDeck = flashcardSystem.getDeck(deckId);
    currentReviewCards = flashcardSystem.getCardsForReview(deckId);
    currentCardIndex = 0;
    isFlipped = false;
    
    if (currentReviewCards.length === 0) {
        alert('🎉 هەمی کارتێن ڤێ دەکێ هاتینە پێداچوون! دووبارە بەحەرێ وان بکە.');
        return;
    }
    
    // دروستکرنا مۆدێلا فلاش کارتێ
    if (!document.getElementById('flashcardModal')) {
        createFlashcardModal();
    }
    
    document.getElementById('flashcardModal').style.display = 'flex';
    showCurrentCard();
}

function createFlashcardModal() {
    const modal = document.createElement('div');
    modal.id = 'flashcardModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close" onclick="closeModal('flashcardModal')">&times;</span>
            <div class="flashcard-container">
                <div class="flashcard-progress">
                    <span id="cardProgress">کارت 1 ل 5</span>
                </div>
                
                <div class="flashcard" id="flashcard" onclick="flipCard()">
                    <div class="flashcard-inner" id="flashcardInner">
                        <div class="flashcard-front">
                            <span id="cardFrontText"></span>
                        </div>
                        <div class="flashcard-back">
                            <span id="cardBackText"></span>
                        </div>
                    </div>
                </div>
                
                <p class="flashcard-hint">👆 کلیک بکە بو دیتنا بەرسڤێ</p>
                
                <div class="flashcard-actions" id="flashcardActions" style="display:none;">
                    <button class="btn btn-success" onclick="rateCard(0)">✅ ئاسان</button>
                    <button class="btn btn-warning" onclick="rateCard(1)">🤔 ناڤەندی</button>
                    <button class="btn btn-danger" onclick="rateCard(2)">❌ زەحمەت</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // زێدەکرنا CSS-ێ بو فلاش کارتان
    const style = document.createElement('style');
    style.textContent = `
        .flashcard-container {
            text-align: center;
        }
        
        .flashcard-progress {
            margin-bottom: 1rem;
            color: var(--gray);
            font-weight: 600;
        }
        
        .flashcard {
            width: 100%;
            min-height: 250px;
            perspective: 1000px;
            cursor: pointer;
            margin: 1rem 0;
        }
        
        .flashcard-inner {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 250px;
            transition: transform 0.6s;
            transform-style: preserve-3d;
        }
        
        .flashcard-inner.flipped {
            transform: rotateY(180deg);
        }
        
        .flashcard-front, .flashcard-back {
            position: absolute;
            width: 100%;
            height: 100%;
            min-height: 250px;
            backface-visibility: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-lg);
            font-size: 2rem;
            font-weight: 700;
            padding: 2rem;
            box-shadow: var(--shadow-lg);
        }
        
        .flashcard-front {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
        
        .flashcard-back {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            transform: rotateY(180deg);
        }
        
        .flashcard-hint {
            color: var(--gray-light);
            font-size: 0.9rem;
        }
        
        .flashcard-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1.5rem;
        }
        
        .btn-warning {
            background: #f59e0b;
            color: white;
        }
        
        .btn-danger {
            background: #ef4444;
            color: white;
        }
    `;
    document.head.appendChild(style);
}

function showCurrentCard() {
    if (currentCardIndex >= currentReviewCards.length) {
        alert('🎉 تە هەمی کارتان پێداچوون!');
        closeModal('flashcardModal');
        if (auth.isLoggedIn()) {
            auth.addXP(50);
            updateDashboard();
        }
        return;
    }
    
    const card = currentReviewCards[currentCardIndex];
    document.getElementById('cardFrontText').textContent = card.front;
    document.getElementById('cardBackText').textContent = card.back;
    document.getElementById('cardProgress').textContent = 
        `کارت ${currentCardIndex + 1} ل ${currentReviewCards.length}`;
    
    // ریسێتکرنا فلاش کارتێ
    isFlipped = false;
    document.getElementById('flashcardInner').classList.remove('flipped');
    document.getElementById('flashcardActions').style.display = 'none';
}

function flipCard() {
    isFlipped = !isFlipped;
    const inner = document.getElementById('flashcardInner');
    
    if (isFlipped) {
        inner.classList.add('flipped');
        document.getElementById('flashcardActions').style.display = 'flex';
    } else {
        inner.classList.remove('flipped');
        document.getElementById('flashcardActions').style.display = 'none';
    }
}

function rateCard(difficulty) {
    const card = currentReviewCards[currentCardIndex];
    flashcardSystem.updateCardDifficulty(currentReviewDeck.id, card.front, difficulty);
    
    currentCardIndex++;
    showCurrentCard();
    
    if (auth.isLoggedIn()) {
        updateDashboard();
    }
}