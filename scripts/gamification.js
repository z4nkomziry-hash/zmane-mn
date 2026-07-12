// gamification.js - سیستەمێ پێشکەتی یێ ئاستان، خەلاتان و ئەنجامان

class GamificationSystem {
    constructor() {
        this.achievements = this.getAchievements();
        this.badges = this.getBadges();
    }
    
    // لیستا ئەنجامان (Achievements)
    getAchievements() {
        return [
            {
                id: 'first_login',
                name: '👋 ئێکەمین هەنگاڤ',
                description: 'ئێکەمین جار چوویە ژوور',
                icon: 'fas fa-door-open',
                xpReward: 100,
                check: (user) => user.lessonsCompleted >= 0
            },
            {
                id: 'first_lesson',
                name: '📚 فێرخواز',
                description: 'ئێکەمین وانە تەواوکر',
                icon: 'fas fa-book-open',
                xpReward: 250,
                check: (user) => user.lessonsCompleted >= 1
            },
            {
                id: 'ten_lessons',
                name: '🎯 بەردەوام',
                description: '١٠ وانە تەواوکرن',
                icon: 'fas fa-bullseye',
                xpReward: 500,
                check: (user) => user.lessonsCompleted >= 10
            },
            {
                id: 'fifty_words',
                name: '📖 ڤۆکابلەری',
                description: '٥٠ وشە فێربوون',
                icon: 'fas fa-font',
                xpReward: 300,
                check: (user) => user.wordsLearned >= 50
            },
            {
                id: 'seven_day_streak',
                name: '🔥 ئاگر',
                description: '٧ رۆژێن بەردەوام',
                icon: 'fas fa-fire',
                xpReward: 400,
                check: (user) => user.streak >= 7
            },
            {
                id: 'thirty_day_streak',
                name: '🌋 گڕکان',
                description: '٣٠ رۆژێن بەردەوام',
                icon: 'fas fa-fire-alt',
                xpReward: 1000,
                check: (user) => user.streak >= 30
            },
            {
                id: 'level_5',
                name: '⭐ ڕێزدار',
                description: 'گوهیشتنە ئاستا ٥',
                icon: 'fas fa-star',
                xpReward: 600,
                check: (user) => user.level >= 5
            },
            {
                id: 'level_10',
                name: '🌟 شارەزا',
                description: 'گوهیشتنە ئاستا ١٠',
                icon: 'fas fa-crown',
                xpReward: 1500,
                check: (user) => user.level >= 10
            },
            {
                id: 'ai_chat_10',
                name: '🤖 هەڤالێ AI',
                description: '١٠ پرسیار ژ AI-یێ کرن',
                icon: 'fas fa-robot',
                xpReward: 200,
                check: (user) => (user.aiQuestionsAsked || 0) >= 10
            },
            {
                id: 'speech_practice',
                name: '🎤 گۆتنەبێژ',
                description: 'پراکتیزەکرنا ئاخفتنێ ٥ جاران',
                icon: 'fas fa-microphone-alt',
                xpReward: 350,
                check: (user) => (user.speechPractices || 0) >= 5
            },
            {
                id: 'perfect_lesson',
                name: '💯 بێ کێماسی',
                description: 'وانەک ب ١٠٠% تەواوکر',
                icon: 'fas fa-check-double',
                xpReward: 800,
                check: (user) => (user.perfectLessons || 0) >= 1
            },
            {
                id: 'premium_member',
                name: '💎 پرێمیۆم',
                description: 'بوویە ئەندامێ پرێمیۆم',
                icon: 'fas fa-gem',
                xpReward: 2000,
                check: (user) => user.isPremium === true
            }
        ];
    }
    
    // لیستا پلێتان (Badges)
    getBadges() {
        return [
            { id: 'early_bird', name: '🐦 چوکێ سەحەر', description: 'فێربوون بەرێ سەعەت ٧-ێ سەحەر', icon: 'fas fa-earlybirds' },
            { id: 'night_owl', name: '🦉 کوندهێ شەڤێ', description: 'فێربوون پشتی سەعەت ١٠-ێ شەڤێ', icon: 'fas fa-moon' },
            { id: 'weekend_warrior', name: '⚔️ شەڕڤانێ دەمێ بێکاری', description: 'فێربوون د هەینی و شەمبیێدا', icon: 'fas fa-calendar-check' },
            { id: 'polyglot', name: '🌍 پۆلیگلۆت', description: 'فێربوونا ٣+ زمانان', icon: 'fas fa-globe-americas' },
            { id: 'social_butterfly', name: '🦋 پەپولە', description: 'پەیوەندیکرن دگەل ١٠ هەڤالێن فێربوونێ', icon: 'fas fa-users' }
        ];
    }
    
    // پشکنین و زێدەکرنا ئەنجامان
    checkAndAwardAchievements(user) {
        const earnedAchievements = [];
        
        this.achievements.forEach(achievement => {
            if (achievement.check(user)) {
                // پشکنین ئەگەر ژ بەری ڤە نەهاتیە وەرگرتن
                const userAchievements = user.achievements || [];
                if (!userAchievements.includes(achievement.id)) {
                    earnedAchievements.push(achievement);
                    
                    // زێدەکرنا XP-یێ خەلاتێ
                    user.xp += achievement.xpReward;
                    
                    // زێدەکرنا ئەنجامێ بو بکارهێنەری
                    if (!user.achievements) user.achievements = [];
                    user.achievements.push(achievement.id);
                }
            }
        });
        
        return earnedAchievements;
    }
    
    // نیشاندانا نۆتیفیکەیشنا ئەنجامی
    showAchievementNotification(achievement) {
        // دروستکرنا نۆتیفیکەیشنەکا تایبەت
        const notification = document.createElement('div');
        notification.className = 'achievement-toast';
        notification.innerHTML = `
            <div class="achievement-toast-content">
                <i class="${achievement.icon}"></i>
                <div>
                    <h4>🎉 ئەنجام هاتە ڤەکرن!</h4>
                    <p><strong>${achievement.name}</strong> - ${achievement.description}</p>
                    <span class="xp-reward">+${achievement.xpReward} XP</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // ئەنیمەیشن
        setTimeout(() => notification.classList.add('show'), 100);
        
        // ژێبرن پشتی ٥ چرکەیان
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
    
    // وەرگرتنا پلانکا ئەستێرەیان (Leaderboard)
    getLeaderboard() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 10)
            .map((user, index) => ({
                rank: index + 1,
                name: user.name,
                xp: user.xp,
                level: user.level,
                streak: user.streak
            }));
    }
    
    // وەرگرتنا ئاستێ بکارهێنەری و XP-یێ پێدڤی بو ئاستێ داهاتوو
    getLevelInfo(user) {
        const currentLevel = user.level || 1;
        const currentXP = user.xp || 0;
        const xpForCurrentLevel = (currentLevel - 1) * 1000;
        const xpForNextLevel = currentLevel * 1000;
        const xpNeeded = xpForNextLevel - currentXP;
        const progress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
        
        return {
            currentLevel,
            currentXP,
            xpForNextLevel,
            xpNeeded,
            progress: Math.min(100, Math.max(0, progress))
        };
    }
}

const gamification = new GamificationSystem();

// --- زێدەکرنا CSS-ێ بو نۆتیفیکەیشنا ئەنجامان ---
const achievementStyles = `
.achievement-toast {
    position: fixed;
    bottom: -100px;
    left: 20px;
    background: linear-gradient(135deg, #1e293b, #334155);
    color: white;
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    z-index: 9999;
    transition: bottom 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    min-width: 320px;
    border-right: 4px solid #fbbf24;
}

.achievement-toast.show {
    bottom: 20px;
}

.achievement-toast-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.achievement-toast-content i {
    font-size: 2.5rem;
    color: #fbbf24;
}

.achievement-toast-content h4 {
    margin-bottom: 0.25rem;
    color: #fbbf24;
}

.achievement-toast-content p {
    font-size: 0.9rem;
    color: #cbd5e1;
}

.xp-reward {
    display: inline-block;
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
    padding: 0.2rem 0.8rem;
    border-radius: var(--radius-full);
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: 0.25rem;
}

/* لیستا ئەستێرەیان */
.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
}

.leaderboard-table th {
    background: var(--primary);
    color: white;
    padding: 1rem;
    text-align: right;
}

.leaderboard-table td {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
}

.leaderboard-table tr:hover {
    background: var(--primary-bg);
}

.rank-badge {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: white;
}

.rank-1 { background: #fbbf24; }
.rank-2 { background: #94a3b8; }
.rank-3 { background: #cd7f32; }
`;

const achievementStyleElement = document.createElement('style');
achievementStyleElement.textContent = achievementStyles;
document.head.appendChild(achievementStyleElement);

console.log('🏆 سیستەمێ گەیمیفیکەیشنێ ئامادەیە!');