// payment.js - پارەدان ب FIB, FastPay, USDT

let selectedPaymentMethod = null;
let currentPackage = null;

// کرینا پاکێجێ
function buyPackage(packageType) {
    if (!auth.isLoggedIn()) {
        alert('🛑 دەبیت ئێکێ چوویە ژوور بو کرینا پاکێجێ!');
        showLoginForm();
        return;
    }
    
    currentPackage = packageType;
    
    // نیشاندانا پاکێجا هەلبژارتی
    const packageInfo = PLATFORM_CONFIG.packages[packageType];
    document.getElementById('selectedPackageInfo').innerHTML = `
        <div class="selected-package-card">
            <strong>${packageInfo.name}</strong> - $${packageInfo.price}
        </div>
    `;
    
    document.getElementById('paymentModal').style.display = 'flex';
}

// هەلبژارتنا رێکا پارەدانێ
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // ڤەشارتنا هەمی دیتایان
    document.querySelectorAll('.payment-info').forEach(el => el.style.display = 'none');
    
    // نیشاندانا دیتایێن هەلبژارتی
    switch(method) {
        case 'FIB':
            document.getElementById('fibDetails').style.display = 'block';
            break;
        case 'FastPay':
            document.getElementById('fastpayDetails').style.display = 'block';
            break;
        case 'USDT':
            document.getElementById('usdtDetails').style.display = 'block';
            break;
    }
    
    document.getElementById('paymentDetails').style.display = 'block';
}

// رەوانەکرنا پارەدانێ
async function submitPayment() {
    if (!selectedPaymentMethod) {
        alert('⚠️ تکایە رێکەکا پارەدانێ هەلبژێرە!');
        return;
    }
    
    const user = auth.getCurrentUser();
    const paymentData = {
        id: 'pay_' + Date.now(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        package: currentPackage,
        method: selectedPaymentMethod,
        amount: PLATFORM_CONFIG.packages[currentPackage].price,
        status: 'pending',
        timestamp: new Date().toISOString(),
        proofImage: null,
        txHash: null
    };
    
    // تومارکرنا بەلگەیا پارەدانێ
    switch(selectedPaymentMethod) {
        case 'FIB':
            const fibProof = document.getElementById('fibPaymentProof');
            if (fibProof.files[0]) {
                paymentData.proofImage = await convertToBase64(fibProof.files[0]);
            }
            break;
        case 'FastPay':
            const fastpayProof = document.getElementById('fastpayPaymentProof');
            if (fastpayProof.files[0]) {
                paymentData.proofImage = await convertToBase64(fastpayProof.files[0]);
            }
            break;
        case 'USDT':
            paymentData.txHash = document.getElementById('txHash').value;
            if (!paymentData.txHash) {
                alert('🔗 TX Hash پێدڤیە!');
                return;
            }
            break;
    }
    
    // تومارکرنا پارەدانێ
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    payments.push(paymentData);
    localStorage.setItem('payments', JSON.stringify(payments));
    
    alert('✅ پارەدانا تە ب سەرکەفتیانە هاتە تومارکرن!\n\nپشکنین دێ بهێتە کرن و پاکێجا تە دێ ئەکتیڤ بیت.\n\nژمارا پارەدانێ: ' + paymentData.id);
    
    closeModal('paymentModal');
}

// گوهۆڕینا وێنەیێ بو Base64
function convertToBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

// نیشاندانا وێنەیێ
function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById(previewId).src = e.target.result;
            document.getElementById(previewId).style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// کۆپیکرن
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('📋 هاتە کۆپیکرن!');
    });
}

// دەستپێکرنا پلانا بێ پارە
function startFreePlan() {
    if (!auth.isLoggedIn()) {
        showRegisterForm();
        return;
    }
    alert('✅ پلانا بێ پارە یا چالاکە! دەستپێبکە فێربوونێ.');
    window.location.href = '#courses';
}