// ============================================
// app.js - فەنکشنێن سەرەکی و گشتی
// Zimanê Min Platform v2.0
// ============================================

// --- تووگلێن مەنویان ---
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function toggleMobileMenu() {
    const nav = document.getElementById('mainNav');
    nav.classList.toggle('mobile-open');
}

// --- داخستنا درۆپداونان ب کلیک ل دەرڤە ---
window.addEventListener('click', function(e) {
    if (!e.target.closest('.user-menu')) {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
});

// --- داخستنا مۆدێلان ---
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// --- داخستنا مۆدێلان ب کلیک ل دەرڤە ---
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// --- سکرۆلا نەرم ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            
            // داخستنا مەنویا موبایلێ ئەگەر ڤەکری بیت
            document.getElementById('mainNav').classList.remove('mobile-open');
        }
    });
});

// --- نویکرنا داشبۆردێ ---
function updateDashboard() {
    const user = auth.getCurrentUser();
    if (!user) return;
    
    // زانیاریێن سەرەکی
    document.getElementById('dashboardName').textContent = user.name;
    document.getElementById('streakDays').textContent = user.streak || 0;
    document.getElementById('totalXP').textContent = user.xp || 0;
    document.getElementById('wordsLearned').textContent = user.wordsLearned || 0;
    document.getElementById('userLevel').textContent = user.level || 1;
    document.getElementById('lessonsCompleted').textContent = user.lessonsCompleted || 0;
    
    // نویکرنا پێشکەفتنا ئاستی
    if (typeof gamification !== 'undefined') {
        const levelInfo = gamification.getLevelInfo(user);
        const progressBar = document.getElementById('levelProgress');
        const xpNeeded = document.getElementById('xpNeededDisplay');
        const currentLevelDisplay = document.getElementById('currentLevelDisplay');
        const nextLevelDisplay = document.getElementById('nextLevelDisplay');
        
        if (progressBar) progressBar.style.width = levelInfo.progress + '%';
        if (xpNeeded) xpNeeded.textContent = levelInfo.xpNeeded + ' XP بو ئاستێ داهاتوو';
        if (currentLevelDisplay) currentLevelDisplay.textContent = levelInfo.currentLevel;
        if (nextLevelDisplay) nextLevelDisplay.textContent = levelInfo.currentLevel + 1;
    }
    
    // نویکرنا پاکێجێ
    const packageBadge = document.getElementById('packageBadge');
    if (packageBadge) {
        if (user.isPremium) {
            packageBadge.innerHTML = '💎 ' + (user.package || 'پرێمیۆم');
            packageBadge.className = 'badge-premium';
        } else {
            packageBadge.innerHTML = '🆓 بێ پارە';
            packageBadge.className = 'badge-free';
        }
    }
}

// --- نویکرنا UI-ێ دەمێ چوونەژوورێ ---
function updateUIForLoggedIn() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (authButtons) authButtons.style.display = 'none';
    if (userMenu) userMenu.style.display = 'block';
    
    const user = auth.getCurrentUser();
    if (user) {
        document.getElementById('userNameDisplay').textContent = user.name;
    }
    
    updateDashboard();
    renderCourses();
}

// --- نویکرنا UI-ێ دەمێ دەرچوونێ ---
function updateUIForLoggedOut() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (authButtons) authButtons.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
    
    // ریسێتکرنا داشبۆردێ
    document.getElementById('dashboardName').textContent = 'فێرخواز';
    document.getElementById('streakDays').textContent = '0';
    document.getElementById('totalXP').textContent = '0';
    document.getElementById('wordsLearned').textContent = '0';
    document.getElementById('userLevel').textContent = '1';
    document.getElementById('lessonsCompleted').textContent = '0';
    
    const progressBar = document.getElementById('levelProgress');
    if (progressBar) progressBar.style.width = '0%';
    
    renderCourses();
}

// --- پشکنینا پاکێجێ ---
function checkPackageExpiry() {
    if (!auth.isLoggedIn()) return;
    
    const user = auth.getCurrentUser();
    if (user.isPremium && user.packageExpiry && user.packageExpiry !== '2099-12-31') {
        const expiry = new Date(user.packageExpiry);
        const now = new Date();
        
        if (now > expiry) {
            user.isPremium = false;
            user.package = 'free';
            auth.saveCurrentUser();
            auth.updateUserInStorage();
            alert('⚠️ پاکێجا تە یا دوماهیک هاتیە. بو بەردەوامبوونێ پاکێجەکێ نوی بکڕە.');
            updateDashboard();
            renderCourses();
        }
    }
}

// --- دەستپێکرنا کورسەکی ---
function startCourse(courseId) {
    if (!auth.isLoggedIn()) {
        alert('🛑 بو دەستپێکرنا کورسەکی، دەبیت ئێکێ چوویە ژوور!');
        showLoginForm();
        return;
    }
    
    const course = COURSES.find(c => c.id === courseId);
    if (!course) {
        alert('❌ کورس نەهاتیە دیتن!');
        return;
    }
    
    if (!course.availableInFree && !auth.getCurrentUser().isPremium) {
        alert('🔒 ئەڤ کورسە بو پرێمیۆمە. پاکێجەکی بکڕە یان کودەکی ئەکتیڤ بکە.');
        document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    // دەستپێکرنا وانێ
    const defaultLevel = course.levels[0];
    if (typeof openLesson === 'function') {
        openLesson(courseId, defaultLevel);
    } else {
        alert(`🎉 تە دەستپێکر: ${course.name}!\n\nدەمێ تە یێ باش بیت!`);
        if (auth.isLoggedIn()) {
            auth.addXP(50);
            updateDashboard();
        }
    }
}

// --- دەستپێکرنا پلانا بێ پارە ---
function startFreePlan() {
    if (!auth.isLoggedIn()) {
        showRegisterForm();
        return;
    }
    alert('✅ پلانا بێ پارە یا چالاکە! دەستپێبکە فێربوونێ.');
    document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
}

// --- کۆپیکرن ---
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('📋 هاتە کۆپیکرن!');
        });
    } else {
        // فال باک بو براوسەرێن کەڤن
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('📋 هاتە کۆپیکرن!');
    }
}

// --- نیشاندانا وێنەیێ ---
function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// --- فۆرماتکرنا کودێ ---
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

// --- ئەنیمەیشنێن سکرۆلێ ---
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.stat-card, .language-card, .pricing-card, .quick-action-card, .community-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// --- شۆرتبازێن کیبۆردێ ---
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+K = فوکەس ل سەر هەلبژارتنا زمانی
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const langSelect = document.getElementById('uiLanguage');
            if (langSelect) langSelect.focus();
        }
        
        // Escape = داخستنا مۆدێلان
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                }
            });
        }
    });
}

// --- دەستپێک (Initialization) ---
window.addEventListener('load', function() {
    console.log('🚀 Zimanê Min Platform v2.0');
    console.log('================================');
    console.log('✅ تایبەتمەندیێن چالاک:');
    console.log('  💰 پارەدان: FIB, FastPay, USDT');
    console.log('  🔑 کودێن ئەکتیڤکرنێ');
    console.log('  📚 ١٠ زمان (کوردی تێدا)');
    console.log('  🌍 ١٠ وەرگێڕان');
    console.log('  🤖 AI چات');
    console.log('  🃏 فلاش کارت و SRS');
    console.log('  🎤 پەسنەدانا دەنگدانێ');
    console.log('  📖 وانێن کارلێککەر');
    console.log('  🏆 ئاست و ئەنجام');
    console.log('  📊 راپۆرت');
    console.log('================================');
    console.log('💡 زانیاریێن پارەدانێ:');
    console.log('  FIB: +964 750 604 5491');
    console.log('  FastPay: +964 750 604 5491');
    console.log('  USDT: TKUfVwnjyT2KUa9xnBreT32YLLJEwACHpc');
    
    // ڤەشارتنا سکرینا بارکرنێ
    setTimeout(function() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1000);
    
    // پشکنین ئەگەر بکارهێنەر ژ بەری ڤە چوویە ژوور
    if (auth.isLoggedIn()) {
        updateUIForLoggedIn();
    }
    
    // بارکرنا زمانی هاتینە پاراستن
    if (typeof changeUILanguage === 'function') {
        const savedLang = localStorage.getItem('uiLanguage') || 'ku-BHD';
        const langSelect = document.getElementById('uiLanguage');
        if (langSelect) {
            langSelect.value = savedLang;
            changeUILanguage(savedLang);
        }
    }
    
    // دەستپێکرنا ئەنیمەیشنان
    initScrollAnimations();
    
    // دەستپێکرنا شۆرتبازێن کیبۆردێ
    initKeyboardShortcuts();
    
    // پشکنینا پاکێجێ هەر ٣٠ خولەکان
    setInterval(checkPackageExpiry, 30 * 60 * 1000);
    
    // نیشاندانا ئەگەر بکارهێنەر پرێمیۆمە
    checkPackageExpiry();
});

// --- هندلەرێن گشتی بۆ ئەرۆران ---
window.addEventListener('error', function(e) {
    console.error('❌ ئەرۆرەک ڕویدا:', e.message);
    // ئەرۆران ب ئارامی دهێنە بەرێڤەبرن
});

// --- پێشگرتن ژ دەرچوونا بێ ئاگەهداری ---
window.addEventListener('beforeunload', function(e) {
    // ئەگەر وانەک ڤەکری بیت، ئاگەهداریێ بدە
    if (document.getElementById('lessonModal') && 
        document.getElementById('lessonModal').style.display === 'flex') {
        e.preventDefault();
        e.returnValue = 'وانەکا ڤەکری هەیە. ئەرێ تە دڤێت دەرکەڤی؟';
    }
});

console.log('✅ app.js باربوو و ئامادەیە!');