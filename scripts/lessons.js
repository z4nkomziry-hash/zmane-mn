// lessons.js - سیستەمێ وانێن کارلێککەر

class LessonSystem {
    constructor() {
        this.currentLesson = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
    }
    
    // وەرگرتنا وانەکێ بۆ زمان و ئاستەکی
    getLesson(languageId, level) {
        // نموونە وانە (د پرۆدەکشنێدا دێ ژ بنکەدانانێ بهێتە وەرگرتن)
        const lessons = {
            'ku-BHD': {
                'A1': {
                    title: 'کوردی بەهدینی - ئاستا A1',
                    description: 'فێربوونا سلاڤکرنێ و دانوستانێن سادە',
                    questions: [
                        {
                            type: 'multiple-choice',
                            question: 'چاوا ب کوردی دبێژن "Hello"?',
                            options: ['سلاڤ', 'خاتر خواستن', 'سپاس', 'باش'],
                            correct: 0
                        },
                        {
                            type: 'multiple-choice',
                            question: 'مانایا "سپاس" چییە؟',
                            options: ['Goodbye', 'Thank you', 'Sorry', 'Please'],
                            correct: 1
                        },
                        {
                            type: 'translation',
                            question: 'ڤێ رستێ وەرگێڕە: "I am fine"',
                            correctAnswer: 'باشم',
                            hint: 'باش = fine/good'
                        },
                        {
                            type: 'multiple-choice',
                            question: '"ئەرێ" ب مانایا چییە؟',
                            options: ['No', 'Yes', 'Maybe', 'Please'],
                            correct: 1
                        },
                        {
                            type: 'listening',
                            question: 'گوێبگرە و هەلبژێرە: (دەنگ: "چاوا یی؟")',
                            options: ['سلاڤ', 'چاوا یی؟', 'باشم', 'سپاس'],
                            correct: 1,
                            audioPhrase: 'چاوا یی؟'
                        }
                    ]
                }
            },
            'en': {
                'A1': {
                    title: 'English - Level A1',
                    description: 'Learn basic greetings and simple conversations',
                    questions: [
                        {
                            type: 'multiple-choice',
                            question: 'What does "Hello" mean in Kurdish?',
                            options: ['سلاڤ', 'باش', 'سپاس', 'نە'],
                            correct: 0
                        },
                        {
                            type: 'translation',
                            question: 'Translate to English: "باشم"',
                            correctAnswer: 'I am fine',
                            hint: 'باش = good/fine'
                        },
                        {
                            type: 'multiple-choice',
                            question: 'How do you say "Thank you" in Kurdish?',
                            options: ['سلاڤ', 'سپاس', 'باش', 'ئەرێ'],
                            correct: 1
                        }
                    ]
                }
            }
        };
        
        return lessons[languageId]?.[level] || null;
    }
    
    // دەستپێکرنا وانەکێ
    startLesson(languageId, level) {
        const lesson = this.getLesson(languageId, level);
        
        if (!lesson) {
            alert('🚧 ئەڤ وانە هنژی نەهاتیە ئامادەکرن. زوو دێ بهێتە زێدەکرن!');
            return null;
        }
        
        this.currentLesson = lesson;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        
        return lesson;
    }
    
    // وەرگرتنا پرسیارا نەهاتی
    getCurrentQuestion() {
        if (!this.currentLesson) return null;
        return this.currentLesson.questions[this.currentQuestionIndex];
    }
    
    // بەرسڤدانا پرسیارێ
    answerQuestion(answer) {
        const question = this.getCurrentQuestion();
        if (!question) return null;
        
        let isCorrect = false;
        
        switch(question.type) {
            case 'multiple-choice':
                isCorrect = answer === question.correct;
                break;
            case 'translation':
                isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
                break;
            case 'listening':
                isCorrect = answer === question.correct;
                break;
        }
        
        const result = {
            questionIndex: this.currentQuestionIndex,
            isCorrect: isCorrect,
            userAnswer: answer,
            correctAnswer: question.correctAnswer || question.options[question.correct]
        };
        
        this.answers.push(result);
        
        if (isCorrect) {
            this.score++;
        }
        
        return result;
    }
    
    // چوونە پرسیارا داهاتوو
    nextQuestion() {
        this.currentQuestionIndex++;
        return this.currentQuestionIndex < this.currentLesson.questions.length;
    }
    
    // وەرگرتنا ئەنجامێ دوماهیکێ
    getFinalResult() {
        const total = this.currentLesson.questions.length;
        const percentage = Math.round((this.score / total) * 100);
        
        let grade, feedback;
        if (percentage === 100) {
            grade = '💯 بێ کێماسی!';
            feedback = 'تە هەمی پرسیار ب دروستی بەرسڤدان!';
        } else if (percentage >= 80) {
            grade = '🌟 زۆر باشە!';
            feedback = 'تە باش کارکر! هەر بەردەوام بە.';
        } else if (percentage >= 60) {
            grade = '👍 باشە';
            feedback = 'تە پێشکەفتنەکا باش هەیە. هندەک دی پراکتیزە بکە.';
        } else {
            grade = '💪 دووبارە هەوڵبدە';
            feedback = 'خەم نەخۆ! دووبارە وانێ ببینە و دێ باشتر بیت.';
        }
        
        return {
            score: this.score,
            total: total,
            percentage: percentage,
            grade: grade,
            feedback: feedback,
            answers: this.answers,
            xpEarned: this.score * 50
        };
    }
}

const lessonSystem = new LessonSystem();

// --- UI فەنکشن بو وانان ---

function openLesson(languageId, level) {
    if (!auth.isLoggedIn()) {
        alert('🛑 بو دەستپێکرنا وانان، دەبیت ئێکێ چوویە ژوور!');
        showLoginForm();
        return;
    }
    
    const lesson = lessonSystem.startLesson(languageId, level);
    if (!lesson) return;
    
    // دروستکرنا مۆدێلا وانێ
    createLessonModal(lesson);
    document.getElementById('lessonModal').style.display = 'flex';
    showLessonQuestion();
}

function createLessonModal(lesson) {
    // ژێبرنا مۆدێلا کەڤن ئەگەر هەیە
    const existingModal = document.getElementById('lessonModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'lessonModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content modal-lg" style="max-width: 700px;">
            <span class="close" onclick="closeLesson()">&times;</span>
            <div class="lesson-container">
                <div class="lesson-header">
                    <h3 id="lessonTitle">${lesson.title}</h3>
                    <p id="lessonDescription">${lesson.description}</p>
                    <div class="lesson-progress">
                        <div class="progress-bar" id="lessonProgressBar"></div>
                    </div>
                    <div class="lesson-stats">
                        <span id="questionCounter">پرسیار 1 ل ${lesson.questions.length}</span>
                        <span id="scoreCounter">خال: 0</span>
                    </div>
                </div>
                
                <div class="lesson-content" id="lessonContent">
                    <!-- دێ ب دینامیکی بهێتە پڕکرن -->
                </div>
                
                <div class="lesson-actions">
                    <button class="btn btn-primary" id="checkAnswerBtn" onclick="checkLessonAnswer()">
                        <i class="fas fa-check"></i> پشکنین بکە
                    </button>
                    <button class="btn btn-success" id="nextQuestionBtn" style="display:none;" onclick="nextLessonQuestion()">
                        پرسیارا داهاتوو <i class="fas fa-arrow-left"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // زێدەکرنا CSS-ێ بو وانان
    if (!document.getElementById('lessonStyles')) {
        const style = document.createElement('style');
        style.id = 'lessonStyles';
        style.textContent = `
            .lesson-container {
                padding: 1rem;
            }
            
            .lesson-header {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .lesson-progress {
                background: #e2e8f0;
                height: 10px;
                border-radius: 5px;
                margin: 1rem 0;
                overflow: hidden;
            }
            
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--primary), var(--secondary));
                border-radius: 5px;
                transition: width 0.5s ease;
                width: 0%;
            }
            
            .lesson-stats {
                display: flex;
                justify-content: space-between;
                color: var(--gray);
                font-weight: 600;
            }
            
            .lesson-content {
                min-height: 200px;
                margin: 2rem 0;
            }
            
            .question-text {
                font-size: 1.3rem;
                font-weight: 600;
                margin-bottom: 1.5rem;
                text-align: center;
            }
            
            .options-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            
            .option-btn {
                padding: 1.2rem;
                border: 2px solid #e2e8f0;
                border-radius: var(--radius);
                background: var(--white);
                cursor: pointer;
                font-size: 1.1rem;
                transition: var(--transition);
                text-align: center;
                font-weight: 600;
            }
            
            .option-btn:hover {
                border-color: var(--primary);
                background: var(--primary-bg);
            }
            
            .option-btn.selected {
                border-color: var(--primary);
                background: var(--primary);
                color: var(--white);
            }
            
            .option-btn.correct {
                border-color: var(--secondary);
                background: var(--secondary-bg);
                color: var(--secondary-dark);
            }
            
            .option-btn.wrong {
                border-color: var(--danger);
                background: #fef2f2;
                color: var(--danger);
            }
            
            .translation-input {
                width: 100%;
                padding: 1rem;
                border: 2px solid #e2e8f0;
                border-radius: var(--radius);
                font-size: 1.2rem;
                text-align: center;
                outline: none;
                transition: var(--transition);
            }
            
            .translation-input:focus {
                border-color: var(--primary);
            }
            
            .hint-text {
                color: var(--gray);
                font-size: 0.9rem;
                margin-top: 0.5rem;
                text-align: center;
            }
            
            .lesson-result {
                text-align: center;
                padding: 2rem;
            }
            
            .lesson-result .score-circle {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.5rem;
                font-size: 3rem;
                font-weight: 800;
            }
            
            .lesson-result .score-circle span {
                font-size: 1rem;
                font-weight: 400;
            }
            
            .lesson-actions {
                text-align: center;
                margin-top: 1.5rem;
            }
            
            @media (max-width: 600px) {
                .options-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function showLessonQuestion() {
    const question = lessonSystem.getCurrentQuestion();
    if (!question) return;
    
    const contentDiv = document.getElementById('lessonContent');
    let html = `<p class="question-text">${question.question}</p>`;
    
    switch(question.type) {
        case 'multiple-choice':
            html += '<div class="options-grid">';
            question.options.forEach((option, index) => {
                html += `
                    <div class="option-btn" onclick="selectOption(${index})" id="option${index}">
                        ${option}
                    </div>
                `;
            });
            html += '</div>';
            window.currentSelectedOption = null;
            break;
            
        case 'translation':
            html += `
                <input type="text" class="translation-input" id="translationAnswer" 
                       placeholder="بەرسڤا خۆ بنڤیسە...">
                ${question.hint ? `<p class="hint-text">💡 ڕێنمایی: ${question.hint}</p>` : ''}
            `;
            break;
            
        case 'listening':
            html += `
                <button class="btn btn-outline btn-block" onclick="playAudio('${question.audioPhrase}')">
                    <i class="fas fa-volume-up"></i> گوێبگرە
                </button>
                <div class="options-grid" style="margin-top: 1rem;">`;
            question.options.forEach((option, index) => {
                html += `
                    <div class="option-btn" onclick="selectOption(${index})" id="option${index}">
                        ${option}
                    </div>
                `;
            });
            html += '</div>';
            window.currentSelectedOption = null;
            break;
    }
    
    contentDiv.innerHTML = html;
    
    // نویکرنا پێشکەفتنێ
    const progress = (lessonSystem.currentQuestionIndex / lessonSystem.currentLesson.questions.length) * 100;
    document.getElementById('lessonProgressBar').style.width = progress + '%';
    document.getElementById('questionCounter').textContent = 
        `پرسیار ${lessonSystem.currentQuestionIndex + 1} ل ${lessonSystem.currentLesson.questions.length}`;
    document.getElementById('scoreCounter').textContent = `خال: ${lessonSystem.score}`;
    
    // ریسێتکرنا دوگمان
    document.getElementById('checkAnswerBtn').style.display = 'inline-flex';
    document.getElementById('nextQuestionBtn').style.display = 'none';
}

function selectOption(index) {
    const question = lessonSystem.getCurrentQuestion();
    if (question.type !== 'multiple-choice' && question.type !== 'listening') return;
    
    // ریسێتکرنا هەمی ئۆپشێنان
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    
    // هەلبژارتنا ئۆپشێنا نەهاتی
    document.getElementById('option' + index).classList.add('selected');
    window.currentSelectedOption = index;
}

function checkLessonAnswer() {
    const question = lessonSystem.getCurrentQuestion();
    let answer;
    
    switch(question.type) {
        case 'multiple-choice':
        case 'listening':
            if (window.currentSelectedOption === null || window.currentSelectedOption === undefined) {
                alert('⚠️ تکایە بەرسڤەکێ هەلبژێرە!');
                return;
            }
            answer = window.currentSelectedOption;
            break;
            
        case 'translation':
            answer = document.getElementById('translationAnswer').value;
            if (!answer.trim()) {
                alert('⚠️ تکایە بەرسڤا خۆ بنڤیسە!');
                return;
            }
            break;
    }
    
    const result = lessonSystem.answerQuestion(answer);
    
    // نیشاندانا ئەنجامی
    if (question.type === 'multiple-choice' || question.type === 'listening') {
        document.querySelectorAll('.option-btn').forEach((btn, i) => {
            if (i === question.correct) {
                btn.classList.add('correct');
            } else if (i === answer && !result.isCorrect) {
                btn.classList.add('wrong');
            }
            btn.style.pointerEvents = 'none';
        });
    } else {
        const input = document.getElementById('translationAnswer');
        input.style.borderColor = result.isCorrect ? 'var(--secondary)' : 'var(--danger)';
        input.style.background = result.isCorrect ? 'var(--secondary-bg)' : '#fef2f2';
        if (!result.isCorrect) {
            input.value += ` (درست: ${result.correctAnswer})`;
        }
        input.disabled = true;
    }
    
    document.getElementById('checkAnswerBtn').style.display = 'none';
    document.getElementById('nextQuestionBtn').style.display = 'inline-flex';
    
    if (result.isCorrect && auth.isLoggedIn()) {
        auth.addXP(50);
        updateDashboard();
    }
}

function nextLessonQuestion() {
    const hasNext = lessonSystem.nextQuestion();
    
    if (hasNext) {
        showLessonQuestion();
    } else {
        showLessonResult();
    }
}

function showLessonResult() {
    const result = lessonSystem.getFinalResult();
    
    const contentDiv = document.getElementById('lessonContent');
    contentDiv.innerHTML = `
        <div class="lesson-result">
            <div class="score-circle">
                ${result.percentage}%
                <span>${result.score}/${result.total}</span>
            </div>
            <h2>${result.grade}</h2>
            <p>${result.feedback}</p>
            <p style="margin-top: 1rem; color: var(--primary); font-weight: 600;">
                +${result.xpEarned} XP
            </p>
        </div>
    `;
    
    document.getElementById('checkAnswerBtn').style.display = 'none';
    document.getElementById('nextQuestionBtn').style.display = 'none';
    
    // نویکرنا پێشکەفتنا بکارهێنەری
    if (auth.isLoggedIn()) {
        const user = auth.getCurrentUser();
        user.lessonsCompleted = (user.lessonsCompleted || 0) + 1;
        
        if (result.percentage === 100) {
            user.perfectLessons = (user.perfectLessons || 0) + 1;
        }
        
        user.xp += result.xpEarned;
        user.wordsLearned += Math.round(result.score * 2);
        
        auth.saveCurrentUser();
        auth.updateUserInStorage();
        updateDashboard();
        
        // پشکنینا ئەنجامان
        const newAchievements = gamification.checkAndAwardAchievements(user);
        newAchievements.forEach(achievement => {
            gamification.showAchievementNotification(achievement);
        });
    }
}

function playAudio(phrase) {
    if (speechSystem) {
        speechSystem.speak(phrase, 'ku-BHD');
    } else {
        alert('🔊 دەنگ نەهاتیە بارکرن');
    }
}

function closeLesson() {
    document.getElementById('lessonModal').style.display = 'none';
    document.getElementById('lessonModal').remove();
}