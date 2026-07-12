// config.js - زانیاریێن گشتی و رێکخستنێن پارەدانێ
const PLATFORM_CONFIG = {
    platformName: 'Zimanê Min',
    platformEmail: 'info@zimanemin.com',
    version: '3.0.0',
    
    payment: {
        FIB: {
            accountNumber: '+964 750 604 5491',
            accountName: 'Zimanê Min Platform',
            bankName: 'FIB Iraq',
            instructions: 'پارەدانێ بکە ب ڤێ ژمارێ و وێنەیێ وەسلی بارکە.'
        },
        FastPay: {
            phoneNumber: '+964 750 604 5491',
            accountName: 'Zimanê Min Platform',
            instructions: 'پارەدانێ ب FastPay بکە ب ڤێ ژمارێ.'
        },
        USDT: {
            network: 'TRC20',
            address: 'TKUfVwnjyT2KUa9xnBreT32YLLJEwACHpc',
            instructions: 'تکایە ب دروستی ل سەر تۆرێ TRC20 فڕێکە.'
        }
    },
    
    packages: {
        premium: { id: 'p_monthly', name: 'پرێمیۆم', price: 9.99, currency: 'USD', duration: 'monthly' },
        family: { id: 'p_family', name: 'خێزان', price: 19.99, currency: 'USD', duration: 'monthly' }
    }
};
