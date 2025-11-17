/* ====================================
   MÓDULO DE NOTIFICACIONES
   ==================================== */

const Notifications = {
    notifications: [],
    maxNotifications: 50,

    init() {
        Notifications.load();
        Notifications.render();
        Notifications.checkThresholds();
    },

    add(message, type = 'info', persist = true) {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false
        };

        Notifications.notifications.unshift(notification);

        if (Notifications.notifications.length > Notifications.maxNotifications) {
            Notifications.notifications = Notifications.notifications.slice(0, Notifications.maxNotifications);
        }

        if (persist) {
            Notifications.save();
        }

        Notifications.render();
        Notifications.updateBadge();

        App.toast(message, type);
    },

    render() {
        const container = document.getElementById('notificationList');
        if (!container) return;

        if (Notifications.notifications.length === 0) {
            container.innerHTML = `
                <div style="padding: 30px; text-align: center; color: var(--text-muted);">
                    <p>📭 No hay notificaciones</p>
                </div>
            `;
            return;
        }

        container.innerHTML = Notifications.notifications.map(n => `
            <div class="notification-item ${!n.read ? 'unread' : ''}" 
                 data-id="${n.id}"
                 onclick="Notifications.markAsRead(${n.id})">
                <div style="display: flex; align-items: start; gap: 10px;">
                    <span style="font-size: 20px;">
                        ${Notifications.getIcon(n.type)}
                    </span>
                    <div style="flex: 1;">
                        <p style="margin: 0; font-size: 14px;">${n.message}</p>
                        <div class="time">${Notifications.formatTime(n.timestamp)}</div>
                    </div>
                </div>
            </div>
        `).join('');
    },

    getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    },

    formatTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours}h`;
        if (days < 7) return `Hace ${days}d`;
        
        return time.toLocaleDateString('es-CL');
    },

    markAsRead(id) {
        const notification = Notifications.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            Notifications.save();
            Notifications.render();
            Notifications.updateBadge();
        }
    },

    markAllAsRead() {
        Notifications.notifications.forEach(n => n.read = true);
        Notifications.save();
        Notifications.render();
        Notifications.updateBadge();
    },

    clearAll() {
        if (confirm('¿Eliminar todas las notificaciones?')) {
            Notifications.notifications = [];
            Notifications.save();
            Notifications.render();
            Notifications.updateBadge();
        }
    },

    updateBadge() {
        const badge = document.getElementById('notificationCount');
        if (!badge) return;

        const unread = Notifications.notifications.filter(n => !n.read).length;
        badge.textContent = unread;
        badge.style.display = unread > 0 ? 'flex' : 'none';
    },

    togglePanel() {
        const panel = document.getElementById('notificationPanel');
        if (!panel) return;

        panel.classList.toggle('hidden');

        if (!panel.classList.contains('hidden')) {
            setTimeout(() => {
                Notifications.markAllAsRead();
            }, 2000);
        }
    },

    save() {
        try {
            localStorage.setItem('notifications', JSON.stringify(Notifications.notifications));
        } catch (e) {
            console.error('Error al guardar notificaciones:', e);
        }
    },

    load() {
        try {
            const saved = localStorage.getItem('notifications');
            if (saved) {
                Notifications.notifications = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error al cargar notificaciones:', e);
        }
    },

    checkThresholds() {
        if (App.data.registros.length === 0) return;

        const today = new Date().toISOString().split('T')[0];
        const todayControls = App.data.registros.filter(r => r.fecha === today);

        const todayInfracciones = todayControls.reduce((sum, r) => sum + r.vehiculosInfraccionados, 0);
        const todayControlados = todayControls.reduce((sum, r) => sum + r.vehiculosControlados, 0);

        if (todayControlados > 0) {
            const porcentaje = (todayInfracciones / todayControlados) * 100;
            if (porcentaje > 30) {
                Notifications.add(
                    `⚠️ Alto porcentaje de infracciones hoy: ${porcentaje.toFixed(1)}%`,
                    'warning',
                    false
                );
            }
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

        const puntosActivos = new Set(
            App.data.registros
                .filter(r => r.fecha >= thirtyDaysAgoStr)
                .map(r => r.puntoControl)
        );

        const puntosSinControles = Object.keys(App.data.puntos)
            .filter(p => p !== 'CALIBRACION' && !puntosActivos.has(p))
            .length;

        if (puntosSinControles > 0) {
            Notifications.add(
                `📍 ${puntosSinControles} punto(s) sin controles en 30 días`,
                'info',
                false
            );
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        Notifications.init();
    }, 1000);
});