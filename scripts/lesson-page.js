// lesson-page.js - پەڕێ فێربوونێ یێ کارلێککەر و تهواڤ
class LessonPage {
    constructor() {
        this.currentLesson = null;
        this.currentSection = 0;
        this.completedSections = [];
        this.startTime = null;
    }

    createLessonPage(languageId, level) {
        const lesson = this.getLessonData(languageId, level);
        if (!lesson) return null;
        
        this.currentLesson = lesson;
        this.currentSection = 0;
        this.completedSections = [];
        this.startTime = new Date();
        
        return lesson;
    }

    getLessonData(languageId, level) {
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
                            { word: 'سپاس', translation: 'Thank you', example: 'سپاس بۆ هاریکاریا تە' }
                        ]
                    }
                }
            ]
        };
    }
}

const lessonPage = new LessonPage();

// سیستەمێ ئاخفتنا دەنگی ب شێوازەکێ جێگیر
function speakWord(word, langCode = 'ku-IQ') {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // راوەستاندنا دەنگێن بەری هینگێ
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = langCode;
        utterance.rate = 0.85; // خێراییەکا گونجای بۆ فێربوونێ
        window.speechSynthesis.speak(utterance);
    } else {
        alert('🛑 ئەڤ وێبگەڕە پشتگیرییا سیستەمێ دەنگی ناکەت.');
    }
}

function checkQuizAnswer(button, isCorrect) {
    const parent = button.parentElement;
    const options = parent.querySelectorAll('.quiz-option');
    
    options.forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.classList.add('disabled');
    });

    if (isCorrect) {
        button.classList.add('correct-answer');
        button.style.backgroundColor = '#10b981';
        button.style.color = '#white';
    } else {
        button.classList.add('wrong-answer');
        button.style.backgroundColor = '#ef4444';
        button.style.color = '#white';
    }
}
