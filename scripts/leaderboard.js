// leaderboard.js - سیستەمێ لیدەربۆرد و رێزگرتنێ

class LeaderboardSystem {
    constructor() {
        this.leaderboardTypes = ['xp', 'streak', 'words', 'lessons'];
    }
    
    // وەرگرتنا لیدەربۆردێ
    getLeaderboard(type = 'xp', limit = 20) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        let sortedUsers = [];
        
        switch(type) {
            case 'xp':
                sortedUsers = users.sort((a, b) => (b.xp || 0) - (a.xp || 0));
                break;
            case 'streak':
                sortedUsers = users.sort((a, b) => (b.streak || 0) - (a.streak || 0));
                break;
            case 'words':
                sortedUsers = users.sort((a, b) => (b.wordsLearned || 0) - (a.wordsLearned || 0));
                break;
            case 'lessons':
                sortedUsers = users.sort((a, b) => (b.lessonsCompleted || 0) - (a.lessonsCompleted || 0));
                break;
            default:
                sortedUsers = users.sort((a, b) => (b.xp || 0) - (a.xp || 0));
        }
        
        return sortedUsers.slice(0, limit).map((user, index) => ({
            rank: index + 1,
            name: user.name || 'نەناسراو',
            xp: user.xp || 0,
            level: user.level || 1,
            streak: user.streak || 0,
            wordsLearned: user.wordsLearned || 0,
            lessonsCompleted: user.lessonsCompleted || 0,
            isCurrentUser: auth.isLoggedIn() && user.id === auth.getCurrentUser().id
        }));
    }
    
    // وەرگرتنا رێزگرتنا بکارهێنەری
    getUserRank(type = 'xp') {
        if (!auth.isLoggedIn()) return null;
        
        const leaderboard = this.getLeaderboard(type, 999);
        const userRank = leaderboard.find(u => u.isCurrentUser);
        
        return userRank ? userRank.rank : null;
    }
    
    // نیشاندانا لیدەربۆردێ
    displayLeaderboard() {
        const leaderboard = this.getLeaderboard('xp');
        const userRank = this.getUserRank('xp');
        
        const modal = document.createElement('div');
        modal.id = 'leaderboardModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content modal-lg" style="max-width: 700px;">
                <span class="close" onclick="closeModal('leaderboardModal')">&times;</span>
                
                <div class="leaderboard-container">
                    <h2>🏆 لیستا رێزگرتنێ</h2>
                    
                    <!-- تاب -->
                    <div class="leaderboard-tabs">
                        ${this.leaderboardTypes.map(type => `
                            <button class="leaderboard-tab ${type === 'xp' ? 'active' : ''}" 
                                    onclick="switchLeaderboard('${type}')">
                                ${this.getTypeName(type)}
                            </button>
                        `).join('')}
                    </div>
                    
                    <!-- رێزگرتنا بکارهێنەری -->
                    ${userRank ? `
                        <div class="user-rank-card">
                            <span>رێزگرتنا تە: <strong>#${userRank}</strong></span>
                        </div>
                    ` : ''}
                    
                    <!-- لیستا لیدەربۆردێ -->
                    <div class="leaderboard-list" id="leaderboardList">
                        ${this.renderLeaderboardRows(leaderboard)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('leaderboardModal').style.display = 'flex';
        
        this.addLeaderboardStyles();
    }
    
    renderLeaderboardRows(leaderboard) {
        return leaderboard.map(user => `
            <div class="leaderboard-row ${user.isCurrentUser ? 'current-user' : ''}">
                <div class="rank-col">
                    <span class="rank-badge rank-${user.rank <= 3 ? user.rank : 'other'}">
                        ${user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : user.rank}
                    </span>
                </div>
                <div class="user-col">
                    <strong>${user.name}</strong>
                    ${user.isCurrentUser ? '<span class="you-badge">تە</span>' : ''}
                </div>
                <div class="stats-col">
                    <span>⭐ ${user.xp} XP</span>
                    <span>📚 ئاستا ${user.level}</span>
                </div>
                <div class="extra-col">
                    <span>🔥 ${user.streak} رۆژ</span>
                    <span>📖 ${user.wordsLearned} وشە</span>
                </div>
            </div>
        `).join('');
    }
    
    getTypeName(type) {
        const names = {
            'xp': '⭐ XP',
            'streak': '🔥 رۆژ',
            'words': '📖 وشە',
            'lessons': '📚 وانە'
        };
        return names[type] || type;
    }
    
    addLeaderboardStyles() {
        if (document.getElementById('leaderboardStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'leaderboardStyles';
        style.textContent = `
            .leaderboard-container { padding: 1rem; }
            
            .leaderboard-tabs {
                display: flex;
                gap: 0.5rem;
                margin: 1rem 0;
                flex-wrap: wrap;
            }
            
            .leaderboard-tab {
                padding: 0.5rem 1.5rem;
                border: 2px solid #e2e8f0;
                background: white;
                border-radius: 20px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }
            
            .leaderboard-tab.active {
                background: #6366f1;
                color: white;
                border-color: #6366f1;
            }
            
            .user-rank-card {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 1rem;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            .leaderboard-list {
                max-height: 500px;
                overflow-y: auto;
            }
            
            .leaderboard-row {
                display: flex;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid #f1f5f9;
                gap: 1rem;
                transition: all 0.2s;
            }
            
            .leaderboard-row:hover {
                background: #f8fafc;
            }
            
            .leaderboard-row.current-user {
                background: #eef2ff;
                border-right: 4px solid #6366f1;
            }
            
            .rank-col {
                width: 50px;
                text-align: center;
            }
            
            .rank-badge {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 1.2rem;
            }
            
            .rank-1 { background: #fef3c7; color: #92400e; }
            .rank-2 { background: #e2e8f0; color: #475569; }
            .rank-3 { background: #fed7aa; color: #9a3412; }
            .rank-other { background: #f1f5f9; color: #64748b; }
            
            .user-col {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .you-badge {
                background: #6366f1;
                color: white;
                padding: 0.1rem 0.5rem;
                border-radius: 10px;
                font-size: 0.75rem;
            }
            
            .stats-col {
                display: flex;
                gap: 0.5rem;
                font-size: 0.9rem;
                color: #64748b;
            }
            
            .extra-col {
                display: flex;
                gap: 0.5rem;
                font-size: 0.85rem;
                color: #94a3b8;
            }
            
            @media (max-width: 600px) {
                .stats-col, .extra-col {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

const leaderboardSystem = new LeaderboardSystem();

// فەنکشنا گوهۆڕینا لیدەربۆردێ
function switchLeaderboard(type) {
    // نویکرنا تابان
    document.querySelectorAll('.leaderboard-tab').forEach(tab => {
        tab.classList.toggle('active', tab.textContent.trim().includes(leaderboardSystem.getTypeName(type)));
    });
    
    // نویکرنا لیستێ
    const leaderboard = leaderboardSystem.getLeaderboard(type);
    document.getElementById('leaderboardList').innerHTML = leaderboardSystem.renderLeaderboardRows(leaderboard);
}

// فەنکشنا ڤەکرنا لیدەربۆردێ
function openLeaderboard() {
    if (!auth.isLoggedIn()) {
        alert('🛑 بو دیتنا لیدەربۆردێ، دەبیت ئێکێ چوویە ژوور!');
        return;
    }
    
    leaderboardSystem.displayLeaderboard();
}

console.log('🏆 سیستەمێ لیدەربۆردێ ئامادەیە!');