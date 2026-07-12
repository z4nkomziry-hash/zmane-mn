// ============================================
// ZIMANÊ MIN - Core Application Framework
// ============================================

'use strict';

// ========== ERROR HANDLING ==========
class AppError extends Error {
    constructor(message, type = 'error', code = 'UNKNOWN') {
        super(message);
        this.name = 'AppError';
        this.type = type;
        this.code = code;
        this.timestamp = new Date().toISOString();
    }
}

// Global Error Boundary
window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error);
    showErrorBoundary(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise:', event.reason);
    showErrorBoundary(event.reason);
});

function showErrorBoundary(error) {
    const boundary = document.getElementById('errorBoundary');
    if (boundary) {
        boundary.style.display = 'flex';
        boundary.querySelector('p').textContent = error?.message || 'هەڵەیەک ڕویدا';
    }
}

// ========== TOAST SYSTEM ==========
class ToastSystem {
    static container = null;
    
    static init() {
        this.container = document.getElementById('toastContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toastContainer';
            this.container.className = 'toast-container';
            this.container.setAttribute('aria-live', 'polite');
            this.container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(this.container);
        }
    }
    
    static show(message, type = 'info', duration = 5000) {
        if (!this.container) this.init();
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}" aria-hidden="true"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()" aria-label="داخستن">&times;</button>
        `;
        
        this.container.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => toast.classList.add('toast-visible'));
        
        // Auto remove
        setTimeout(() => {
            toast.classList.remove('toast-visible');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    static success(message) { this.show(message, 'success'); }
    static error(message) { this.show(message, 'error'); }
    static warning(message) { this.show(message, 'warning'); }
    static info(message) { this.show(message, 'info'); }
}

// Initialize
ToastSystem.init();

// ========== LOADING SYSTEM ==========
class LoadingSystem {
    static show(message = 'تکایە چاڤەرێ بە...') {
        const loader = document.getElementById('loadingScreen');
        if (loader) {
            loader.querySelector('p').textContent = message;
            loader.style.display = 'flex';
        }
    }
    
    static hide() {
        const loader = document.getElementById('loadingScreen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                loader.style.opacity = '1';
            }, 300);
        }
    }
}

// ========== OFFLINE DETECTION ==========
class OfflineManager {
    static init() {
        window.addEventListener('online', () => this.updateStatus());
        window.addEventListener('offline', () => this.updateStatus());
        this.updateStatus();
    }
    
    static updateStatus() {
        const banner = document.getElementById('offlineBanner');
        if (!banner) return;
        
        if (navigator.onLine) {
            banner.style.display = 'none';
        } else {
            banner.style.display = 'flex';
        }
    }
}

OfflineManager.init();

// ========== SERVICE WORKER UPDATE ==========
class SWUpdater {
    static init() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js').then(reg => {
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdatePrompt();
                        }
                    });
                });
            });
        }
    }
    
    static showUpdatePrompt() {
        const prompt = document.getElementById('updatePrompt');
        if (prompt) prompt.style.display = 'block';
    }
    
    static updateApp() {
        navigator.serviceWorker.ready.then(reg => {
            reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
        });
        window.location.reload();
    }
}

SWUpdater.init();

// ========== UTILITY FUNCTIONS ==========
const Utils = {
    debounce(fn, delay = 300) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    },
    
    throttle(fn, limit = 300) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                fn(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },
    
    formatDate(date) {
        return new Date(date).toLocaleDateString('ckb', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    },
    
    formatTimeAgo(date) {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (mins < 1) return 'ئێستا';
        if (mins < 60) return `${mins} خولەک`;
        if (hours < 24) return `${hours} ساعەت`;
        if (days < 7) return `${days} رۆژ`;
        return this.formatDate(date);
    },
    
    generateId() {
        return 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise((resolve, reject) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                resolve();
            } catch (err) {
                reject(err);
            }
            document.body.removeChild(textarea);
        });
    }
};

// ========== KEYBOARD SHORTCUTS ==========
class KeyboardShortcuts {
    static init() {
        document.addEventListener('keydown', (e) => {
            // Escape - Close modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal[style*="flex"]').forEach(m => {
                    m.style.display = 'none';
                });
            }
            
            // Ctrl+K - Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('uiLanguage')?.focus();
            }
            
            // Ctrl+/ - Show shortcuts
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                ToastSystem.info('شۆرتباز: Esc=داخستن, Ctrl+K=گەڕان');
            }
        });
    }
}

KeyboardShortcuts.init();

// ========== PERFORMANCE OBSERVER ==========
class PerformanceMonitor {
    static init() {
        if ('PerformanceObserver' in window) {
            // LCP
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            
            // FID
            new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            }).observe({ type: 'first-input', buffered: true });
            
            // CLS
            new PerformanceObserver((list) => {
                let clsValue = 0;
                list.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) clsValue += entry.value;
                });
                console.log('CLS:', clsValue);
            }).observe({ type: 'layout-shift', buffered: true });
        }
    }
}

PerformanceMonitor.init();

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Zimanê Min Core Initialized');
    
    // Hide loading screen
    setTimeout(LoadingSystem.hide, 800);
    
    // Initialize auth check
    if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
        updateUIForLoggedIn();
    }
    
    // Load saved language
    if (typeof changeUILanguage === 'function') {
        const savedLang = localStorage.getItem('uiLanguage') || 'ku-BHD';
        changeUILanguage(savedLang);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ToastSystem,
        LoadingSystem,
        Utils,
        AppError
    };
}

console.log('✅ Core Framework Loaded');
