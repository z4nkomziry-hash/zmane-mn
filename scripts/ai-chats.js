// ai-chat.js - مامۆستایێ AI-یێ زیرەک بۆ پراکتیزەکرنا زمانان

class AIChatBot {
    constructor() {
        this.conversationHistory = [];
        this.maxFreeQuestions = 10;
        this.dailyQuestions = 0;
        this.loadDailyCount();
    }
    
    // بارکرنا ژمارا پرسیارێن ئەمڕۆ
    loadDailyCount() {
        const today = new Date().toDateString();
        const saved = JSON.parse(localStorage.getItem('aiDailyQuestions') || '{}');
        
        if (saved.date !== today) {
            this.dailyQuestions = 0;
            this.saveDailyCount();
        } else {
            this.dailyQuestions = saved.count || 0;
        }
    }
    
    saveDailyCount() {
        localStorage.setItem('aiDailyQuestions', JSON.stringify({
            date: new Date().toDateString(),
            count: this.dailyQuestions
        }));
    }
    
    // پشکنین ئەگەر بکارهێنەر دشێت پرسیار بکەت
    canAskQuestion() {
        const user = auth.getCurrentUser();
        if (!user) return false;
        
        // پرێمیۆم بێ سنوورە
        if (user.isPremium) return true;
        
        return this.dailyQuestions < this.maxFreeQuestions;
    }
    
    // وەرگرتنا بەرسڤا AI-یێ (سیمولەیشن - د پرۆدەکشنێدا API-یا راسەتین بکاربینە)
    async getResponse(userMessage, languageCode) {
        if (!this.canAskQuestion()) {
            return {
                success: false,
                message: '🚫 تە گوهیشتیە سنوورێ پرسیارێن بێ پارە یێن ئەمڕۆ. بو بێ سنوور بوونێ، پاکێجا پرێمیۆم بکڕە.'
            };
        }
        
        // زێدەکرنا پرسیارێ بو مێژوویا گۆفتوگۆیێ
        this.conversationHistory.push({
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        });
        
        // سیمولەیشنا بەرسڤا AI-یێ (ئەڤە دێ ب API-یا راسەتین بهێتە گوهۆڕین)
        const response = await this.simulateAIResponse(userMessage, languageCode);
        
        this.conversationHistory.push({
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString()
        });
        
        // زێدەکرنا ژمارا پرسیاران
        this.dailyQuestions++;
        this.saveDailyCount();
        
        // زێدەکرنا XP
        if (auth.isLoggedIn()) {
            auth.addXP(10);
        }
        
        return {
            success: true,
            message: response
        };
    }
    
    // سیمولەیشنا AI-یێ (بو دێمویێ)
    async simulateAIResponse(message, languageCode) {
        // بو دێمۆیێ، بەرسڤێن ئامادە ددەین
        const responses = {
            'ku-BHD': [
                'سلاڤ! باشە تو چاوا یی؟ ئەم دشێین پراکتیزێ بکەین.',
                'زۆر باشە! تە بەرەف پێشڤە چوویی. هەر بەردەوام بە.',
                'ئەڤە پرسیارەکا باشە! بۆ بەرسڤدانێ، دەبیت...',
                'تە باش دەربڕی! ئەگەر تە هێشتر پرسیار هەبن، بپرسە.',
                'ئەز دشێم هاریکاریا تە بکەم د فێربوونا رێزمانێ، ئاخفتنێ، یان ڤۆکابلەریێدا. تو چ دڤێت؟'
            ],
            'en': [
                'Hello! How are you today? Let us practice together.',
                'Great job! You are making excellent progress. Keep it up!',
                'That is an interesting question. Let me explain...',
                'You expressed that very well! Feel free to ask more questions.',
                'I can help you with grammar, speaking, or vocabulary. What would you like?'
            ]
        };
        
        const langResponses = responses[languageCode] || responses['en'];
        const randomResponse = langResponses[Math.floor(Math.random() * langResponses.length)];
        
        // سیمولەیشنا دەمێ چاڤەرێ (وەک API-یا راسەتین)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return randomResponse;
    }
    
    // پاکژکرنا مێژوویا گۆفتوگۆیێ
    clearHistory() {
        this.conversationHistory = [];
    }
    
    // وەرگرتنا مێژوویێ
    getHistory() {
        return this.conversationHistory;
    }
}

const aiChat = new AIChatBot();

// --- UI فەنکشن ---

function openAIChat() {
    if (!auth.isLoggedIn()) {
        alert('🛑 بو بکارئینانا AI-یێ، دەبیت ئێکێ چوویە ژوور!');
        showLoginForm();
        return;
    }
    
    // دروستکرنا مۆدێلا چاتێ ئەگەر نەبیت
    if (!document.getElementById('aiChatModal')) {
        createAIChatModal();
    }
    
    document.getElementById('aiChatModal').style.display = 'flex';
    updateChatUI();
}

function createAIChatModal() {
    const modal = document.createElement('div');
    modal.id = 'aiChatModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content modal-lg" style="max-width: 600px;">
            <span class="close" onclick="closeModal('aiChatModal')">&times;</span>
            <div class="chat-container">
                <div class="chat-header">
                    <div class="chat-avatar">🤖</div>
                    <div>
                        <h3>مامۆستایێ AI-یێ</h3>
                        <p class="chat-status">ئامادەیە بو پراکتیزێ ✨</p>
                    </div>
                    <div id="chatLimit" class="chat-limit"></div>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <div class="message assistant">
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">
                            <p>👋 سلاڤ! ئەز مامۆستایێ تە یێ AI-یێ مە. چاوا ئەز دشێم هاریکاریا تە بکەم د فێربوونا زمانیدا؟</p>
                            <p style="font-size:0.85rem; color:#64748b; margin-top:0.5rem;">
                                💡 دشێی بپرسی: رێزمان، ڤۆکابلەری، پراکتیزەکرنا ئاخفتنێ، یان وەرگێڕان
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="chat-input-area">
                    <select id="chatLanguage" class="chat-lang-select">
                        <option value="ku-BHD">کوردی بەهدینی</option>
                        <option value="ku-SOR">کوردی سۆرانی</option>
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                    </select>
                    <input type="text" id="chatInput" placeholder="پرسیارا خۆ بنڤیسە..." 
                           onkeypress="if(event.key==='Enter') sendChatMessage()">
                    <button onclick="sendChatMessage()" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    const language = document.getElementById('chatLanguage').value;
    
    if (!message) return;
    
    // نیشاندانا پەیاما بکارهێنەری
    addChatMessage('user', message);
    input.value = '';
    
    // نیشاندانا "دەینڤسیت..."
    const typingId = addTypingIndicator();
    
    // وەرگرتنا بەرسڤا AI-یێ
    const result = await aiChat.getResponse(message, language);
    
    // ژێبرنا ئیندیکەیتۆرێ
    removeTypingIndicator(typingId);
    
    if (result.success) {
        addChatMessage('assistant', result.message);
    } else {
        addChatMessage('system', result.message);
    }
    
    updateChatUI();
}

function addChatMessage(type, content) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const avatars = {
        user: '👤',
        assistant: '🤖',
        system: '⚠️'
    };
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatars[type]}</div>
        <div class="message-content">
            <p>${content}</p>
            <span class="message-time">${new Date().toLocaleTimeString()}</span>
        </div>
    `;
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addTypingIndicator() {
    const messagesDiv = document.getElementById('chatMessages');
    const id = 'typing_' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.className = 'message assistant';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const typingDiv = document.getElementById(id);
    if (typingDiv) typingDiv.remove();
}

function updateChatUI() {
    const limitDiv = document.getElementById('chatLimit');
    if (limitDiv) {
        const remaining = aiChat.maxFreeQuestions - aiChat.dailyQuestions;
        const user = auth.getCurrentUser();
        
        if (user && user.isPremium) {
            limitDiv.innerHTML = '<span class="badge-premium">💎 پرێمیۆم - بێ سنوور</span>';
        } else {
            limitDiv.innerHTML = `<span class="badge-free">📊 ${remaining} پرسیار ماوین</span>`;
        }
    }
}

// --- CSS زێدەکرن بۆ چات ---
const chatStyles = `
.chat-container {
    display: flex;
    flex-direction: column;
    height: 500px;
}

.chat-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--primary-bg);
    border-radius: var(--radius) var(--radius) 0 0;
    border-bottom: 1px solid #e2e8f0;
}

.chat-avatar {
    font-size: 2.5rem;
}

.chat-status {
    color: var(--secondary);
    font-size: 0.9rem;
}

.chat-limit {
    margin-right: auto;
}

.badge-premium {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: #000;
    padding: 0.3rem 0.8rem;
    border-radius: var(--radius-full);
    font-size: 0.85rem;
    font-weight: 600;
}

.badge-free {
    background: var(--gray-bg);
    color: var(--gray);
    padding: 0.3rem 0.8rem;
    border-radius: var(--radius-full);
    font-size: 0.85rem;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    background: var(--white);
}

.message {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    animation: messageSlide 0.3s ease;
}

@keyframes messageSlide {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.message.user {
    flex-direction: row-reverse;
}

.message-avatar {
    font-size: 2rem;
    min-width: 40px;
    text-align: center;
}

.message-content {
    background: var(--gray-bg);
    padding: 1rem;
    border-radius: var(--radius);
    max-width: 70%;
}

.message.user .message-content {
    background: var(--primary);
    color: var(--white);
}

.message-time {
    font-size: 0.75rem;
    color: var(--gray-light);
    display: block;
    margin-top: 0.25rem;
}

.message.user .message-time {
    color: rgba(255,255,255,0.7);
}

.chat-input-area {
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #e2e8f0;
    background: var(--white);
    border-radius: 0 0 var(--radius) var(--radius);
}

.chat-lang-select {
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: var(--radius);
    font-family: var(--font-main);
    outline: none;
}

.chat-input-area input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: var(--radius);
    font-family: var(--font-main);
    outline: none;
}

.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 0.5rem 0;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    background: var(--gray-light);
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-10px); }
}
`;

// زێدەکرنا ستایلا چاتێ بۆ دۆکیومێنتێ
const styleElement = document.createElement('style');
styleElement.textContent = chatStyles;
document.head.appendChild(styleElement);