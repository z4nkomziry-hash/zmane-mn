// auth.js - سیستەمێ چوونەژوور و تۆمارکرنێ یێ نویژەنکری
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.loadUserFromStorage();
    }

    // فەنکشنا تەمام بۆ پاراستنا پاسۆردی ب هاینکرنا خێرا (SHA-256)
    async hashPassword(password) {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    loadUserFromStorage() {
        try {
            const saved = localStorage.getItem('current_user');
            if (saved) this.currentUser = JSON.parse(saved);
        } catch (e) {
            console.error("Error loading user:", e);
        }
    }

    // تۆمارکرنا بکارهێنەرەکێ نوی
    async register(name, email, password) {
        try {
            const users = this.getAllUsers();
            
            if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                return { success: false, message: '⚠️ ئەڤ ئیمێلە ژ بەری ڤە هاتیە تومارکرن!' };
            }
            
            const hashedPassword = await this.hashPassword(password);
            
            const newUser = {
                id: `user_${Date.now()}`,
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword, 
                package: 'free',
                isPremium: false,
                createdAt: new Date().toISOString(),
                xp: 0,
                level: 1,
                wordsLearned: 0,
                lessonsCompleted: 0,
                streak: 0,
                lastActive: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            return { success: true, message: '✅ هەژمار ب سەرکەفتیانە هاتە دروستکرن!', user: newUser };
        } catch (error) {
            return { success: false, message: '🛑 خەلەتیەک روویدا: ' + error.message };
        }
    }

    // چوونەژوور
    async login(email, password) {
        try {
            const users = this.getAllUsers();
            const hashedPassword = await this.hashPassword(password);
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === hashedPassword);
            
            if (!user) {
                return { success: false, message: '❌ ئیمێل یان پاسۆرد نادروستە!' };
            }
            
            this.currentUser = user;
            localStorage.setItem('current_user', JSON.stringify(user));
            this.updateStreak(user);
            
            return { success: true, message: '🎉 ب خێر هاتی کەکێ ' + user.name, user };
        } catch (error) {
            return { success: false, message: '🛑 شاشەیەک هەیە د چوونەژوورێ دا' };
        }
    }

    updateStreak(user) {
        const today = new Date().toISOString().split('T')[0];
        const lastActiveDate = user.lastActive ? user.lastActive.split('T')[0] : null;
        
        if (lastActiveDate) {
            const diffTime = Math.abs(new Date(today) - new Date(lastActiveDate));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                user.streak += 1;
            } else if (diffDays > 1) {
                user.streak = 1; // زەنجیرە هاتیە برین
            }
        } else {
            user.streak = 1;
        }
        
        user.lastActive = new Date().toISOString();
        this.saveUserToAll(user);
    }

    saveUserToAll(updatedUser) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            if (this.currentUser && this.currentUser.id === updatedUser.id) {
                localStorage.setItem('current_user', JSON.stringify(updatedUser));
            }
        }
    }

    getAllUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('current_user');
        window.location.reload();
    }
}

const auth = new AuthSystem();
