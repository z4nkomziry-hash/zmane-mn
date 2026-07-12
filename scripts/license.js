// license.js - سیستەمێ کودێن ئەکتیڤکرنێ

class LicenseManager {
    constructor() {
        this.prefix = 'ZM';
        this.keyLength = 16;
    }
    
    // دروستکرنا کودا (بو ئادمین)
    generateLicenseKey(packageType, duration) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let key = '';
        
        for (let i = 0; i < this.keyLength; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const segmented = key.match(/.{1,4}/g).join('-');
        const fullKey = `${this.prefix}-${segmented}`;
        
        const licenseData = {
            key: fullKey,
            package: packageType,
            duration: duration,
            created: new Date().toISOString(),
            createdBy: 'admin',
            activated: false,
            activatedBy: null,
            activatedAt: null,
            valid: true
        };
        
        this.saveLicense(licenseData);
        return fullKey;
    }
    
    // ئەکتیڤکرن
    activateLicense(keyInput, userId) {
        const cleanKey = keyInput.replace(/\s/g, '').toUpperCase();
        const licenses = this.getAllLicenses();
        const license = licenses.find(l => l.key === cleanKey);
        
        if (!license) {
            return { success: false, message: '❌ کود نادروستە! تکایە دووبارە پشکنین بکە.' };
        }
        
        if (license.activated) {
            return { success: false, message: '⚠️ ئەڤ کودە ژ بەری ڤە هاتیە بکارئینان!' };
        }
        
        if (!license.valid) {
            return { success: false, message: '🛑 ئەڤ کودە چیتر نایێ بکارئینان!' };
        }
        
        // ئەکتیڤکرن
        license.activated = true;
        license.activatedBy = userId;
        license.activatedAt = new Date().toISOString();
        this.updateLicense(license);
        
        // نویکرنا پاکێجا بکارهێنەری
        this.upgradeUserPackage(userId, license.package, license.duration);
        
        return {
            success: true,
            message: '🎉 پیرۆزە! پاکێجا تە ب سەرکەفتیانە هاتە ئەکتیڤکرن!',
            package: license.package
        };
    }
    
    // بەرزکرنەوەیا پاکێجێ
    upgradeUserPackage(userId, packageType, duration) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            const expiryDate = duration === 'lifetime' 
                ? '2099-12-31' 
                : this.calculateExpiry(duration);
            
            users[userIndex].package = packageType;
            users[userIndex].isPremium = true;
            users[userIndex].packageExpiry = expiryDate;
            
            localStorage.setItem('users', JSON.stringify(users));
            
            // نویکرنا سێشنا نەهاتی
            if (auth.currentUser && auth.currentUser.id === userId) {
                auth.currentUser.package = packageType;
                auth.currentUser.isPremium = true;
                auth.currentUser.packageExpiry = expiryDate;
                auth.saveCurrentUser();
            }
        }
    }
    
    calculateExpiry(months) {
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + parseInt(months));
        return expiry.toISOString();
    }
    
    // تومارکرن و وەرگرتن
    saveLicense(licenseData) {
        const licenses = this.getAllLicenses();
        licenses.push(licenseData);
        localStorage.setItem('licenses', JSON.stringify(licenses));
    }
    
    updateLicense(updatedLicense) {
        const licenses = this.getAllLicenses();
        const index = licenses.findIndex(l => l.key === updatedLicense.key);
        if (index !== -1) {
            licenses[index] = updatedLicense;
            localStorage.setItem('licenses', JSON.stringify(licenses));
        }
    }
    
    getAllLicenses() {
        return JSON.parse(localStorage.getItem('licenses') || '[]');
    }
}

const licenseManager = new LicenseManager();

// ئەکتیڤکرن بو بکارهێنەران
function activateLicense() {
    if (!auth.isLoggedIn()) {
        alert('🛑 دەبیت ئێکێ چوویە ژوور!');
        return;
    }
    
    const keyInput = document.getElementById('licenseKey').value;
    const result = licenseManager.activateLicense(keyInput, auth.getCurrentUser().id);
    
    const resultDiv = document.getElementById('activationResult');
    resultDiv.innerHTML = result.message;
    resultDiv.className = 'activation-result ' + (result.success ? 'success' : 'error');
    
    if (result.success) {
        setTimeout(() => {
            closeModal('activationModal');
            updateDashboard();
        }, 2000);
    }
}

// فۆرماتکرنا کودێ
function formatLicenseKey(input) {
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 16) value = value.substr(0, 16);
    
    let formatted = 'ZM-';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += '-';
        formatted += value[i];
    }
    
    input.value = formatted;
}

function showActivationModal() {
    document.getElementById('activationModal').style.display = 'flex';
}