// profile.js - سیستەمێ پڕۆفایلێ

class ProfileSystem {
    constructor() {}
    
    // وەرگرتنا داتایێن پڕۆفایلێ
    getProfileData(userId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === userId);
        if (!user) return null;
        
        const levelInfo = typeof gamification !== 'undefined' ? 
            gamification.getLevelInfo(user) : null;
        
        const achievements = typeof gamification !== 'undefined' ?
            gamification.getAchievements().map(a => ({
                ...a,
                earned: (user.achievements || []).includes(a.id)
            })) : [];
        
        return {
            basic: {
                name: user.name,
                email: user.email,
                memberSince: user.createdAt,
                package: user.package || 'free',
                isPremium: user.isPremium || false,
                packageExpiry: user.packageExpiry || null
            },
            stats: {
                xp: user.xp || 0,
                level: user.level || 1,
                levelProgress: levelInfo ? levelInfo.progress : 0,
                xpToNextLevel: levelInfo ? levelInfo.xpNeeded : 1000,
                streak: user.streak || 0,
                wordsLearned: user.wordsLearned || 0,
                lessonsCompleted: user.lessonsCompleted || 0,
                perfectLessons: user.perfectLessons || 0,
                aiQuestionsAsked: user.aiQuestionsAsked || 0,
                speechPractices: user.speechPractices || 0
            },
            achievements: achievements,
            recentActivity: this.getRecentActivity(userId)
        };
    }
    
    // وەرگرتنا چالاکیێن دویماهیێ
    getRecentActivity(userId) {
        const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
        return activities
            .filter(a => a.userId === userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);
    }
    
    // تومارکرنا چالاکییەکێ
    logActivity(userId, type, description) {
        const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
        activities.push({
            id: 'act_' + Date.now(),
            userId: userId,
            type: type, // 'lesson', 'flashcard', 'ai_chat', 'speech', 'achievement', 'login'
            description: description,
            timestamp: new Date().toISOString()
        });
        
        // پاراستنا تەنێ ١٠٠ چالاکیێن دویماهیێ
        if (activities.length > 100) {
            activities.splice(0, activities.length - 100);
        }
        
        localStorage.setItem('userActivities', JSON.stringify(activities));
    }
    
    // نویکرنا پڕۆفایلێ
    updateProfile(userId, updates) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            // تەنێ ناڤ و ئیمێل دشێن بهێنە نویکرن
            if (updates.name) users[userIndex].name = updates.name;
            if (updates.email) users[userIndex].email = updates.email;
            
            localStorage.setItem('users', JSON.stringify(users));
            
            // نویکرنا سێشنا نەهاتی
            if (auth.currentUser && auth.currentUser.id === userId) {
                if (updates.name) auth.currentUser.name = updates.name;
                if (updates.email) auth.currentUser.email = updates.email;
                auth.saveCurrentUser();
            }
            
            return true;
        }
        
        return false;
    }
    
    // گوهۆڕینا وشهێ نهێنی
    changePassword(userId, oldPassword, newPassword) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId && u.password === btoa(oldPassword));
        
        if (userIndex !== -1) {
            users[userIndex].password = btoa(newPassword);
            localStorage.setItem('users', JSON.stringify(users));
            return true;
        }
        
        return false;
    }
    
    // ژێبرنا هەژمارێ
    deleteAccount(userId) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        
        // پاکژکرنا سێشنێ
        auth.logout();
        return true;
    }
}

const profileSystem = new ProfileSystem();

// --- فەنکشنێن UI بو پڕۆفایلێ ---

function openProfile() {
    if (!auth.isLoggedIn()) {
        alert('🛑 دەبیت ئێکێ چوویە ژوور!');
        return;
    }
    
    const userId = auth.getCurrentUser().id;
    const profileData = profileSystem.getProfileData(userId);
    
    if (!profileData) return;
    
    // دروستکرنا مۆدێلا پڕۆفایلێ
    const modal = document.createElement('div');
    modal.id = 'profileModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content modal-lg" style="max-width: 800px;">
            <span class="close" onclick="closeModal('profileModal')">&times;</span>
            
            <div class="profile-container">
                <!-- سەرپەڕێ پڕۆفایلێ -->
                <div class="profile-header">
                    <div class="profile-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="profile-info">
                        <h2>${profileData.basic.name}</h2>
                        <p>${profileData.basic.email}</p>
                        <span class="profile-package ${profileData.basic.isPremium ? 'premium' : 'free'}">
                            ${profileData.basic.isPremium ? '💎 پرێمیۆم' : '🆓 بێ پارە'}
                        </span>
                        <p class="member-since">ئەندام ژ: ${new Date(profileData.basic.memberSince).toLocaleDateString('ckb')}</p>
                    </div>
                    <button class="btn btn-outline" onclick="editProfile()">
                        <i class="fas fa-edit"></i> نویکرن
                    </button>
                </div>
                
                <!-- ستاتیک -->
                <div class="profile-stats">
                    <div class="profile-stat-item">
                        <i class="fas fa-star text-yellow"></i>
                        <span>${profileData.stats.xp} XP</span>
                    </div>
                    <div class="profile-stat-item">
                        <i class="fas fa-trophy text-purple"></i>
                        <span>ئاستا ${profileData.stats.level}</span>
                    </div>
                    <div class="profile-stat-item">
                        <i class="fas fa-fire text-red"></i>
                        <span>${profileData.stats.streak} رۆژ</span>
                    </div>
                    <div class="profile-stat-item">
                        <i class="fas fa-book text-blue"></i>
                        <span>${profileData.stats.lessonsCompleted} وانە</span>
                    </div>
                    <div class="profile-stat-item">
                        <i class="fas fa-font text-green"></i>
                        <span>${profileData.stats.wordsLearned} وشە</span>
                    </div>
                </div>
                
                <!-- پێشکەفتنا ئاستی -->
                <div class="profile-level-progress">
                    <div class="level-bar-header">
                        <span>ئاستا ${profileData.stats.level}</span>
                        <span>${profileData.stats.xpToNextLevel} XP بو ئاستێ داهاتوو</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-fill" style="width: ${profileData.stats.progress}%"></div>
                    </div>
                </div>
                
                <!-- ئەنجام -->
                <div class="profile-achievements">
                    <h3>🏆 ئەنجام (${profileData.achievements.filter(a => a.earned).length}/${profileData.achievements.length})</h3>
                    <div class="achievements-mini-grid">
                        ${profileData.achievements.slice(0, 6).map(a => `
                            <div class="achievement-mini ${a.earned ? 'earned' : 'locked'}">
                                <i class="${a.icon}"></i>
                                <span>${a.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- چالاکیێن دویماهیێ -->
                <div class="profile-activity">
                    <h3>📋 چالاکیێن دویماهیێ</h3>
                    ${profileData.recentActivity.length > 0 ? 
                        profileData.recentActivity.map(a => `
                            <div class="activity-item">
                                <i class="fas ${getActivityIcon(a.type)}"></i>
                                <div>
                                    <p>${a.description}</p>
                                    <small>${formatTimeAgo(a.timestamp)}</small>
                                </div>
                            </div>
                        `).join('') :
                        '<p class="empty-state">هنژی چ چالاکی نەهاتیە تومارکرن</p>'
                    }
                </div>
                
                <!-- دوگمێن کرداران -->
                <div class="profile-actions">
                    <button class="btn btn-outline" onclick="editProfile()">
                        <i class="fas fa-edit"></i> نویکرنا پڕۆفایلێ
                    </button>
                    <button class="btn btn-outline" onclick="changePassword()">
                        <i class="fas fa-lock"></i> گوهۆڕینا وشهێ نهێنی
                    </button>
                    <button class="btn btn-danger" onclick="confirmDeleteAccount()">
                        <i class="fas fa-trash"></i> ژێبرنا هەژمارێ
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('profileModal').style.display = 'flex';
    
    // زێدەکرنا CSS-ێ ئەگەر نەبیت
    if (!document.getElementById('profileStyles')) {
        addProfileStyles();
    }
}

function addProfileStyles() {
    const style = document.createElement('style');
    style.id = 'profileStyles';
    style.textContent = `
        .profile-container { padding: 1rem; }
        
        .profile-header {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            padding: 1.5rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 12px;
            color: white;
            margin-bottom: 1.5rem;
        }
        
        .profile-avatar i {
            font-size: 5rem;
        }
        
        .profile-info h2 { margin: 0; }
        .profile-info p { opacity: 0.9; margin: 0.25rem 0; }
        
        .profile-package {
            display: inline-block;
            padding: 0.3rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        .profile-package.premium {
            background: #fbbf24;
            color: #000;
        }
        
        .profile-package.free {
            background: rgba(255,255,255,0.2);
        }
        
        .member-since {
            font-size: 0.85rem;
            opacity: 0.7;
            margin-top: 0.25rem;
        }
        
        .profile-stats {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }
        
        .profile-stat-item {
            background: #f1f5f9;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .profile-level-progress {
            margin-bottom: 1.5rem;
        }
        
        .level-bar-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        
        .progress-bar-container {
            background: #e2e8f0;
            height: 12px;
            border-radius: 6px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #6366f1, #10b981);
            border-radius: 6px;
            transition: width 0.5s ease;
        }
        
        .achievements-mini-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 0.5rem;
        }
        
        .achievement-mini {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            border-radius: 8px;
            font-size: 0.85rem;
        }
        
        .achievement-mini.earned {
            background: #ecfdf5;
            color: #059669;
        }
        
        .achievement-mini.locked {
            background: #f1f5f9;
            color: #94a3b8;
            opacity: 0.6;
        }
        
        .activity-item {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 0.75rem;
            border-bottom: 1px solid #f1f5f9;
        }
        
        .activity-item i {
            color: #6366f1;
            margin-top: 0.2rem;
        }
        
        .profile-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1.5rem;
            flex-wrap: wrap;
        }
    `;
    document.head.appendChild(style);
}

function getActivityIcon(type) {
    const icons = {
        'lesson': 'fa-book-open',
        'flashcard': 'fa-clone',
        'ai_chat': 'fa-robot',
        'speech': 'fa-microphone',
        'achievement': 'fa-trophy',
        'login': 'fa-sign-in-alt'
    };
    return icons[type] || 'fa-circle';
}

function editProfile() {
    const user = auth.getCurrentUser();
    if (!user) return;
    
    const newName = prompt('ناڤێ نوی:', user.name);
    if (newName && newName.trim()) {
        profileSystem.updateProfile(user.id, { name: newName.trim() });
        alert('✅ پڕۆفایل هاتە نویکرن!');
        updateUIForLoggedIn();
        closeModal('profileModal');
    }
}

function changePassword() {
    const oldPass = prompt('وشهێ نهێنی یێ کەڤن:');
    if (!oldPass) return;
    
    const newPass = prompt('وشهێ نهێنی یێ نوی (کێمتر ٨ پیت):');
    if (!newPass || newPass.length < 8) {
        alert('⚠️ وشهێ نهێنی دەبیت کێمتر ٨ پیت بیت!');
        return;
    }
    
    const success = profileSystem.changePassword(auth.getCurrentUser().id, oldPass, newPass);
    if (success) {
        alert('✅ وشهێ نهێنی هاتە گوهۆڕین!');
    } else {
        alert('❌ وشهێ نهێنی یێ کەڤن نادروستە!');
    }
}

function confirmDeleteAccount() {
    if (confirm('⚠️ ئەرێ تە یێ ئێکینە کو دڤێت هەژمارا خۆ ژێبەی؟\n\nئەڤ کردارە نایێتە ڤەگێڕان!')) {
        if (confirm('دووبارە پشتڕاست بکە: ئەرێ تە دڤێت هەژمارا خۆ ژێبەی؟')) {
            profileSystem.deleteAccount(auth.getCurrentUser().id);
            alert('هەژمارا تە هاتە ژێبرن. ب خاتر بیت! 👋');
            window.location.reload();
        }
    }
}

console.log('👤 سیستەمێ پڕۆفایلێ ئامادەیە!');