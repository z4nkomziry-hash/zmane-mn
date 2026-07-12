// premium.js - سیستەمێ قفلكرن و ڤەکرنا تایبەتمەندیێن پرێمیۆم

class PremiumManager {
    constructor() {}
    
    // پشکنین ئەگەر تایبەتمەندییەک بو بکارهێنەری بەردەستە
    isFeatureAvailable(featureName) {
        if (!auth.isLoggedIn()) return false;
        
        const user = auth.getCurrentUser();
        
        // هەمی تایبەتمەندی بو پرێمیۆم بەردەستن
        if (user.isPremium) return true;
        
        // تایبەتمەندیێن بێ پارە
        const freeFeatures = [
            'basic_courses',
            'limited_ai_chat',
            'basic_flashcards',
            'dashboard',
            'profile'
        ];
        
        return freeFeatures.includes(featureName);
    }
    
    // وەرگرتنا تایبەتمەندیێن قفلكری
    getLockedFeatures() {
        if (!auth.isLoggedIn()) return [];
        
        const user = auth.getCurrentUser();
        if (user.isPremium) return [];
        
        return [
            {
                id: 'advanced_ai',
                name: '🤖 AI بێ سنوور',
                description: 'پرسیارێن بێ سنوور ژ مامۆستایێ AI',
                icon: 'fas fa-robot'
            },
            {
                id: 'speech_recognition',
                name: '🎤 پەسنەدانا دەنگدانێ',
                description: 'پراکتیزەکرنا ئاخفتنێ و پەسنەدانا دەنگێ',
                icon: 'fas fa-microphone'
            },
            {
                id: 'advanced_courses',
                name: '📚 هەمی کورس',
                description: 'دەستڕاگەهشتن ب هەمی ١٠ زمانان',
                icon: 'fas fa-book'
            },
            {
                id: 'detailed_reports',
                name: '📊 راپۆرتێن پێشکەتی',
                description: 'راپۆرتێن درێژکرنەی یێن پێشکەفتنێ',
                icon: 'fas fa-chart-bar'
            },
            {
                id: 'no_ads',
                name: '🚫 بێ ریکلام',
                description: 'تەجرەبەکا فێربوونێ یا بێ ریکلام',
                icon: 'fas fa-ban'
            }
        ];
    }
    
    // نیشاندانا مۆدێلا تایبەتمەندیێن پرێمیۆم
    showPremiumFeatures() {
        const lockedFeatures = this.getLockedFeatures();
        
        const modal = document.createElement('div');
        modal.id = 'premiumFeaturesModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content modal-lg">
                <span class="close" onclick="closeModal('premiumFeaturesModal')">&times;</span>
                <div class="premium-features-container">
                    <h2>💎 تایبەتمەندیێن پرێمیۆم</h2>
                    <p>پاکێجا خۆ بەرزکە بو دەستڕاگەهشتنێ ب هەمی تایبەتمەندیان!</p>
                    
                    <div class="locked-features-grid">
                        ${lockedFeatures.map(f => `
                            <div class="locked-feature-card">
                                <i class="${f.icon}"></i>
                                <h4>${f.name}</h4>
                                <p>${f.description}</p>
                                <span class="lock-icon">🔒</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="text-align:center; margin-top:2rem;">
                        <button class="btn btn-primary btn-lg" onclick="closeModal('premiumFeaturesModal'); document.getElementById('pricing').scrollIntoView({behavior:'smooth'})">
                            <i class="fas fa-crown"></i> پاکێجا پرێمیۆم بکڕە
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('premiumFeaturesModal').style.display = 'flex';
        
        // زێدەکرنا CSS
        if (!document.getElementById('premiumStyles')) {
            const style = document.createElement('style');
            style.id = 'premiumStyles';
            style.textContent = `
                .premium-features-container { padding: 1rem; text-align: center; }
                .locked-features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                .locked-feature-card {
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 12px;
                    position: relative;
                    border: 2px dashed #e2e8f0;
                }
                .locked-feature-card i { font-size: 2rem; color: #6366f1; margin-bottom: 0.5rem; }
                .locked-feature-card h4 { margin: 0.5rem 0; }
                .locked-feature-card p { color: #64748b; font-size: 0.9rem; }
                .lock-icon {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 1.5rem;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // پشکنین و نیشاندانا ئاگەهداریا پرێمیۆم
    checkAndShowPremiumPrompt(featureName) {
        if (!this.isFeatureAvailable(featureName)) {
            this.showPremiumFeatures();
            return false;
        }
        return true;
    }
}

const premiumManager = new PremiumManager();

// --- نویکرنا فەنکشنێن بکارئینانا تایبەتمەندیان ---

// ئەڤ فەنکشنە دشێن فەنکشنێن کەڤن بگوهێڕن بو پشکنینا پرێمیۆم

function openAIChat() {
    if (!auth.isLoggedIn()) {
        alert('🛑 بو بکارئینانا AI-یێ، دەبیت ئێکێ چوویە ژوور!');
        showLoginForm();
        return;
    }
    
    // پشکنینا پرێمیۆم
    const user = auth.getCurrentUser();
    if (!user.isPremium && aiChat.dailyQuestions >= aiChat.maxFreeQuestions) {
        premiumManager.showPremiumFeatures();
        return;
    }
    
    // دروستکرنا مۆدێلا چاتێ
    if (!document.getElementById('aiChatModal')) {
        createAIChatModal();
    }
    
    document.getElementById('aiChatModal').style.display = 'flex';
    updateChatUI();
}

function openSpeechPractice() {
    if (!auth.isLoggedIn()) {
        alert('🛑 بو پراکتیزەکرنا دەنگدانێ، دەبیت ئێکێ چوویە ژوور!');
        showLoginForm();
        return;
    }
    
    if (!premiumManager.checkAndShowPremiumPrompt('speech_recognition')) {
        return;
    }
    
    if (!document.getElementById('speechModal')) {
        createSpeechModal();
    }
    
    document.getElementById('speechModal').style.display = 'flex';
}

function openReport() {
    if (!auth.isLoggedIn()) {
        alert('🛑 بو دیتنا راپۆرتێ، دەبیت ئێکێ چوویە ژوور!');
        return;
    }
    
    if (!premiumManager.checkAndShowPremiumPrompt('detailed_reports')) {
        return;
    }
    
    const report = reportSystem.generatePersonalReport();
    reportSystem.displayReport(report);
}

console.log('💎 سیستەمێ پرێمیۆم ئامادەیە!');