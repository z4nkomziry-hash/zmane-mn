// export.js - سیستەمێ ئێکسپۆرتکرنا داتایان

class ExportSystem {
    constructor() {}
    
    // ئێکسپۆرتکرنا داتایێن بکارهێنەری
    exportUserData(userId) {
        const user = JSON.parse(localStorage.getItem('users') || '[]').find(u => u.id === userId);
        if (!user) return null;
        
        // پاکژکرنا داتایێن هەستیار
        const exportData = {
            exportDate: new Date().toISOString(),
            platform: 'Zimanê Min',
            user: {
                name: user.name,
                email: user.email,
                memberSince: user.createdAt,
                package: user.package,
                stats: {
                    xp: user.xp || 0,
                    level: user.level || 1,
                    streak: user.streak || 0,
                    wordsLearned: user.wordsLearned || 0,
                    lessonsCompleted: user.lessonsCompleted || 0,
                    perfectLessons: user.perfectLessons || 0
                },
                achievements: user.achievements || []
            }
        };
        
        return exportData;
    }
    
    // داونلۆدکرنا داتایان وەک JSON
    downloadAsJSON(data, filename) {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    // داونلۆدکرنا داتایان وەک CSV
    downloadAsCSV(data, filename) {
        let csv = '';
        
        // هێدەر
        csv += 'ناڤ,ئیمێل,XP,ئاست,رۆژێن بەردەوام,وشێن فێربوویی,وانێن تەواوکری\n';
        
        // داتا
        if (Array.isArray(data)) {
            data.forEach(user => {
                csv += `"${user.name}","${user.email}",${user.xp},${user.level},${user.streak},${user.wordsLearned},${user.lessonsCompleted}\n`;
            });
        }
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    // ئێکسپۆرتکرنا داتایێن هەمی بکارهێنەران (بو ئادمین)
    exportAllUsers() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        const exportData = users.map(user => ({
            name: user.name,
            email: user.email,
            xp: user.xp || 0,
            level: user.level || 1,
            streak: user.streak || 0,
            wordsLearned: user.wordsLearned || 0,
            lessonsCompleted: user.lessonsCompleted || 0,
            package: user.package || 'free',
            isPremium: user.isPremium || false,
            createdAt: user.createdAt
        }));
        
        return exportData;
    }
    
    // ئێکسپۆرتکرنا داتایێن پارەدانان (بو ئادمین)
    exportPayments() {
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        
        return payments.map(p => ({
            id: p.id,
            user: p.userName,
            email: p.userEmail,
            package: p.package,
            method: p.method,
            amount: p.amount,
            status: p.status,
            timestamp: p.timestamp
        }));
    }
    
    // نیشاندانا پانێلا ئێکسپۆرتێ
    showExportPanel() {
        const modal = document.createElement('div');
        modal.id = 'exportModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeModal('exportModal')">&times;</span>
                
                <div style="padding:1rem; text-align:center;">
                    <h2>📥 ئێکسپۆرتکرنا داتایان</h2>
                    
                    <div style="display:grid; gap:1rem; margin:1.5rem 0;">
                        <button class="btn btn-primary btn-block" onclick="exportMyData()">
                            <i class="fas fa-download"></i> داتایێن من (JSON)
                        </button>
                        
                        <button class="btn btn-outline btn-block" onclick="exportAllUsersCSV()">
                            <i class="fas fa-table"></i> هەمی بکارهێنەر (CSV)
                        </button>
                        
                        <button class="btn btn-outline btn-block" onclick="exportPaymentsCSV()">
                            <i class="fas fa-file-invoice"></i> پارەدان (CSV)
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('exportModal').style.display = 'flex';
    }
}

const exportSystem = new ExportSystem();

// فەنکشنێن ئێکسپۆرتێ
function exportMyData() {
    if (!auth.isLoggedIn()) {
        alert('🛑 دەبیت ئێکێ چوویە ژوور!');
        return;
    }
    
    const data = exportSystem.exportUserData(auth.getCurrentUser().id);
    if (data) {
        exportSystem.downloadAsJSON(data, `zimanemin_data_${new Date().toISOString().split('T')[0]}.json`);
        alert('✅ داتایێن تە هاتنە داونلۆدکرن!');
    }
}

function exportAllUsersCSV() {
    const data = exportSystem.exportAllUsers();
    exportSystem.downloadAsCSV(data, `zimanemin_users_${new Date().toISOString().split('T')[0]}.csv`);
    alert('✅ داتایێن بکارهێنەران هاتنە داونلۆدکرن!');
}

function exportPaymentsCSV() {
    const data = exportSystem.exportPayments();
    const csvData = data.map(p => ({
        name: p.user,
        email: p.email,
        xp: p.package,
        level: p.method,
        streak: p.status,
        wordsLearned: p.amount,
        lessonsCompleted: p.timestamp
    }));
    exportSystem.downloadAsCSV(csvData, `zimanemin_payments_${new Date().toISOString().split('T')[0]}.csv`);
    alert('✅ داتایێن پارەدانان هاتنە داونلۆدکرن!');
}

console.log('📥 سیستەمێ ئێکسپۆرتێ ئامادەیە!');
