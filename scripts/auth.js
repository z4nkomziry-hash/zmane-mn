// auth.js - سیستەمێ چوونەژوور و تۆمارکرنێ

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.loadUserFromStorage();
    }
    
    // تۆمارکرنا بکارهێنەرەکێ نوی
    register(name, email, password) {
        const users = this.getAllUsers();
        
        // پشکنین ئەگەر ئیمێل ژبەری ڤە هەیە
        if (users.find(u => u.email === email)) {
            return { success: false, message: '⚠️ ئەڤ ئیمێلە ژ بەری ڤە هاتیە تومارکرن!' };
        }
        
        const newUser = {
            id: 'user_' + Date.now(),
            name: name,
            email: email,
            password: btoa(password), // هشکردنا سادە (بو پرۆدەکشنێ، بکە بە bcrypt)
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
    }
    
    // چوونەژوور
    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === btoa(password));
        
        if (!user) {
            return { success: false, message: '❌ ئیمێل یان وشهێ نهێنی نادروستە!' };
        }
        
        this.currentUser = user;
        this.saveCurrentUser();
        this.updateStreak();
        
        return { success: true, message: '👋 ب خێر هاتی!', user: user };
    }
    
    // دەرچوون
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        updateUIForLoggedOut();
        window.location.reload();
    }
    
    // نویکرنا رێژا بەردەوامبوونێ
    updateStreak() {
        if (!this.currentUser) return;
        
        const lastActive = new Date(this.currentUser.lastActive);
        const today = new Date();
        const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            this.currentUser.streak += 1;
        } else if (diffDays > 1) {
            this.currentUser.streak = 1;
        }
        
        this.currentUser.lastActive = today.toISOString();
        this.saveCurrentUser();
        this.updateUserInStorage();
    }
    
    // زێدەکرنا XP
    addXP(amount) {
        if (!this.currentUser) return;
        this.currentUser.xp += amount;
        
        // پشکنینا ئاستی
        const newLevel = Math.floor(this.currentUser.xp / 1000) + 1;
        if (newLevel > this.currentUser.level) {
            this.currentUser.level = newLevel;
            alert(`🎉 پیرۆزە! تە گوهیشتیە ئاستا ${newLevel}!`);
        }
        
        this.saveCurrentUser();
        this.updateUserInStorage();
        updateDashboard();
    }
    
    // وەرگرتنا هەمی بکارهێنەران
    getAllUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }
    
    // پاراستنا بکارهێنەرێ نەهاتی
    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }
    
    // نویکرنا بکارهێنەری د لستێدا
    updateUserInStorage() {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
            users[index] = this.currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
    
    // بارکرنا بکارهێنەری هاتیە پاراستن
    loadUserFromStorage() {
        const saved = localStorage.getItem('currentUser');
        if (saved) {
            this.currentUser = JSON.parse(saved);
        }
    }
    
    // پشکنین ئەگەر بکارهێنەر چوویە ژوور
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    // وەرگرتنا بکارهێنەرێ نەهاتی
    getCurrentUser() {
        return this.currentUser;
    }
}

// دروستکرنا نموونەیەک
const auth = new AuthSystem();

// فەنکشنێن گشتی
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerPasswordConfirm').value;
    
    if (password !== confirm) {
        alert('❌ وشهێ نهێنی یەک نینە!');
        return;
    }
    
    const result = auth.register(name, email, password);
    alert(result.message);
    
    if (result.success) {
        closeModal('registerModal');
        auth.login(email, password);
        updateUIForLoggedIn();
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = auth.login(email, password);
    alert(result.message);
    
    if (result.success) {
        closeModal('loginModal');
        updateUIForLoggedIn();
    }
}

function logout() {
    auth.logout();
}

function showLoginForm() {
    document.getElementById('loginModal').style.display = 'flex';
}

function showRegisterForm() {
    document.getElementById('registerModal').style.display = 'flex';
}

function switchToRegister() {
    closeModal('loginModal');
    showRegisterForm();
}

function switchToLogin() {
    closeModal('registerModal');
    showLoginForm();
}

// نویکرنا UI-ێ
function updateUIForLoggedIn() {
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userMenu').style.display = 'block';
    document.getElementById('userNameDisplay').textContent = auth.getCurrentUser().name;
    updateDashboard();
}

function updateUIForLoggedOut() {
    document.getElementById('authButtons').style.display = 'flex';
    document.getElementById('userMenu').style.display = 'none';
}

// نویکرنا داشبۆردێ
function updateDashboard() {
    const user = auth.getCurrentUser();
    if (!user) return;
    
    document.getElementById('dashboardName').textContent = user.name;
    document.getElementById('streakDays').textContent = user.streak;
    document.getElementById('totalXP').textContent = user.xp;
    document.getElementById('wordsLearned').textContent = user.wordsLearned;
    document.getElementById('userLevel').textContent = user.level;
    document.getElementById('lessonsCompleted').textContent = user.lessonsCompleted;
}

// دەستپێکرنێدا بارکرن
window.addEventListener('load', () => {
    if (auth.isLoggedIn()) {
        updateUIForLoggedIn();
    }
    
    // ڤەشارتنا سکرینا بارکرنێ
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
    }, 1000);
});

// مۆدێل
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// داخستنا مۆدێلان ب کلیک ل دەرڤە
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});