// courses.js - ١٠ زمانێن سەرەکی
const COURSES = [
    {
        id: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        description: 'Learn English with AI-powered lessons',
        availableInFree: false, lessons: 200, speakers: '1.5B+',
        color: '#1E40AF'
    },
    {
        id: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español',
        levels: ['A1', 'A2', 'B1', 'B2'],
        description: 'Aprende español con lecciones interactivas',
        availableInFree: false, lessons: 150, speakers: '550M+',
        color: '#DC2626'
    },
    {
        id: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français',
        levels: ['A1', 'A2', 'B1', 'B2'],
        description: 'Apprenez le français facilement',
        availableInFree: false, lessons: 150, speakers: '300M+',
        color: '#2563EB'
    },
    {
        id: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
        description: 'Deutsch lernen mit KI-Unterstützung',
        availableInFree: false, lessons: 180, speakers: '130M+',
        color: '#F59E0B'
    },
    {
        id: 'zh', name: '中文', flag: '🇨🇳', nativeName: '中文 (普通话)',
        levels: ['A1', 'A2', 'B1'],
        description: '学习中文 - 人工智能辅助',
        availableInFree: false, lessons: 120, speakers: '1.3B+',
        color: '#DC2626'
    },
    {
        id: 'ar', name: 'العربية', flag: '🇸🇦', nativeName: 'العربية',
        levels: ['A1', 'A2', 'B1', 'B2'],
        description: 'تعلم اللغة العربية الفصحى',
        availableInFree: false, lessons: 150, speakers: '400M+',
        color: '#059669'
    },
    {
        id: 'tr', name: 'Türkçe', flag: '🇹🇷', nativeName: 'Türkçe',
        levels: ['A1', 'A2', 'B1', 'B2'],
        description: 'Türkçe öğrenin - Modern yöntemlerle',
        availableInFree: false, lessons: 140, speakers: '85M+',
        color: '#DC2626'
    },
    {
        id: 'fa', name: 'فارسی', flag: '🇮🇷', nativeName: 'فارسی',
        levels: ['A1', 'A2', 'B1'],
        description: 'آموزش زبان فارسی با روش‌های نوین',
        availableInFree: false, lessons: 120, speakers: '110M+',
        color: '#059669'
    },
    {
        id: 'ku-SOR', name: 'کوردی سۆرانی', flag: '🏴', nativeName: 'کوردی سۆرانی',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
        description: 'فێربوونی کوردی سۆرانی',
        availableInFree: true, lessons: 200, speakers: '15M+',
        color: '#F59E0B'
    },
    {
        id: 'ku-BHD', name: 'کوردی بەهدینی', flag: '🏴', nativeName: 'کوردی بەهدینی',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
        description: 'فێربوونا کوردی بەهدینی',
        availableInFree: true, lessons: 200, speakers: '10M+',
        color: '#059669'
    }
];

function getAvailableCourses(isPremium) {
    if (isPremium) return COURSES;
    return COURSES.filter(c => c.availableInFree);
}

function renderCourses() {
    const grid = document.getElementById('languageGrid');
    if (!grid) return;
    
    const isPremium = auth.isLoggedIn() && auth.getCurrentUser() && auth.getCurrentUser().isPremium;
    const courses = isPremium ? COURSES : COURSES.filter(c => c.availableInFree);
    
    grid.innerHTML = courses.map(c => `
        <div class="language-card" style="border-top:4px solid ${c.color}">
            ${!c.availableInFree && !isPremium ? '<div class="premium-lock">💎</div>' : ''}
            <div class="language-flag">${c.flag}</div>
            <h3>${c.name}</h3>
            <p class="native-name" style="color:var(--primary);font-weight:600;">${c.nativeName}</p>
            <p style="color:var(--dark-light);">${c.description}</p>
            <div class="language-levels">
                ${c.levels.map(l => `<span class="level-badge">${l}</span>`).join('')}
            </div>
            <div class="language-stats">
                <span><i class="fas fa-book"></i> ${c.lessons} وانە</span>
                <span><i class="fas fa-users"></i> ${c.speakers}</span>
            </div>
            <button class="btn btn-primary btn-block" onclick="startCourse('${c.id}')">
                <i class="fas fa-play"></i> <span data-translate="start_learning">دەستپێکە</span>
            </button>
        </div>
    `).join('');
}
