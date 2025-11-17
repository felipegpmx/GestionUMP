/* ====================================
   MÓDULO DE GESTIÓN DE USUARIOS
   ==================================== */

const Users = {
    users: [
        { username: 'admin', password: 'admin', role: 'admin', name: 'Administrador' },
        { username: 'editor', password: 'editor', role: 'editor', name: 'Editor' },
        { username: 'viewer', password: 'viewer', role: 'viewer', name: 'Visualizador' }
    ],

    init() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                App.data.currentUser = JSON.parse(savedUser);
                Users.updateUI();
            } catch (e) {
                console.error('Error al cargar usuario:', e);
            }
        }
    },

    showLoginModal() {
        if (App.data.currentUser) {
            Users.showUserMenu();
        } else {
            const modal = document.getElementById('modalLogin');
            if (modal) {
                modal.style.display = 'block';
                modal.setAttribute('aria-hidden', 'false');
            }
        }
    },

    closeLoginModal() {
        const modal = document.getElementById('modalLogin');
        if (modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
    },

    login(username, password) {
        const user = Users.users.find(u => 
            u.username === username && u.password === password
        );

        if (user) {
            App.data.currentUser = {
                username: user.username,
                role: user.role,
                name: user.name,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem('currentUser', JSON.stringify(App.data.currentUser));
            Users.updateUI();
            Users.closeLoginModal();

            App.toast(`✅ Bienvenido, ${user.name}!`, 'success');
            Notifications.add(`👋 ${user.name} ha iniciado sesión`, 'info');

            return true;
        } else {
            App.toast('❌ Usuario o contraseña incorrectos', 'error');
            return false;
        }
    },

    logout() {
        if (confirm('¿Cerrar sesión?')) {
            const userName = App.data.currentUser ? App.data.currentUser.name : 'Usuario';
            App.data.currentUser = null;
            localStorage.removeItem('currentUser');
            Users.updateUI();

            App.toast(`👋 Hasta pronto, ${userName}`, 'info');
            Notifications.add(`🚪 ${userName} ha cerrado sesión`, 'info');
        }
    },

    updateUI() {
        const userDisplay = document.getElementById('userDisplay');
        if (!userDisplay) return;

        if (App.data.currentUser) {
            userDisplay.innerHTML = `
                <span style="display: flex; align-items: center; gap: 5px;">
                    ${Users.getRoleIcon(App.data.currentUser.role)}
                    ${App.data.currentUser.name}
                </span>
            `;
        } else {
            userDisplay.textContent = '👤 Invitado';
        }
    },

    getRoleIcon(role) {
        const icons = {
            admin: '👑',
            editor: '✏️',
            viewer: '👁️'
        };
        return icons[role] || '👤';
    },

    showUserMenu() {
        const menu = document.createElement('div');
        menu.className = 'user-menu-dropdown';
        menu.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            padding: 10px;
            z-index: 1001;
            min-width: 200px;
        `;

        menu.innerHTML = `
            <div style="padding: 10px; border-bottom: 1px solid var(--border-color);">
                <strong>${App.data.currentUser.name}</strong><br>
                <small style="color: var(--text-secondary);">Rol: ${App.data.currentUser.role}</small>
            </div>
            <button class="btn-secondary" style="width: 100%; margin-top: 10px;" onclick="Users.logout(); this.closest('.user-menu-dropdown').remove();">
                🚪 Cerrar Sesión
            </button>
        `;

        document.body.appendChild(menu);

        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    },

    hasPermission(action) {
        if (!App.data.currentUser) return true;

        const permissions = {
            admin: ['create', 'edit', 'delete', 'export', 'manage_points'],
            editor: ['create', 'edit', 'export'],
            viewer: ['export']
        };

        const userPermissions = permissions[App.data.currentUser.role] || [];
        return userPermissions.includes(action);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            Users.login(username, password);
        });
    }

    Users.init();
});