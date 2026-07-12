// courses.js - ١٠ زمانێن سەرەکی یێن جیهانی ب وانان
// هەمی زمان ب داتایێن ڕاستەقینە

const COURSES = [
    // ١. English
    {
        id: 'en',
        name: 'English',
        flag: '🇬🇧',
        nativeName: 'English',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        description: 'Learn the world\'s most spoken language with AI-powered lessons',
        availableInFree: false,
        lessons: 200,
        speakers: '1.5B+ speakers',
        color: '#1E40AF',
        units: [
            { name: 'Greetings', icon: '👋', words: ['Hello', 'Goodbye', 'Good morning', 'Good night', 'How are you?'] },
            { name: 'Numbers', icon: '🔢', words: ['One', 'Two', 'Three', 'Four', 'Five'] },
            { name: 'Colors', icon: '🎨', words: ['Red', 'Blue', 'Green', 'Yellow', 'Black'] },
            { name: 'Family', icon: '👨‍👩‍👧‍👦', words: ['Mother', 'Father', 'Sister', 'Brother', 'Baby'] },
            { name: 'Food', icon: '🍕', words: ['Water', 'Bread', 'Rice', 'Meat', 'Fruit'] }
        ]
    },
    
    // ٢. Spanish
    {
        id: 'es',
        name: 'Español',
        flag: '🇪🇸',
        nativeName: 'Español',
        levels: ['A1', 'A2', 'B1', 'B2'],
        description: 'Aprende español con lecciones interactivas y divertidas',
        availableInFree: false,
        lessons: 150,
        speakers: '550M+ speakers',
        color: '#DC2626',
        units: [
            { name: 'Saludos', icon: '👋', words: ['Hola', 'Adiós', 'Buenos días', 'Buenas noches', '¿Cómo estás?'] },
            { name: 'Números', icon: '🔢', words: ['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco'] },
            { name: 'Colores', icon: '🎨', words: ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Negro'] },
            { name: 'Familia', icon: '👨‍👩‍👧‍👦', words: ['Madre', 'Padre', 'Hermana', 'Hermano', 'Bebé'] },
            { name: 'Comida', icon: '🍕', words: ['Agua', 'Pan', 'Arroz', 'Carne', 'Fruta'] }
        ]
    },
    
    // ٣. French
    {
        id: 'fr',
        name: 'Français',
        flag: '🇫🇷',
        nativeName: 'Français',
        levels: ['A1', 'A2', 'B1', 'B2'],
        description: 'Apprenez le français facilement avec nos leçons interactives',
        availableInFree: false,
        lessons: 150,
        speakers: '300M+ speakers',
        color: '#2563EB',
        units: [
            { name: 'Salutations', icon: '👋', words: ['Bonjour', 'Au revoir', 'Bonsoir', 'Bonne nuit', 'Comment ça va?'] },
            { name: 'Nombres', icon: '🔢', words: ['Un', 'Deux', 'Trois', 'Quatre', 'Cinq'] },
            { name: 'Couleurs', icon: '🎨', words: ['Rouge', 'Bleu', 'Vert', 'Jaune', 'Noir'] },
            { name: 'Famille', icon: '👨‍👩‍👧‍👦', words: ['Mère', 'Père', 'Sœur', 'Frère', 'Bébé'] },
            { name: 'Nourriture', icon: '🍕', words: ['Eau', 'Pain', 'Riz', 'Viande', 'Fruit'] }
        ]
    },
    
    // ٤. German
    {
        id: 'de',
        name: 'Deutsch',
        flag: '🇩🇪',
        nativeName: 'Deutsch',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
        description: 'Deutsch lernen mit modernen KI-gestützten Methoden',
        availableInFree: false,
        lessons: 180,
        speakers: '130M+ speakers',
        color: '#F59E0B',
        units: [
            { name: 'Begrüßungen', icon: '👋', words: ['Hallo', 'Tschüss', 'Guten Morgen', 'Gute Nacht', 'Wie geht\'s?'] },
            { name: 'Zahlen', icon: '🔢', words: ['Eins', 'Zwei', 'Drei', 'Vier', 'Fünf'] },
            { name: 'Farben', icon: '🎨', words: ['Rot', 'Blau', 'Grün', 'Gelb', 'Schwarz'] },
            { name: 'Familie', icon: '👨‍👩‍👧‍👦', words: ['Mutter', 'Vater', 'Schwester', 'Bruder', 'Baby'] },
            { name: 'Essen', icon: '🍕', words: ['Wasser', 'Brot', 'Reis', 'Fleisch', 'Obst'] }
        ]
    },
    
    // ٥. Chinese (Mandarin)
    {
        id: 'zh',
        name: '中文',
        flag: '🇨🇳',
        nativeName: '中文 (普通话)',
        levels: ['A1', 'A2', 'B1'],
        description: '学习中文 - 人工智能辅助教学',
        availableInFree: false,
        lessons: 120,
        speakers: '1.3B+ speakers',
        color: '#DC2626',
        units: [
            { name: '问候', icon: '👋', words: ['你好', '再见', '早上好', '晚安', '你好吗?'] },
            { name: '数字', icon: '🔢', words: ['一', '二', '三', '四', '五'] },
            { name: '颜色', icon: '🎨', words: ['红色', '蓝色', '绿色', '黄色', '黑色'] },
            { name: '家庭', icon: '👨‍👩‍👧‍👦', words: ['妈妈', '爸爸', '姐姐', '哥哥', '宝宝'] },
            { name: '食物', icon: '🍕', words: ['水', '面包', '米饭', '肉', '水果'] }
        ]
    },
    
    // ٦. Arabic
    {
        id: 'ar',
        name: 'العربية',
        flag: '🇸🇦',
        nativeName: 'العربية',
        levels: ['A1', 'A2', 'B1', 'B2'],
        description: 'تعلم اللغة العربية الفصحى بسهولة',
        availableInFree: false,
        lessons: 150,
        speakers: '400M+ speakers',
        color: '#059669',
        units: [
            { name: 'تحيات', icon: '👋', words: ['مرحبا', 'وداعا', 'صباح الخير', 'ليلة سعيدة', 'كيف حالك؟'] },
            { name: 'أرقام', icon: '🔢', words: ['واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة'] },
            { name: 'ألوان', icon: '🎨', words: ['أحمر', 'أزرق', 'أخضر', 'أصفر', 'أسود'] },
            { name: 'عائلة', icon: '👨‍👩‍👧‍👦', words: ['أم', 'أب', 'أخت', 'أخ', 'طفل'] },
            { name: 'طعام', icon: '🍕', words: ['ماء', 'خبز', 'أرز', 'لحم', 'فاكهة'] }
        ]
    },
    
    // ٧. Turkish
    {
        id: 'tr',
        name: 'Türkçe',
        flag: '🇹🇷',
        nativeName: 'Türkçe',
        levels: ['A1', 'A2', 'B1', 'B2'],
        description: 'Türkçe öğrenin - Modern yöntemlerle',
        availableInFree: false,
        lessons: 140,
        speakers: '85M+ speakers',
        color: '#DC2626',
        units: [
            { name: 'Selamlaşma', icon: '👋', words: ['Merhaba', 'Görüşürüz', 'Günaydın', 'İyi geceler', 'Nasılsın?'] },
            { name: 'Sayılar', icon: '🔢', words: ['Bir', 'İki', 'Üç', 'Dört', 'Beş'] },
            { name: 'Renkler', icon: '🎨', words: ['Kırmızı', 'Mavi', 'Yeşil', 'Sarı', 'Siyah'] },
            { name: 'Aile', icon: '👨‍👩‍👧‍👦', words: ['Anne', 'Baba', 'Kız kardeş', 'Erkek kardeş', 'Bebek'] },
            { name: 'Yemek', icon: '🍕', words: ['Su', 'Ekmek', 'Pirinç', 'Et', 'Meyve'] }
        ]
    },
    
    // ٨. Persian
    {
        id: 'fa',
        name: 'فارسی',
        flag: '🇮🇷',
        nativeName: 'فارسی',
        levels: ['A1', 'A2', 'B1'],
        description: 'آموزش زبان فارسی با روش‌های نوین',
        availableInFree: false,
        lessons: 120,
        speakers: '110M+ speakers',
        color: '#059669',
        units: [
            { name: 'سلام و احوالپرسی', icon: '👋', words: ['سلام', 'خداحافظ', 'صبح بخیر', 'شب بخیر', 'حالت چطوره؟'] },
            { name: 'اعداد', icon: '🔢', words: ['یک', 'دو', 'سه', 'چهار', 'پنج'] },
            { name: 'رنگ‌ها', icon: '🎨', words: ['قرمز', 'آبی', 'سبز', 'زرد', 'سیاه'] },
            { name: 'خانواده', icon: '👨‍👩‍👧‍👦', words: ['مادر', 'پدر', 'خواهر', 'برادر', 'نوزاد'] },
            { name: 'غذا', icon: '🍕', words: ['آب', 'نان', 'برنج', 'گوشت', 'میوه'] }
        ]
    },
    
    // ٩. Kurdish Sorani
    {
        id: 'ku-SOR',
        name: 'کوردی سۆرانی',
        flag: '☀️',
        nativeName: 'کوردی سۆرانی',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
        description: 'فێربوونی کوردی سۆرانی لە ئاستی بنەڕەتییەوە بۆ پێشکەوتوو',
        availableInFree: true,
        lessons: 200,
        speakers: '15M+ speakers',
        color: '#F59E0B',
        units: [
            { name: 'سڵاوکردن', icon: '👋', words: ['سڵاو', 'خوا حافیزی', 'بەیانیت باش', 'شەو باش', 'چۆنی؟'] },
            { name: 'ژمارەکان', icon: '🔢', words: ['یەک', 'دوو', 'سێ', 'چوار', 'پێنج'] },
            { name: 'ڕەنگەکان', icon: '🎨', words: ['سوور', 'شین', 'سەوز', 'زەرد', 'ڕەش'] },
            { name: 'خێزان', icon: '👨‍👩‍👧‍👦', words: ['دایک', 'باوک', 'خوشک', 'برا', 'مناڵ'] },
            { name: 'خواردن', icon: '🍕', words: ['ئاو', 'نان', 'برنج', 'گۆشت', 'میوە'] }
        ]
    },
    
    // ١٠. Kurdish Bahdini
    {
        id: 'ku-BHD',
        name: 'کوردی بەهدینی',
        flag: '☀️',
        nativeName: 'کوردی بەهدینی',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
        description: 'فێربوونا کوردی بەهدینی ژ ئاستێ سەرەتایی بۆ پێشکەتی',
        availableInFree: true,
        lessons: 200,
        speakers: '10M+ speakers',
        color: '#059669',
        units: [
            { name: 'سلاڤکرن', icon: '👋', words: ['سلاڤ', 'خاتر خواستن', 'بەیانیت باش', 'شەڤ باش', 'چاوا یی؟'] },
            { name: 'ژمارە', icon: '🔢', words: ['ئێک', 'دوو', 'سێ', 'چار', 'پێنج'] },
            { name: 'رەنگ', icon: '🎨', words: ['سۆر', 'شین', 'کەسک', 'زەر', 'ڕەش'] },
            { name: 'خێزان', icon: '👨‍👩‍👧‍👦', words: ['دایک', 'باڤ', 'خوشک', 'برا', 'زاوە'] },
            { name: 'خوارن', icon: '🍕', words: ['ئاڤ', 'نان', 'برنج', 'گۆشت', 'فێقی'] }
        ]
    }
];

// فەنکشنا وەرگرتنا کورسان
function getAvailableCourses(isPremium = false) {
    if (isPremium) return COURSES;
    return COURSES.filter(course => course.availableInFree);
}

// فەنکشنا وەرگرتنا کورسەکی ب ناڤێ
function getCourseById(courseId) {
    return COURSES.find(c => c.id === courseId);
}

// فەنکشنا ڕەندەرکرنا کورسان
function renderCourses() {
    const grid = document.getElementById('languageGrid');
    if (!grid) return;
    
    const isPremium = auth.isLoggedIn() && auth.getCurrentUser() && auth.getCurrentUser().isPremium;
    const availableCourses = isPremium ? COURSES : COURSES.filter(c => c.availableInFree);
    
    grid.innerHTML = availableCourses.map(course => `
        <div class="language-card" style="border-top: 4px solid ${course.color}">
            ${!course.availableInFree && !isPremium ? '<div class="premium-lock">💎 پرێمیۆم</div>' : ''}
            <div class="language-flag">${course.flag}</div>
            <h3>${course.name}</h3>
            <p style="color: var(--dark-light); font-size: 0.85rem;">${course.nativeName}</p>
            <p>${course.description}</p>
            <div class="language-levels">
                ${course.levels.map(level => `<span class="level-badge">${level}</span>`).join('')}
            </div>
            <div class="language-stats">
                <span><i class="fas fa-book"></i> ${course.lessons} وانە</span>
                <span><i class="fas fa-users"></i> ${course.speakers}</span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.25rem; justify-content: center; margin: 0.75rem 0;">
                ${course.units.map(u => `
                    <span style="font-size: 1.2rem; cursor: help;" title="${u.name}: ${u.words.slice(0,3).join(', ')}...">${u.icon}</span>
                `).join('')}
            </div>
            <button class="btn btn-primary btn-block" onclick="startCourse('${course.id}')">
                <i class="fas fa-play"></i> دەستپێکە
            </button>
        </div>
    `).join('');
}
