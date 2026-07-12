// reports.js - سیستەمێ راپۆرتان و پێشکەفتنێ

class ReportSystem {
    constructor() {}
    
    // دروستکرنا راپۆرتا کەسایەتی
    generatePersonalReport(user) {
        if (!user) user = auth.getCurrentUser();
        if (!user) return null;
        
        const levelInfo = gamification.getLevelInfo(user);
        const achievements = user.achievements || [];
        const totalAchievements = gamification.getAchievements().length;
        
        return {
            user: {
                name: user.name,
                email: user.email,
                memberSince: new Date(user.createdAt).toLocaleDateString('ckb'),
                package: user.package || 'free',
                isPremium: user.isPremium || false
            },
            stats: {
                xp: user.xp || 0,
                level: user.level || 1,
                levelProgress: levelInfo.progress,
                xpToNextLevel: levelInfo.xpNeeded,
                streak: user.streak || 0,
                wordsLearned: user.wordsLearned || 0,
                lessonsCompleted: user.lessonsCompleted || 0,
                perfectLessons: user.perfectLessons || 0
            },
            achievements: {
                earned: achievements.length,
                total: totalAchievements,
                percentage: Math.round((achievements.length / totalAchievements) * 100),
                list: gamification.getAchievements().map(a => ({
                    ...a,
                    earned: achievements.includes(a.id)
                }))
            },
            aiStats: {
                questionsAsked: user.aiQuestionsAsked || 0,
                speechPractices: user.speechPractices || 0
            }
        };
    }
    
    // نیشاندانا راپۆرتێ
    displayReport(report) {
        const modal = document.createElement('div');
        modal.id = 'reportModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content modal-lg" style="max-width: 800px;">
                <span class="close" onclick="closeModal('reportModal')">&times;</span>
                <div class="report-container">
                    <h2 style="text-align:center; margin-bottom: 2rem;">📊 راپۆرتا پێشکەفتنێ</h2>
                    
                    <!-- زانیاریێن بکارهێنەری -->
                    <div class="report-section">
                        <h3>👤 زانیاریێن بکارهێنەری</h3>
                        <div class="report-info-grid">
                            <div><strong>ناڤ:</strong> ${report.user.name}</div>
                            <div><strong>پاکێج:</strong> ${report.user.package} ${report.user.isPremium ? '💎' : '🆓'}</div>
                            <div><strong>دەمێ تۆمارکرنێ:</strong> ${report.user.memberSince}</div>
                        </div>
                    </div>
                    
                    <!-- ستاتیک -->
                    <div class="report-section">
                        <h3>📈 ستاتیک</h3>
                        <div class="report-stats-grid">
                            <div class="report-stat">
                                <h4>⭐ ئاست</h4>
                                <div class="big-number">${report.stats.level}</div>
                                <div class="progress-bar" style="margin-top:0.5rem;">
                                    <div style="width:${report.stats.levelProgress}%; background:var(--primary); 
                                         height:8px; border-radius:4px;"></div>
                                </div>
                                <small>${report.stats.xpToNextLevel} XP بو ئاستێ داهاتوو</small>
                            </div>
                            <div class="report-stat">
                                <h4>🔥 رۆژێن بەردەوام</h4>
                                <div class="big-number">${report.stats.streak}</div>
                            </div>
                            <div class="report-stat">
                                <h4>📚 وانە</h4>
                                <div class="big-number">${report.stats.lessonsCompleted}</div>
                                <small>${report.stats.perfectLessons} بێ کێماسی</small>
                            </div>
                            <div class="report-stat">
                                <h4>📖 وشە</h4>
                                <div class="big-number">${report.stats.wordsLearned}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ئەنجام -->
                    <div class="report-section">
                        <h3>🏆 ئەنجام (${report.achievements.earned}/${report.achievements.total})</h3>
                        <div class="achievements-grid">
                            ${report.achievements.list.map(a => `
                                <div class="achievement-item ${a.earned ? 'earned' : 'locked'}">
                                    <i class="${a.icon}"></i>
                                    <div>
                                        <strong>${a.name}</strong>
                                        <p>${a.description}</p>
                                        ${a.earned ? '<span class="badge-earned">✅ هاتیە وەرگرتن</span>' : 
                                         '<span class="badge-locked">🔒</span>'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <button class="btn btn-primary btn-block" onclick="closeModal('reportModal')">داخستن</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('reportModal').style.display = 'flex';
        
        // زێدەکرنا CSS-ێ بو راپۆرتان
        if (!document.getElementById('reportStyles')) {
            const style = document.createElement('style');
            style.id = 'reportStyles';
            style.textContent = `
                .report-container { padding: 1rem; }
                .report-section { 
                    background: var(--gray-bg); 
                    padding: 1.5rem; 
                    border-radius: var(--radius); 
                    margin-bottom: 1.5rem; 
                }
                .report-section h3 { margin-bottom: 1rem; color: var(--primary); }
                .report-info-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                    gap: 1rem; 
                }
                .report-stats-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
                    gap: 1rem; 
                    text-align: center; 
                }
                .report-stat { 
                    background: var(--white); 
                    padding: 1.5rem; 
                    border-radius: var(--radius); 
                }
                .big-number { 
                    font-size: 2.5rem; 
                    font-weight: 800; 
                    color: var(--primary); 
                }
                .achievements-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                    gap: 1rem; 
                }
                .achievement-item { 
                    display: flex; 
                    align-items: center; 
                    gap: 1rem; 
                    padding: 1rem; 
                    background: var(--white); 
                    border-radius: var(--radius); 
                }
                .achievement-item i { font-size: 2rem; }
                .achievement-item.locked { opacity: 0.5; }
                .badge-earned { 
                    background: var(--secondary-bg); 
                    color: var(--secondary-dark); 
                    padding: 0.2rem 0.6rem; 
                    border-radius: var(--radius-full); 
                    font-size: 0.8rem; 
                }
                .badge-locked { color: var(--gray-light); font-size: 1.5rem; }
            `;
            document.head.appendChild(style);
        }
    }
}

const reportSystem = new ReportSystem();

// فەنکشنا ڤەکرنا راپۆرتێ
function openReport() {
    if (!auth.isLoggedIn()) {
        alert('🛑 بو دیتنا راپۆرتێ، دەبیت ئێکێ چوویە ژوور!');
        return;
    }
    
    const report = reportSystem.generatePersonalReport();
    reportSystem.displayReport(report);
}