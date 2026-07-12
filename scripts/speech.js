// speech.js - سیستەمێ پەسنەدانا دەنگدانێ و پراکتیزەکرنا ئاخفتنێ

class SpeechSystem {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.initRecognition();
    }
    
    initRecognition() {
        // پشکنین ئەگەر براوسەر پشتگیریا Web Speech API دکەت
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('⚠️ براوسەرێ تە پشتگیریا ناسینا دەنگی ناکەت.');
            return;
        }
        
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'ku'; // دێ ب گوهێرەکێ بهێتە نویکرن
    }
    
    // دەستپێکرنا گوێگرتنێ
    startListening(language, callback) {
        if (!this.recognition) {
            alert('🛑 براوسەرێ تە پشتگیریا ناسینا دەنگی ناکەت.');
            return;
        }
        
        // نویکرنا زمانی
        const langMap = {
            'ku-BHD': 'ku',
            'ku-SOR': 'ku',
            'en': 'en-US',
            'ar': 'ar',
            'tr': 'tr-TR',
            'de': 'de-DE',
            'fr': 'fr-FR',
            'es': 'es-ES',
            'zh': 'zh-CN'
        };
        
        this.recognition.lang = langMap[language] || 'en-US';
        this.isListening = true;
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;
            
            this.isListening = false;
            callback({
                success: true,
                text: transcript,
                confidence: confidence
            });
        };
        
        this.recognition.onerror = (event) => {
            this.isListening = false;
            callback({
                success: false,
                error: event.error
            });
        };
        
        this.recognition.start();
    }
    
    // راوەستاندنا گوێگرتنێ
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }
    
    // تێکست ب ئاخفتن (Text-to-Speech)
    speak(text, language) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        const langMap = {
            'ku-BHD': 'ku',
            'en': 'en-US',
            'ar': 'ar',
            'tr': 'tr-TR',
            'de': 'de-DE',
            'fr': 'fr-FR',
            'es': 'es-ES',
            'zh': 'zh-CN'
        };
        
        utterance.lang = langMap[language] || 'en-US';
        utterance.rate = 0.9; // خێراییا ئاخفتنێ
        utterance.pitch = 1;
        
        window.speechSynthesis.speak(utterance);
    }
}

const speechSystem = new SpeechSystem();

// --- UI فەنکشن بو پراکتیزەکرنا دەنگدانێ ---

function openSpeechPractice() {
    if (!auth.isLoggedIn()) {
        alert('🛑 بو پراکتیزەکرنا دەنگدانێ، دەبیت ئێکێ چوویە ژوور!');
        showLoginForm();
        return;
    }
    
    if (!document.getElementById('speechModal')) {
        createSpeechModal();
    }
    
    document.getElementById('speechModal').style.display = 'flex';
}

function createSpeechModal() {
    const modal = document.createElement('div');
    modal.id = 'speechModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close" onclick="closeModal('speechModal')">&times;</span>
            <div class="speech-container">
                <h3 style="text-align:center;">🎤 پراکتیزەکرنا ئاخفتنێ</h3>
                
                <div class="speech-target">
                    <p>📝 ڤێ رستێ بخوینە:</p>
                    <h2 id="targetPhrase">سلاڤ، چاوا یی؟</h2>
                    <button class="btn btn-sm" onclick="speakTargetPhrase()">🔊 گوێبیستی ببە</button>
                </div>
                
                <div class="speech-record">
                    <button id="recordButton" class="btn-record" onclick="startRecording()">
                        <i class="fas fa-microphone"></i> دەستپێکە
                    </button>
                    <p id="recordingStatus"></p>
                </div>
                
                <div class="speech-result" id="speechResult"></div>
                
                <div class="speech-score" id="speechScore"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // زێدەکرنا CSS-ێ
    const style = document.createElement('style');
    style.textContent = `
        .speech-container {
            text-align: center;
        }
        
        .speech-target {
            background: var(--primary-bg);
            padding: 1.5rem;
            border-radius: var(--radius);
            margin: 1.5rem 0;
        }
        
        .speech-target h2 {
            font-size: 2rem;
            color: var(--primary);
            margin: 0.5rem 0;
        }
        
        .btn-record {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 4px solid var(--primary);
            background: var(--white);
            cursor: pointer;
            font-size: 1.1rem;
            transition: var(--transition);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
            margin: 1.5rem auto;
        }
        
        .btn-record:hover {
            background: var(--primary);
            color: var(--white);
            transform: scale(1.05);
        }
        
        .btn-record.recording {
            background: var(--danger);
            border-color: var(--danger);
            color: var(--white);
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
            70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        
        .speech-result {
            margin: 1rem 0;
            padding: 1rem;
            background: var(--gray-bg);
            border-radius: var(--radius);
        }
        
        .speech-score {
            font-size: 1.5rem;
            font-weight: 700;
        }
    `;
    document.head.appendChild(style);
}

function speakTargetPhrase() {
    const phrase = document.getElementById('targetPhrase').textContent;
    speechSystem.speak(phrase, 'ku-BHD');
}

function startRecording() {
    const button = document.getElementById('recordButton');
    const status = document.getElementById('recordingStatus');
    
    if (speechSystem.isListening) {
        speechSystem.stopListening();
        button.classList.remove('recording');
        button.innerHTML = '<i class="fas fa-microphone"></i> دەستپێکە';
        status.textContent = '';
        return;
    }
    
    button.classList.add('recording');
    button.innerHTML = '<i class="fas fa-stop"></i> راوەستە';
    status.textContent = '🎤 گوێگرتن... باخڤە!';
    
    speechSystem.startListening('ku-BHD', (result) => {
        button.classList.remove('recording');
        button.innerHTML = '<i class="fas fa-microphone"></i> دەستپێکە';
        status.textContent = '';
        
        if (result.success) {
            document.getElementById('speechResult').innerHTML = `
                <p>تە گۆت: <strong>"${result.text}"</strong></p>
                <p>رێژا دروستیێ: ${Math.round(result.confidence * 100)}%</p>
            `;
            
            // هەلسەنگاندنا سادە
            const score = Math.round(result.confidence * 100);
            document.getElementById('speechScore').innerHTML = 
                score > 80 ? '🌟 زۆر باشە!' : score > 50 ? '👍 باشە، هێدی هێدی' : '💪 دووبارە هەوڵبدە';
            
            if (auth.isLoggedIn()) {
                auth.addXP(Math.round(score / 2));
                updateDashboard();
            }
        } else {
            document.getElementById('speechResult').innerHTML = 
                '<p style="color:red;">❌ نەهاتە ناسین. دووبارە هەوڵبدە.</p>';
        }
    });
}