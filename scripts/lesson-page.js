// lesson-page.js - پەڕێ فێربوونێ یێ کارلێککەر و تهواڤ

class LessonPage {
    constructor() {
        this.currentLesson = null;
        this.currentSection = 0;
        this.completedSections = [];
        this.startTime = null;
    }
    
    // دروستکرنا پەڕێ وانێ
    createLessonPage(languageId, level) {
        const lesson = this.getLessonData(languageId, level);
        if (!lesson) return null;
        
        this.currentLesson = lesson;
        this.currentSection = 0;
        this.completedSections = [];
        this.startTime = new Date();
        
        return lesson;
    }
    
    // وەرگرتنا داتایێن وانێ
    getLessonData(languageId, level) {
        // نموونە وانە - د پرۆدەکشنێدا دێ ژ بنکەدانانێ بهێتە وەرگرتن
        return {
            id: `lesson_${languageId}_${level}_1`,
            languageId: languageId,
            level: level,
            title: 'وانا ١: سلاڤ و دانوستان',
            description: 'فێربوونا سلاڤکرنێ و دانوستانێن سادە',
            sections: [
                {
                    type: 'vocabulary',
                    title: '📖 ڤۆکابلەری',
                    content: {
                        words: [
                            { word: 'سلاڤ', translation: 'Hello', example: 'سلاڤ، چاوا یی؟' },
                            { word: 'سپاس', translation: 'Thank you', example: 'سپاس بو هاریکاریا تە' },
                            { word: 'باش', translation: 'Good', example: 'ئەڤە باشە' },
                            { word: 'ئەرێ', translation: 'Yes', example: 'ئەرێ، ئەز دێ هاریکاریا تە بکەم' },
                            { word: 'نە', translation: 'No', example: 'نە، سپاس' }
                        ]
                    }
                },
                {
                    type: 'grammar',
                    title: '📝 رێزمان',
                    content: {
                        rule: 'رستێن سادە د کوردیدا',
                        explanation: 'د کوردی بەهدینیدا، رستە ب ڤی شێوەیێ دهێتە دروستکرن: کەس + کار + تەواوکەر',
                        examples: [
                            'ئەز دچمە مالێ (I go home)',
                            'تو دچییە قوتابخانێ (You go to school)',
                            'ئەو دهێتە ڤێرێ (He/She comes here)'
                        ]
                    }
                },
                {
                    type: 'practice',
                    title: '✍️ پراکتیزە',
                    content: {
                        exercises: [
                            {
                                question: 'چاوا دبێژن "Thank you" ب کوردی؟',
                                answer: 'سپاس',
                                hint: 'دەستپێکا وێ ب "س" یە'
                            },
                            {
                                question: 'مانایا "باش" چییە؟',
                                answer: 'good',
                                hint: 'بەرامبەرێ خراپە'
                            },
                            {
                                question: 'ڤێ رستێ تەواو بکە: "ئەز دچمە ..."',
                                answer: 'مالێ',
                                hint: 'جیهێ ژیانێ'
                            }
                        ]
                    }
                },
                {
                    type: 'dialogue',
                    title: '💬 دانوستان',
                    content: {
                        title: 'دانوستانەکا سادە',
                        dialogue: [
                            { speaker: 'ئەحمەد', text: 'سلاڤ، تو چاوا یی؟' },
                            { speaker: 'مریەم', text: 'سلاڤ، باشم، سپاس. تو چاوا یی؟' },
                            { speaker: 'ئەحمەد', text: 'باشم، سپاس. ناڤێ تە چییە؟' },
                            { speaker: 'مریەم', text: 'ناڤێ من مریەمە. تو ناڤێ خۆ چییە؟' },
                            { speaker: 'ئەحمەد', text: 'ناڤێ من ئەحمەدە. خۆشحالم بو دیتنا تە!' },
                            { speaker: 'مریەم', text: 'من ژی خۆشحالم! ب خاتر بیت!' }
                        ]
                    }
                },
                {
                    type: 'quiz',
                    title: '🎯 تاقیکرن',
                    content: {
                        questions: [
                            {
                                type: 'mcq',
                                question: '"سلاڤ" ب مانایا چییە؟',
                                options: ['Goodbye', 'Hello', 'Thank you', 'Sorry'],
                                correct: 1
                            },
                            {
                                type: 'mcq',
                                question: 'کێ دبێژت "ناڤێ من ئەحمەدە"؟',
                                options: ['مریەم', 'ئەحمەد', 'هەردوو', 'چ کەسەک'],
                                correct: 1
                            },
                            {
                                type: 'mcq',
                                question: '"سپاس" ب مانایا چییە؟',
                                options: ['Please', 'Sorry', 'Thank you', 'Yes'],
                                correct: 2
                            }
                        ]
                    }
                }
            ]
        };
    }
    
    // نیشاندانا پەڕێ وانێ
    displayLesson(lesson) {
        // دروستکرنا مۆدێلا وانێ
        const modal = document.createElement('div');
        modal.id = 'lessonPageModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px; width: 95%; padding: 0; overflow: hidden;">
                <div class="lesson-page-container">
                    <!-- سایدباڕ -->
                    <div class="lesson-sidebar">
                        <div class="lesson-sidebar-header">
                            <button class="close-lesson-btn" onclick="closeLessonPage()">&times;</button>
                            <h3>${lesson.title}</h3>
                            <p>${lesson.level} | ${lesson.languageId}</p>
                        </div>
                        <div class="lesson-sections-nav">
                            ${lesson.sections.map((section, index) => `
                                <div class="section-nav-item ${index === 0 ? 'active' : ''}" 
                                     id="sectionNav${index}"
                                     onclick="goToSection(${index})">
                                    <span class="section-check">${this.completedSections.includes(index) ? '✅' : '○'}</span>
                                    ${section.title}
                                </div>
                            `).join('')}
                        </div>
                        <div class="lesson-progress-mini">
                            <p>پێشکەفتن: ${this.completedSections.length}/${lesson.sections.length}</p>
                            <div class="mini-progress-bar">
                                <div class="mini-progress-fill" style="width: ${(this.completedSections.length / lesson.sections.length) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ناڤەڕۆک -->
                    <div class="lesson-main-content" id="lessonMainContent">
                        ${this.renderSection(lesson.sections[0], 0)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('lessonPageModal').style.display = 'flex';
        
        // زێدەکرنا CSS
        this.addLessonPageStyles();
    }
    
    // رەندەرکرنا سێکشنەکی
    renderSection(section, index) {
        switch(section.type) {
            case 'vocabulary':
                return this.renderVocabularySection(section, index);
            case 'grammar':
                return this.renderGrammarSection(section, index);
            case 'practice':
                return this.renderPracticeSection(section, index);
            case 'dialogue':
                return this.renderDialogueSection(section, index);
            case 'quiz':
                return this.renderQuizSection(section, index);
            default:
                return '<p>ناڤەڕۆک نەهاتیە دیتن</p>';
        }
    }
    
    renderVocabularySection(section, index) {
        return `
            <div class="section-content">
                <h2>${section.title}</h2>
                <div class="vocabulary-grid">
                    ${section.content.words.map(w => `
                        <div class="vocab-card">
                            <div class="vocab-word">${w.word}</div>
                            <div class="vocab-translation">${w.translation}</div>
                            <div class="vocab-example">${w.example}</div>
                            <button class="btn btn-sm" onclick="speakWord('${w.word}')">🔊</button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary" onclick="completeSection(${index})">
                    تەواوکرن <i class="fas fa-arrow-left"></i>
                </button>
            </div>
        `;
    }
    
    renderGrammarSection(section, index) {
        return `
            <div class="section-content">
                <h2>${section.title}</h2>
                <div class="grammar-card">
                    <h3>📌 ${section.content.rule}</h3>
                    <p>${section.content.explanation}</p>
                    <div class="grammar-examples">
                        <h4>نموونە:</h4>
                        ${section.content.examples.map(e => `<p class="example-item">• ${e}</p>`).join('')}
                    </div>
                </div>
                <button class="btn btn-primary" onclick="completeSection(${index})">
                    تەواوکرن <i class="fas fa-arrow-left"></i>
                </button>
            </div>
        `;
    }
    
    renderPracticeSection(section, index) {
        return `
            <div class="section-content">
                <h2>${section.title}</h2>
                <div class="exercises-list" id="exercisesList">
                    ${section.content.exercises.map((ex, i) => `
                        <div class="exercise-item" id="exercise${i}">
                            <p class="exercise-question">${i + 1}. ${ex.question}</p>
                            <div class="exercise-input-group">
                                <input type="text" class="exercise-input" id="exerciseInput${i}" 
                                       placeholder="بەرسڤا خۆ بنڤیسە...">
                                <button class="btn btn-sm btn-outline" onclick="checkExercise(${i}, '${ex.answer}')">
                                    پشکنین
                                </button>
                            </div>
                            <p class="exercise-hint" id="exerciseHint${i}" style="display:none;">
                                💡 ${ex.hint}
                            </p>
                            <p class="exercise-result" id="exerciseResult${i}"></p>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary" onclick="completeSection(${index})">
                    تەواوکرن <i class="fas fa-arrow-left"></i>
                </button>
            </div>
        `;
    }
    
    renderDialogueSection(section, index) {
        return `
            <div class="section-content">
                <h2>${section.title}</h2>
                <h3>${section.content.title}</h3>
                <div class="dialogue-container">
                    ${section.content.dialogue.map(d => `
                        <div class="dialogue-bubble ${d.speaker === 'ئەحمەد' ? 'left' : 'right'}">
                            <div class="dialogue-speaker">${d.speaker}</div>
                            <div class="dialogue-text">${d.text}</div>
                            <button class="btn btn-sm dialogue-speak" onclick="speakWord('${d.text}')">🔊</button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary" onclick="completeSection(${index})">
                    تەواوکرن <i class="fas fa-arrow-left"></i>
                </button>
            </div>
        `;
    }
    
    renderQuizSection(section, index) {
        return `
            <div class="section-content">
                <h2>${section.title}</h2>
                <div class="quiz-container" id="quizContainer">
                    ${section.content.questions.map((q, i) => `
                        <div class="quiz-question" id="quizQuestion${i}">
                            <p class="quiz-q-text">${i + 1}. ${q.question}</p>
                            <div class="quiz-options">
                                ${q.options.map((opt, j) => `
                                    <div class="quiz-option" onclick="selectQuizOption(${i}, ${j}, ${q.correct})" id="quizOption${i}_${j}">
                                        ${opt}
                                    </div>
                                `).join('')}
                            </div>
                            <p class="quiz-result" id="quizResult${i}"></p>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary" id="finishQuizBtn" onclick="finishQuiz(${index})">
                    تەواوکرنا تاقیکرنێ <i class="fas fa-check"></i>
                </button>
            </div>
        `;
    }
    
    // زێدەکرنا CSS-ێ
    addLessonPageStyles() {
        if (document.getElementById('lessonPageStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'lessonPageStyles';
        style.textContent = `
            .lesson-page-container {
                display: flex;
                height: 85vh;
                max-height: 700px;
            }
            
            .lesson-sidebar {
                width: 280px;
                background: #1e293b;
                color: white;
                display: flex;
                flex-direction: column;
                border-radius: 0 12px 12px 0;
            }
            
            .lesson-sidebar-header {
                padding: 1.5rem;
                border-bottom: 1px solid #334155;
                position: relative;
            }
            
            .close-lesson-btn {
                position: absolute;
                top: 0.5rem;
                left: 0.5rem;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
            }
            
            .lesson-sidebar-header h3 {
                margin: 0 0 0.25rem 0;
                font-size: 1.1rem;
            }
            
            .lesson-sidebar-header p {
                margin: 0;
                font-size: 0.85rem;
                color: #94a3b8;
            }
            
            .lesson-sections-nav {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
            }
            
            .section-nav-item {
                padding: 0.75rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                margin-bottom: 0.25rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .section-nav-item:hover {
                background: #334155;
            }
            
            .section-nav-item.active {
                background: #6366f1;
            }
            
            .section-check {
                font-size: 1.2rem;
            }
            
            .lesson-progress-mini {
                padding: 1rem;
                border-top: 1px solid #334155;
            }
            
            .lesson-progress-mini p {
                margin: 0 0 0.5rem 0;
                font-size: 0.85rem;
                text-align: center;
            }
            
            .mini-progress-bar {
                background: #334155;
                height: 6px;
                border-radius: 3px;
                overflow: hidden;
            }
            
            .mini-progress-fill {
                height: 100%;
                background: #10b981;
                border-radius: 3px;
                transition: width 0.3s;
            }
            
            .lesson-main-content {
                flex: 1;
                overflow-y: auto;
                padding: 2rem;
                background: white;
                border-radius: 12px 0 0 12px;
            }
            
            .section-content h2 {
                margin-bottom: 1.5rem;
                color: #1e293b;
            }
            
            .vocabulary-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .vocab-card {
                background: #f8fafc;
                padding: 1.5rem;
                border-radius: 12px;
                text-align: center;
                border: 1px solid #e2e8f0;
            }
            
            .vocab-word {
                font-size: 1.5rem;
                font-weight: 700;
                color: #6366f1;
            }
            
            .vocab-translation {
                color: #64748b;
                margin: 0.5rem 0;
            }
            
            .vocab-example {
                font-size: 0.85rem;
                color: #94a3b8;
                margin-bottom: 0.5rem;
            }
            
            .grammar-card {
                background: #eef2ff;
                padding: 2rem;
                border-radius: 12px;
                margin-bottom: 2rem;
            }
            
            .grammar-examples {
                margin-top: 1rem;
                padding: 1rem;
                background: white;
                border-radius: 8px;
            }
            
            .example-item {
                margin: 0.5rem 0;
                color: #334155;
            }
            
            .exercise-item {
                background: #f8fafc;
                padding: 1.5rem;
                border-radius: 12px;
                margin-bottom: 1rem;
            }
            
            .exercise-question {
                font-weight: 600;
                margin-bottom: 0.75rem;
            }
            
            .exercise-input-group {
                display: flex;
                gap: 0.5rem;
            }
            
            .exercise-input {
                flex: 1;
                padding: 0.75rem;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                outline: none;
            }
            
            .exercise-result {
                margin-top: 0.5rem;
                font-weight: 600;
            }
            
            .dialogue-container {
                margin-bottom: 2rem;
            }
            
            .dialogue-bubble {
                max-width: 70%;
                margin: 1rem 0;
                padding: 1rem;
                border-radius: 12px;
                position: relative;
            }
            
            .dialogue-bubble.left {
                background: #eef2ff;
                margin-right: auto;
            }
            
            .dialogue-bubble.right {
                background: #ecfdf5;
                margin-left: auto;
                text-align: right;
            }
            
            .dialogue-speaker {
                font-weight: 600;
                font-size: 0.85rem;
                margin-bottom: 0.25rem;
            }
            
            .dialogue-speak {
                position: absolute;
                bottom: 0.5rem;
                left: 0.5rem;
            }
            
            .quiz-question {
                background: #f8fafc;
                padding: 1.5rem;
                border-radius: 12px;
                margin-bottom: 1rem;
            }
            
            .quiz-q-text {
                font-weight: 600;
                margin-bottom: 1rem;
            }
            
            .quiz-options {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
            }
            
            .quiz-option {
                padding: 0.75rem;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
            }
            
            .quiz-option:hover {
                border-color: #6366f1;
                background: #eef2ff;
            }
            
            .quiz-option.selected {
                border-color: #6366f1;
                background: #6366f1;
                color: white;
            }
            
            .quiz-option.correct {
                border-color: #10b981;
                background: #ecfdf5;
                color: #059669;
            }
            
            .quiz-option.wrong {
                border-color: #ef4444;
                background: #fef2f2;
                color: #dc2626;
            }
            
            .quiz-result {
                margin-top: 0.5rem;
                font-weight: 600;
            }
            
            @media (max-width: 768px) {
                .lesson-page-container {
                    flex-direction: column;
                    height: auto;
                    max-height: none;
                }
                
                .lesson-sidebar {
                    width: 100%;
                    border-radius: 12px 12px 0 0;
                }
                
                .lesson-main-content {
                    border-radius: 0 0 12px 12px;
                }
                
                .quiz-options {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

const lessonPage = new LessonPage();

// --- فەنکشنێن گشتی ---

function openFullLesson(languageId, level) {
    if (!auth.isLoggedIn()) {
        alert('🛑 بو دەستپێکرنا وانێ، دەبیت ئێکێ چوویە ژوور!');
        showLoginForm();
        return;
    }
    
    const lesson = lessonPage.createLessonPage(languageId, level);
    if (lesson) {
        lessonPage.displayLesson(lesson);
    }
}

function goToSection(index) {
    lessonPage.currentSection = index;
    
    // نویکرنا ناڤباڕا سێکشنان
    document.querySelectorAll('.section-nav-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // نویکرنا ناڤەڕۆکێ
    const section = lessonPage.currentLesson.sections[index];
    document.getElementById('lessonMainContent').innerHTML = lessonPage.renderSection(section, index);
}

function completeSection(index) {
    if (!lessonPage.completedSections.includes(index)) {
        lessonPage.completedSections.push(index);
    }
    
    // نویکرنا ناڤباڕێ
    const navItem = document.getElementById('sectionNav' + index);
    if (navItem) {
        navItem.querySelector('.section-check').textContent = '✅';
    }
    
    // نویکرنا پێشکەفتنێ
    const progress = (lessonPage.completedSections.length / lessonPage.currentLesson.sections.length) * 100;
    document.querySelector('.mini-progress-fill').style.width = progress + '%';
    document.querySelector('.lesson-progress-mini p').textContent = 
        `پێشکەفتن: ${lessonPage.completedSections.length}/${lessonPage.currentLesson.sections.length}`;
    
    // زێدەکرنا XP
    if (auth.isLoggedIn()) {
        auth.addXP(100);
        updateDashboard();
    }
    
    // چوونە سێکشنا داهاتوو
    const nextIndex = index + 1;
    if (nextIndex < lessonPage.currentLesson.sections.length) {
        goToSection(nextIndex);
    } else {
        alert('🎉 پیرۆزە! تە هەمی وانە تەواوکر!');
        closeLessonPage();
        
        // نویکرنا پێشکەفتنێ
        if (auth.isLoggedIn()) {
            const user = auth.getCurrentUser();
            user.lessonsCompleted = (user.lessonsCompleted || 0) + 1;
            auth.saveCurrentUser();
            auth.updateUserInStorage();
            updateDashboard();
        }
    }
}

function checkExercise(index, correctAnswer) {
    const input = document.getElementById('exerciseInput' + index);
    const result = document.getElementById('exerciseResult' + index);
    const hint = document.getElementById('exerciseHint' + index);
    
    const userAnswer = input.value.trim().toLowerCase();
    const correct = correctAnswer.toLowerCase();
    
    if (userAnswer === correct) {
        result.textContent = '✅ درستە! زۆر باشە!';
        result.style.color = '#059669';
        input.style.borderColor = '#10b981';
        input.disabled = true;
    } else {
        result.textContent = '❌ نەدرستە. دووبارە هەوڵبدە!';
        result.style.color = '#dc2626';
        if (hint) hint.style.display = 'block';
    }
}

function selectQuizOption(questionIndex, optionIndex, correctIndex) {
    // پشکنین ئەگەر ئەڤ پرسیارە ژ بەری ڤە هاتیە بەرسڤدان
    if (document.getElementById('quizResult' + questionIndex).textContent) return;
    
    // نیشانکرنا هەموو ئۆپشێنان
    const options = document.querySelectorAll(`[id^="quizOption${questionIndex}_"]`);
    options.forEach((opt, i) => {
        opt.classList.remove('selected');
        if (i === correctIndex) opt.classList.add('correct');
        if (i === optionIndex && i !== correctIndex) opt.classList.add('wrong');
    });
    
    // نیشانکرنا ئۆپشێنا هەلبژارتی
    document.getElementById(`quizOption${questionIndex}_${optionIndex}`).classList.add('selected');
    
    // نیشاندانا ئەنجامی
    const result = document.getElementById('quizResult' + questionIndex);
    if (optionIndex === correctIndex) {
        result.textContent = '✅ درستە!';
        result.style.color = '#059669';
    } else {
        result.textContent = '❌ نەدرستە';
        result.style.color = '#dc2626';
    }
    
    // بلوکەکرنا ئۆپشێنان
    options.forEach(opt => opt.style.pointerEvents = 'none');
}

function finishQuiz(index) {
    const questions = lessonPage.currentLesson.sections[index].content.questions;
    const answered = questions.filter((q, i) => {
        return document.getElementById('quizResult' + i).textContent !== '';
    });
    
    if (answered.length < questions.length) {
        alert('⚠️ تکایە هەمی پرسیاران بەرسڤدە!');
        return;
    }
    
    const correct = questions.filter((q, i) => {
        return document.getElementById('quizResult' + i).textContent.includes('درستە');
    });
    
    const score = Math.round((correct.length / questions.length) * 100);
    alert(`🎯 ئەنجامێ تە: ${correct.length}/${questions.length} (${score}%)`);
    
    if (auth.isLoggedIn()) {
        auth.addXP(correct.length * 50);
        updateDashboard();
    }
    
    completeSection(index);
}

function speakWord(word) {
    if (typeof speechSystem !== 'undefined') {
        speechSystem.speak(word, lessonPage.currentLesson.languageId);
    }
}

function closeLessonPage() {
    const modal = document.getElementById('lessonPageModal');
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
}

console.log('📖 پەڕێ وانێ یێ کارلێککەر ئامادەیە!');