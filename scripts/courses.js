// courses.js - ١٠ زمانێن سەرەکی

const COURSES = [
    {
        id: 'ku-BHD',
        name: 'کوردی بەهدینی',
        flag: '🏴',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
        description: 'فێربوونا کوردی بەهدینی ب شێوەیەکێ ستاندارد و پڕاکتیکی',
        availableInFree: true,
        lessons: 150,
        speakers: '10M+'
    },
    {
        id: 'ku-SOR',
        name: 'کوردی سۆرانی',
        flag: '🏴',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
        description: 'فێربوونا کوردی سۆرانی ژ ئاستێ بنیاتنێر بۆ پێشکەتی',
        availableInFree: true,
        lessons: 150,
        speakers: '15M+'
    },
    {
        id: 'en',
        name: 'English',
        flag: '🇬🇧',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        description: 'Learn English with AI-powered lessons',
        availableInFree: false,
        lessons: 200,
        speakers: '1.5B+'
    },
    {
        id: 'ar',
        name: 'العربية',
        flag: '🇸🇦',
        levels: ['A1', 'A2', 'B1', 'B2'],
        description: 'تعلم اللغة العربية الفصحى',
        availableInFree: false,
        lessons: 120,
        speakers: '400M+'
    },
    {
        id: 'tr',
        name: 'Türkçe',
        flag: '🇹🇷',
        levels: ['A1', 'A2', 'B1', 'B2'],
        description: 'Türkçe öğrenin - Modern yöntemlerle',
        availableInFree: false,
        lessons: 130,
        speakers: '85M+'
    },
    {
        id: 'fa',
        name: 'فارسی',
        flag: '🇮🇷',
        levels: ['A1', 'A2', 'B1'],
        description: 'آموزش زبان فارسی با روش‌های نوین',
        availableInFree: false,
        lessons: 100,
        speakers: '110M+'
    },
    {
        id: 'de',
        name: 'Deutsch',
        flag: '🇩🇪',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
        description: 'Deutsch lernen mit KI-Unterstützung',
        availableInFree: false,
        lessons: 180,
        speakers: '130M+'
    },
    {
        id: 'fr',
        name: 'Français',
        flag: '🇫🇷',
        levels: ['A1', 'A2', 'B1', 'B2'],
        description: 'Apprenez le français facilement',
        availableInFree: false,
        lessons: 140,
        speakers: '300M+'
    },
    {
        id: 'es',
        name: 'Español',
        flag: '🇪🇸',
        levels: ['A1', 'A2', 'B1', 'B2'],
        description: 'Aprende español con lecciones interactivas',
        availableInFree: false,
        lessons: 150,
        speakers: '550M+'
    },
    {
        id: 'zh',
        name: '中文',
        flag: '🇨🇳',
        levels: ['A1', 'A2', 'B1'],
        description: '学习中文 - 人工智能辅助',
        availableInFree: false,
        lessons: 100,
        speakers: '1.3B+'
    }
];

// رەندەرکرنا کورسان
function renderCourses() {
    const grid = document.getElementById('languageGrid');
    const isPremium = auth.isLoggedIn() && auth.getCurrentUser().isPremium;
    
    const availableCourses = isPremium ? COURSES : COURSES.filter(c => c.availableInFree);
    
    grid.innerHTML = availableCourses.map(course => `
        <div class="language-card">
            <div class="language-flag">${course.flag}</div>
            <h3>${course.name}</h3>
            <p>${course.description}</p>
            <div class="language-levels">
                ${course.levels.map(level => `<span class="level-badge">${level}</span>`).join('')}
            </div>
            <div class="language-stats">
                <span><i class="fas fa-book"></i> ${course.lessons} وانە</span>
                <span><i class="fas fa-users"></i> ${course.speakers}</span>
            </div>
            <button class="btn btn-primary btn-block" onclick="startCourse('${course.id}')">
                <i class="fas fa-play"></i> دەستپێکە
            </button>
            ${!course.availableInFree && !isPremium ? '<div class="premium-lock"><i class="fas fa-lock"></i> پرێمیۆم</div>' : ''}
        </div>
    `).join('');
}

function startCourse(courseId) {
    if (!auth.isLoggedIn()) {
        alert('🛑 بو دەستپێکرنا کورسەکی، دەبیت ئێکێ چوویە ژوور!');
        showLoginForm();
        return;
    }
    
    const course = COURSES.find(c => c.id === courseId);
    if (!course.availableInFree && !auth.getCurrentUser().isPremium) {
        alert('🔒 ئەڤ کورسە بو پرێمیۆمە. پاکێجەکی بکڕە یان کودەکی ئەکتیڤ بکە.');
        document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    alert(`🎉 تە دەستپێکر: ${course.name}!\n\nدەمێ تە یێ باش بیت!`);
    auth.addXP(50);
}

// بارکرنا کورسان دەمێ پەڕێ تێتە ڤەکرن
window.addEventListener('load', () => {
    renderCourses();
});