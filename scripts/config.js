// config.js - زانیاریێن تایبەت ب تە و پارەدانا تە
const PLATFORM_CONFIG = {
    // زانیاریێن پارەدانێ
    payment: {
        FIB: {
            accountNumber: '+964 750 604 5491',
            accountName: 'Zimanê Min Platform',
            bankName: 'FIB Iraq',
            instructions: 'پارەدانێ بکە ب ڤێ ژمارێ و وێنەیێ پارەدانێ بارکە'
        },
        FastPay: {
            phoneNumber: '+964 750 604 5491',
            accountName: 'Zimanê Min Platform',
            instructions: 'پارەدانێ ب FastPay بکە ب ڤێ ژمارێ'
        },
        USDT: {
            network: 'TRC20',
            address: 'TKUfVwnjyT2KUa9xnBreT32YLLJEwACHpc',
            instructions: 'USDT ب شێوەیێ TRC20 ب رەوانە بکە ب ڤێ ناڤنیشانێ'
        }
    },
    
    // ناڤێ پلاتفۆرمێ
    platformName: 'Zimanê Min',
    platformEmail: 'info@zimanemin.com',
    
    // نرخێن پاکێجان
    packages: {
        premium: { name: 'پرێمیۆم', price: 9.99, currency: 'USD', duration: 'monthly' },
        family: { name: 'خێزان', price: 19.99, currency: 'USD', duration: 'monthly' },
        lifetime: { name: 'هەروهەر', price: 149.99, currency: 'USD', duration: 'lifetime' }
    }
};

// هەژمارا ئادمین (بو دروستکرنا کودان)
const ADMIN_CONFIG = {
    username: 'admin',
    password: 'zimanemin2026', // ڤێ پاشڤە biguhere!
    secretKey: 'ZM-ADMIN-KEY-2026'
};

console.log('✅ کۆنفیگ باربوو!');