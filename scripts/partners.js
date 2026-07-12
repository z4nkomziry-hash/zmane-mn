// partners.js - سیستەمێ هەڤالکا فێربوونێ

class PartnerSystem {
    constructor() {
        this.partnerRequests = [];
        this.loadRequests();
    }
    
    loadRequests() {
        this.partnerRequests = JSON.parse(localStorage.getItem('partnerRequests') || '[]');
    }
    
    saveRequests() {
        localStorage.setItem('partnerRequests', JSON.stringify(this.partnerRequests));
    }
    
    // داوانا هەڤالکی
    requestPartner(userId, languageToLearn, languageToTeach, message) {
        const user = JSON.parse(localStorage.getItem('users') || '[]').find(u => u.id === userId);
        if (!user) return null;
        
        const request = {
            id: 'partner_' + Date.now(),
            userId: userId,
            userName: user.name,
            languageToLearn: languageToLearn,
            languageToTeach: languageToTeach,
            message: message || '',
            status: 'pending', // 'pending', 'matched', 'cancelled'
            createdAt: new Date().toISOString(),
            matchedWith: null
        };
        
        // ژێبرنا داوانێن کەڤن یێن هەمان بکارهێنەری
        this.partnerRequests = this.partnerRequests.filter(r => r.userId !== userId);
        this.partnerRequests.push(request);
        this.saveRequests();
        
        // هەوڵدان بو دیتنا هەڤالکی
        this.tryMatch(request);
        
        return request;
    }
    
    // هەوڵدان بو دیتنا هەڤالکی
    tryMatch(request) {
        const potentialPartners = this.partnerRequests.filter(r => 
            r.id !== request.id &&
            r.status === 'pending' &&
            r.languageToLearn === request.languageToTeach &&
            r.languageToTeach === request.languageToLearn
        );
        
        if (potentialPartners.length > 0) {
            const partner = potentialPartners[0];
            
            // ئەپدەیتکرنا هەردوو داوانان
            request.status = 'matched';
            request.matchedWith = partner.userId;
            partner.status = 'matched';
            partner.matchedWith = request.userId;
            
            this.saveRequests();
            
            // ئاگەهداری
            if (typeof notificationSystem !== 'undefined') {
                notificationSystem.addNotification(
                    request.userId,
                    'partner',
                    '👥 هەڤالکا فێربوونێ هاتە دیتن!',
                    `تە و ${partner.userName} بووینە هەڤالێن فێربوونێ!`,
                    'fas fa-user-friends'
                );
                
                notificationSystem.addNotification(
                    partner.userId,
                    'partner',
                    '👥 هەڤالکا فێربوونێ هاتە دیتن!',
                    `تە و ${request.userName} بووینە هەڤالێن فێربوونێ!`,
                    'fas fa-user-friends'
                );
            }
            
            return partner;
        }
        
        return null;
    }
    
    // وەرگرتنا هەڤالکا بکارهێنەری
    getUserPartner(userId) {
        const request = this.partnerRequests.find(r => 
            r.userId === userId && r.status === 'matched'
        );
        
        if (request) {
            const partnerUser = JSON.parse(localStorage.getItem('users') || '[]')
                .find(u => u.id === request.matchedWith);
            
            return {
                request: request,
                partner: partnerUser || null
            };
        }
        
        return null;
    }
    
    // پاشڤەدانا داوانێ
    cancelRequest(userId) {
        const request = this.partnerRequests.find(r => r.userId === userId && r.status !== 'cancelled');
        
        if (request) {
            request.status = 'cancelled';
            
            // ئەگەر هەڤال هەبیت، ئەوی ژی پاشڤە بدە
            if (request.matchedWith) {
                const partnerRequest = this.partnerRequests.find(r => r.userId === request.matchedWith);
                if (partnerRequest) {
                    partnerRequest.status = 'cancelled';
                    partnerRequest.matchedWith = null;
                }
            }
            
            request.matchedWith = null;
            this.saveRequests();
        }
    }
}

const partnerSystem = new PartnerSystem();

// --- فەنکشنێن UI ---

function openPartnerFinder() {
    if (!auth.isLoggedIn()) {
        alert('🛑 بو دیتنا هەڤالکا فێربوونێ، دەبیت ئێکێ چوویە ژوور!');
        return;
    }
    
    const user = auth.getCurrentUser();
    const currentPartner = partnerSystem.getUserPartner(user.id);
    
    const modal = document.createElement('div');
    modal.id = 'partnerModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal('partnerModal')">&times;</span>
            
            <div style="padding:1rem; text-align:center;">
                <h2>👥 هەڤالکا فێربوونێ</h2>
                
                ${currentPartner ? `
                    <!-- هەڤالا نەهاتی -->
                    <div style="background:#ecfdf5; padding:1.5rem; border-radius:12px; margin:1.5rem 0;">
                        <i class="fas fa-user-friends" style="font-size:3rem; color:#10b981;"></i>
                        <h3>✅ هەڤالا تە یا فێربوونێ</h3>
                        <p><strong>${currentPartner.partner?.name || 'نەناسراو'}</strong></p>
                        <p>${currentPartner.request.languageToTeach} ↔️ ${currentPartner.request.languageToLearn}</p>
                        <button class="btn btn-danger btn-block" onclick="cancelPartner()">
                            پاشڤەدانا هەڤالیێ
                        </button>
                    </div>
                ` : `
                    <!-- فۆرما داوانێ -->
                    <p style="color:#64748b;">زمانێ خۆ و زمانێ دڤێت فێر ببی هەلبژێرە</p>
                    
                    <div class="form-group">
                        <label>زمانێ ئەز دشێم فێری کەم:</label>
                        <select id="partnerTeachLang" style="width:100%; padding:0.75rem; border:1px solid #e2e8f0; border-radius:8px;">
                            <option value="ku-BHD">کوردی بەهدینی</option>
                            <option value="ku-SOR">کوردی سۆرانی</option>
                            <option value="en">English</option>
                            <option value="ar">العربية</option>
                            <option value="tr">Türkçe</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>زمانێ ئەز دڤێت فێر بم:</label>
                        <select id="partnerLearnLang" style="width:100%; padding:0.75rem; border:1px solid #e2e8f0; border-radius:8px;">
                            <option value="en">English</option>
                            <option value="ku-BHD">کوردی بەهدینی</option>
                            <option value="ku-SOR">کوردی سۆرانی</option>
                            <option value="ar">العربية</option>
                            <option value="tr">Türkçe</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>پەیام (ئۆپشنەل):</label>
                        <textarea id="partnerMessage" rows="3" placeholder="چەند وشەیەک دەربارەی خۆ..."
                                  style="width:100%; padding:0.75rem; border:1px solid #e2e8f0; border-radius:8px;"></textarea>
                    </div>
                    
                    <button class="btn btn-primary btn-block" onclick="submitPartnerRequest()">
                        <i class="fas fa-search"></i> هەڤالەکی بدۆشە
                    </button>
                `}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('partnerModal').style.display = 'flex';
}

function submitPartnerRequest() {
    const teachLang = document.getElementById('partnerTeachLang').value;
    const learnLang = document.getElementById('partnerLearnLang').value;
    const message = document.getElementById('partnerMessage').value;
    
    if (teachLang === learnLang) {
        alert('⚠️ زمانێ فێردکەی و زمانێ دڤێت فێر ببی نەبیت هەمان زمان!');
        return;
    }
    
    const result = partnerSystem.requestPartner(
        auth.getCurrentUser().id,
        learnLang,
        teachLang,
        message
    );
    
    if (result) {
        if (result.status === 'matched') {
            alert('🎉 هەڤالەکا فێربوونێ هاتە دیتن!');
        } else {
            alert('✅ داوانا تە هاتە تومارکرن. دێ ئاگەهداری بیت دەمێ هەڤالەک بهێتە دیتن.');
        }
        closeModal('partnerModal');
    }
}

function cancelPartner() {
    if (confirm('ئەرێ تە دڤێت هەڤالا فێربوونێ پاشڤە بدەی؟')) {
        partnerSystem.cancelRequest(auth.getCurrentUser().id);
        alert('✅ هەڤالی هاتە پاشڤەدان.');
        closeModal('partnerModal');
    }
}

console.log('👥 سیستەمێ هەڤالکا فێربوونێ ئامادەیە!');