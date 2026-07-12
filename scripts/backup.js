// backup.js - سیستەمێ بەکئەپ و پاراستنا داتایان

class BackupSystem {
    constructor() {
        this.backupKey = 'platform_backups';
    }
    
    // دروستکرنا بەکئەپەکی
    createBackup(name) {
        const data = {
            name: name || 'Backup ' + new Date().toLocaleString('ckb'),
            timestamp: new Date().toISOString(),
            version: '2.0',
            data: {
                users: JSON.parse(localStorage.getItem('users') || '[]'),
                licenses: JSON.parse(localStorage.getItem('licenses') || '[]'),
                payments: JSON.parse(localStorage.getItem('payments') || '[]'),
                adminLicenses: JSON.parse(localStorage.getItem('adminLicenses') || '[]'),
                flashcardDecks: JSON.parse(localStorage.getItem('flashcardDecks') || '[]'),
                userNotifications: JSON.parse(localStorage.getItem('userNotifications') || '[]'),
                userActivities: JSON.parse(localStorage.getItem('userActivities') || '[]'),
                courses: COURSES || [],
                config: PLATFORM_CONFIG || {}
            }
        };
        
        // پاراستنا بەکئەپێ
        const backups = this.getAllBackups();
        backups.push(data);
        
        // پاراستنا تەنێ ١٠ بەکئەپێن دویماهیێ
        if (backups.length > 10) {
            backups.splice(0, backups.length - 10);
        }
        
        localStorage.setItem(this.backupKey, JSON.stringify(backups));
        
        return data;
    }
    
    // وەرگرتنا هەمی بەکئەپان
    getAllBackups() {
        return JSON.parse(localStorage.getItem(this.backupKey) || '[]');
    }
    
    // ڤەگێڕان ژ بەکئەپەکی
    restoreBackup(backupIndex) {
        const backups = this.getAllBackups();
        if (backupIndex < 0 || backupIndex >= backups.length) {
            return { success: false, message: '❌ بەکئەپ نەهاتیە دیتن!' };
        }
        
        const backup = backups[backupIndex];
        
        if (!confirm(`⚠️ ئەرێ تە یێ ئێکینە کو دڤێت بەکئەپێ "${backup.name}" ڤەگێڕی؟\n\nئەڤە دێ هەمی داتایێن نەهاتی بگوهێڕیت!`)) {
            return { success: false, message: '❌ ڤەگێڕان هاتە راوەستاندن.' };
        }
        
        // ڤەگێڕانا داتایان
        if (backup.data.users) localStorage.setItem('users', JSON.stringify(backup.data.users));
        if (backup.data.licenses) localStorage.setItem('licenses', JSON.stringify(backup.data.licenses));
        if (backup.data.payments) localStorage.setItem('payments', JSON.stringify(backup.data.payments));
        if (backup.data.adminLicenses) localStorage.setItem('adminLicenses', JSON.stringify(backup.data.adminLicenses));
        if (backup.data.flashcardDecks) localStorage.setItem('flashcardDecks', JSON.stringify(backup.data.flashcardDecks));
        if (backup.data.userNotifications) localStorage.setItem('userNotifications', JSON.stringify(backup.data.userNotifications));
        if (backup.data.userActivities) localStorage.setItem('userActivities', JSON.stringify(backup.data.userActivities));
        
        return { success: true, message: '✅ بەکئەپ ب سەرکەفتیانە هاتە ڤەگێڕان! پەڕێ دێ نوی بیت...' };
    }
    
    // ژێبرنا بەکئەپەکی
    deleteBackup(index) {
        const backups = this.getAllBackups();
        if (index >= 0 && index < backups.length) {
            backups.splice(index, 1);
            localStorage.setItem(this.backupKey, JSON.stringify(backups));
            return true;
        }
        return false;
    }
    
    // داونلۆدکرنا بەکئەپێ وەک فایلا JSON
    downloadBackup(index) {
        const backups = this.getAllBackups();
        if (index < 0 || index >= backups.length) return;
        
        const backup = backups[index];
        const dataStr = JSON.stringify(backup, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `zimanemin_backup_${new Date(backup.timestamp).toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    // ئیمپۆرتکرنا بەکئەپەکی ژ فایلێ
    importBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);
                    
                    // پشکنینا ڤالیدبوونێ
                    if (!backup.version || !backup.data) {
                        reject('فایلا بەکئەپێ یا نادروستە!');
                        return;
                    }
                    
                    const backups = this.getAllBackups();
                    backup.name = 'Imported: ' + (backup.name || 'Unknown');
                    backup.timestamp = new Date().toISOString();
                    backups.push(backup);
                    localStorage.setItem(this.backupKey, JSON.stringify(backups));
                    
                    resolve('✅ بەکئەپ هاتە ئیمپۆرتکرن!');
                } catch (error) {
                    reject('❌ فایلا JSON-ێ یا نادروستە!');
                }
            };
            reader.onerror = () => reject('❌ فایل نەهاتیە خوێندن!');
            reader.readAsText(file);
        });
    }
}

const backupSystem = new BackupSystem();

// --- بەکئەپی ئۆتۆماتیک هەر ٢٤ ساعەت جارەکێ ---
function autoBackup() {
    const lastBackup = localStorage.getItem('lastAutoBackup');
    const now = new Date().getTime();
    
    if (!lastBackup || (now - parseInt(lastBackup)) > 24 * 60 * 60 * 1000) {
        backupSystem.createBackup('Auto Backup');
        localStorage.setItem('lastAutoBackup', now.toString());
        console.log('💾 بەکئەپی ئۆتۆماتیک هاتە دروستکرن');
    }
}

// دەستپێکرنا بەکئەپی ئۆتۆماتیک
setTimeout(autoBackup, 5000);

// --- پانێلا ئادمین یا بەکئەپان ---
function openBackupPanel() {
    const backups = backupSystem.getAllBackups();
    
    const modal = document.createElement('div');
    modal.id = 'backupModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content modal-lg">
            <span class="close" onclick="closeModal('backupModal')">&times;</span>
            <div style="padding:1rem;">
                <h2>💾 بەرێوەبرنا بەکئەپان</h2>
                
                <div style="margin:1rem 0; display:flex; gap:0.5rem; flex-wrap:wrap;">
                    <button class="btn btn-primary" onclick="createManualBackup()">
                        <i class="fas fa-save"></i> بەکئەپەکی نوی دروست بکە
                    </button>
                    <label class="btn btn-outline" style="cursor:pointer;">
                        <i class="fas fa-upload"></i> بەکئەپی ئیمپۆرت بکە
                        <input type="file" accept=".json" onchange="importBackupFile(this)" style="display:none;">
                    </label>
                </div>
                
                <div class="backups-list">
                    ${backups.length === 0 ? 
                        '<p class="empty-state">چ بەکئەپ نەهاتیە دروستکرن</p>' :
                        backups.map((b, i) => `
                            <div class="backup-item">
                                <div>
                                    <strong>${b.name}</strong>
                                    <p>${new Date(b.timestamp).toLocaleString('ckb')} | ڤێرژن: ${b.version}</p>
                                </div>
                                <div class="backup-actions">
                                    <button class="btn btn-sm btn-outline" onclick="restoreBackup(${i})">ڤەگێڕە</button>
                                    <button class="btn btn-sm btn-outline" onclick="downloadBackup(${i})">داونلۆد</button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteBackup(${i})">ژێبە</button>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('backupModal').style.display = 'flex';
    
    // CSS
    if (!document.getElementById('backupStyles')) {
        const style = document.createElement('style');
        style.id = 'backupStyles';
        style.textContent = `
            .backups-list { max-height: 400px; overflow-y: auto; }
            .backup-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid #e2e8f0;
            }
            .backup-item p { color: #64748b; font-size: 0.85rem; margin: 0.25rem 0 0 0; }
            .backup-actions { display: flex; gap: 0.25rem; }
        `;
        document.head.appendChild(style);
    }
}

function createManualBackup() {
    backupSystem.createBackup('Manual Backup ' + new Date().toLocaleString('ckb'));
    alert('✅ بەکئەپ هاتە دروستکرن!');
    closeModal('backupModal');
    openBackupPanel();
}

function restoreBackup(index) {
    const result = backupSystem.restoreBackup(index);
    alert(result.message);
    if (result.success) {
        closeModal('backupModal');
        window.location.reload();
    }
}

function downloadBackup(index) {
    backupSystem.downloadBackup(index);
}

function deleteBackup(index) {
    if (confirm('ئەرێ تە دڤێت ڤی بەکئەپی ژێبەی؟')) {
        backupSystem.deleteBackup(index);
        closeModal('backupModal');
        openBackupPanel();
    }
}

function importBackupFile(input) {
    if (input.files[0]) {
        backupSystem.importBackup(input.files[0])
            .then(message => {
                alert(message);
                closeModal('backupModal');
                openBackupPanel();
            })
            .catch(error => alert(error));
    }
}

console.log('💾 سیستەمێ بەکئەپان ئامادەیە!');