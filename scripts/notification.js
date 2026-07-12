// notifications.js - سیستەمێ ئاگەهداری و نۆتیفیکەیشنان

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.loadNotifications();
    }
    
    // بارکرنا نۆتیفیکەیشنان
    loadNotifications() {
        const saved = localStorage.getItem('userNotifications');
        this.notifications = saved ? JSON.parse(saved) : [];
    }
    
    // پاراستنا نۆتیفیکەیشنان
    saveNotifications() {
        localStorage.setItem('userNotifications', JSON.stringify(this.notifications));
    }
    
    // زێدەکرنا نۆتیفیکەیشنەکێ
    addNotification(userId, type, title, message, icon = 'fas fa-bell') {
        const notification = {
            id: 'notif_' + Date.now(),
            userId: userId,
            type: type, // 'achievement', 'streak', 'payment', 'system', 'reminder'
            title: title,
            message: message,
            icon: icon,
            read: false,
            createdAt: new Date().toISOString()
        };
        
        this.notifications.unshift(notification);
        
        // پاراستنا تەنێ ٥٠ نۆتیفیکەیشنێن دویماهیێ
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }
        
        this.saveNotifications();
        this.updateNotificationBadge();
        
        // نیشاندانا نۆتیفیکەیشنێ ئەگەر پەڕێ ڤەکری بیت
        this.showToast(notification);
        
        return notification;
    }
    
    // وەرگرتنا نۆتیفیکەیشنێن بکارهێنەرەکی
    getNotifications(userId) {
        return this.notifications.filter(n => n.userId === userId);
    }
    
    // وەرگرتنا نۆتیفیکەیشنێن نەخوێندایی
    getUnreadCount(userId) {
        return this.notifications.filter(n => n.userId === userId && !n.read).length;
    }
    
    // نیشانکرنا وەک خوێندایی
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationBadge();
        }
    }
    
    // نیشانکرنا هەمیان وەک خوێندایی
    markAllAsRead(userId) {
        this.notifications.forEach(n => {
            if (n.userId === userId) {
                n.read = true;
            }
        });
        this.saveNotifications();
        this.updateNotificationBadge();
    }
    
    // ژێبرنا نۆتیفیکەیشنەکی
    deleteNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
        this.updateNotificationBadge();
    }
    
    // نویکرنا بەجێ
    updateNotificationBadge() {
        if (!auth.isLoggedIn()) return;
        
        const userId = auth.getCurrentUser().id;
        const unreadCount = this.getUnreadCount(userId);
        
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
        
        const bellIcon = document.getElementById('notificationBell');
        if (bellIcon) {
            if (unreadCount > 0) {
                bellIcon.classList.add('has-notifications');
            } else {
                bellIcon.classList.remove('has-notifications');
            }
        }
    }
    
    // نیشاندانا نۆتیفیکەیشنەکا بچویک (Toast)
    showToast(notification) {
        // تەنێ ئەگەر پەڕێ ڤەکری بیت و بکارهێنەر چوویە ژوور
        if (!auth.isLoggedIn()) return;
        if (auth.getCurrentUser().id !== notification.userId) return;
        
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="${notification.icon}"></i>
                <div>
                    <strong>${notification.title}</strong>
                    <p>${notification.message}</p>
                </div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // ئەنیمەیشن
        setTimeout(() => toast.classList.add('show'), 100);
        
        // ژێبرن پشتی ٥ چرکەیان
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }
    
    // ئاگەهداریا رۆژانە (Strek reminder)
    sendStreakReminder(userId) {
        const user = JSON.parse(localStorage.getItem('users') || '[]').find(u => u.id === userId);
        if (!user) return;
        
        const lastActive = new Date(user.lastActive || user.createdAt);
        const today = new Date();
        const diffHours = (today - lastActive) / (1000 * 60 * 60);
        
        if (diffHours > 20) {
            this.addNotification(
                userId,
                'reminder',
                '🔥 رۆژا خۆ بەردەوام بکە!',
                'ئەمڕۆ هنژی تە فێربوون نەکردیە. وەرە بو پاراستنا رێژا بەردەوامبوونێ!',
                'fas fa-fire'
            );
        }
    }
    
    // ئاگەهداریا ئەنجامی
    sendAchievementNotification(userId, achievementName) {
        this.addNotification(
            userId,
            'achievement',
            '🏆 ئەنجام هاتە ڤەکرن!',
            `تە ئەنجامێ "${achievementName}" بەدەستئینا! پیرۆزە!`,
            'fas fa-trophy'
        );
    }
    
    // ئاگەهداریا پارەدانێ
    sendPaymentNotification(userId, status, packageName) {
        const statusMessages = {
            'approved': '✅ پارەدانا تە هاتە قبولکرن!',
            'rejected': '❌ پارەدانا تە نەهاتیە قبولکرن.',
            'pending': '⏳ پارەدانا تە د چاڤەرێدا یە.'
        };
        
        this.addNotification(
            userId,
            'payment',
            statusMessages[status] || 'پارەدان',
            `پاکێجا ${packageName} - ڕەوش: ${status}`,
            'fas fa-credit-card'
        );
    }
}

const notificationSystem = new NotificationSystem();

// --- CSS بو نۆتیفیکەیشنان ---
const notificationStyles = `
/* بەجێ (Badge) */
.notification-btn {
    position: relative;
    cursor: pointer;
}

.notification-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ef4444;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 0.7rem;
    display: none;
    align-items: center;
    justify-content: center;
    font-weight: 700;
}

.notification-bell.has-notifications {
    animation: bellRing 2s infinite;
}

@keyframes bellRing {
    0%, 100% { transform: rotate(0); }
    10%, 30% { transform: rotate(15deg); }
    20%, 40% { transform: rotate(-15deg); }
    50% { transform: rotate(0); }
}

/* درۆپداونا نۆتیفیکەیشنان */
.notifications-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    width: 380px;
    max-height: 500px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
    border: 1px solid #e2e8f0;
}

.notifications-dropdown.show {
    display: block;
    animation: slideDown 0.3s ease;
}

.notifications-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
}

.notifications-header h3 {
    margin: 0;
    font-size: 1.1rem;
}

.notifications-list {
    padding: 0.5rem;
}

.notification-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border-radius: 8px;
    transition: all 0.2s;
    cursor: pointer;
    border-bottom: 1px solid #f1f5f9;
}

.notification-item:hover {
    background: #f8fafc;
}

.notification-item.unread {
    background: #eef2ff;
    border-right: 3px solid #6366f1;
}

.notification-item i {
    font-size: 1.5rem;
    color: #6366f1;
    margin-top: 0.2rem;
}

.notification-content {
    flex: 1;
}

.notification-content strong {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.95rem;
}

.notification-content p {
    color: #64748b;
    font-size: 0.85rem;
    margin: 0;
}

.notification-time {
    color: #94a3b8;
    font-size: 0.75rem;
    margin-top: 0.25rem;
}

.notification-empty {
    text-align: center;
    padding: 2rem;
    color: #94a3b8;
}

.notification-empty i {
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
}

/* تۆست */
.notification-toast {
    position: fixed;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    padding: 1rem;
    z-index: 9999;
    transition: top 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    min-width: 350px;
    border-right: 4px solid #6366f1;
}

.notification-toast.show {
    top: 20px;
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.toast-content i {
    font-size: 2rem;
    color: #6366f1;
}

.toast-content strong {
    display: block;
}

.toast-content p {
    color: #64748b;
    font-size: 0.9rem;
    margin: 0;
}

.toast-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #94a3b8;
    padding: 0 0.5rem;
}

@media (max-width: 600px) {
    .notifications-dropdown {
        width: 300px;
        right: -50px;
    }
    
    .notification-toast {
        min-width: 300px;
    }
}
`;

const notifStyleElement = document.createElement('style');
notifStyleElement.textContent = notificationStyles;
document.head.appendChild(notifStyleElement);

// --- فەنکشنێن UI ---

function toggleNotifications() {
    const dropdown = document.getElementById('notificationsDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
        if (dropdown.classList.contains('show')) {
            renderNotifications();
        }
    }
}

function renderNotifications() {
    if (!auth.isLoggedIn()) return;
    
    const userId = auth.getCurrentUser().id;
    const notifications = notificationSystem.getNotifications(userId);
    const container = document.getElementById('notificationsList');
    
    if (!container) return;
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="notification-empty">
                <i class="fas fa-bell-slash"></i>
                <p>چ نۆتیفیکەیشن نینن</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = notifications.map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'}" 
             onclick="markNotificationRead('${n.id}')">
            <i class="${n.icon}"></i>
            <div class="notification-content">
                <strong>${n.title}</strong>
                <p>${n.message}</p>
                <div class="notification-time">${formatTimeAgo(n.createdAt)}</div>
            </div>
            <button class="toast-close" onclick="event.stopPropagation(); deleteNotification('${n.id}')">&times;</button>
        </div>
    `).join('');
}

function markNotificationRead(notificationId) {
    notificationSystem.markAsRead(notificationId);
    renderNotifications();
}

function markAllNotificationsRead() {
    if (!auth.isLoggedIn()) return;
    notificationSystem.markAllAsRead(auth.getCurrentUser().id);
    renderNotifications();
}

function deleteNotification(notificationId) {
    notificationSystem.deleteNotification(notificationId);
    renderNotifications();
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'ئێستا';
    if (diffMins < 60) return `${diffMins} خولەک بەری ڤە`;
    if (diffHours < 24) return `${diffHours} ساعەت بەری ڤە`;
    if (diffDays < 7) return `${diffDays} رۆژ بەری ڤە`;
    return date.toLocaleDateString('ckb');
}

console.log('🔔 سیستەمێ نۆتیفیکەیشنان ئامادەیە!');