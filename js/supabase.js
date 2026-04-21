const supabaseUrl = 'https://oicvhrzqascurskwgirq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pY3ZocnpxYXNjdXJza3dnaXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODQ0NDgsImV4cCI6MjA5MjE2MDQ0OH0.2BQcdjjyO2NmlElKOx27DBEVHtIHRNMa9h4SqxLFQlQ';

window.sb = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

let currentUser = null;

function openLoginModal() {
    const existingModal = document.getElementById('loginModal');
    if (existingModal) existingModal.remove();

    const modalHtml = `
        <div id="loginModal" class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" onclick="closeLoginModal()">&times;</button>
                <div id="authTabs">
                    <button class="auth-tab active" onclick="switchAuthTab('login')">登录</button>
                    <button class="auth-tab" onclick="switchAuthTab('register')">注册</button>
                </div>
                <div id="loginForm">
                    <input type="email" id="loginEmail" placeholder="邮箱">
                    <input type="password" id="loginPassword" placeholder="密码">
                    <button onclick="handleLogin()" class="auth-submit">登录</button>
                    <p id="loginError" class="error-text"></p>
                </div>
                <div id="registerForm" style="display: none;">
                    <input type="text" id="registerName" placeholder="名字">
                    <input type="email" id="registerEmail" placeholder="邮箱">
                    <input type="password" id="registerPassword" placeholder="密码（至少6位）">
                    <button onclick="handleRegister()" class="auth-submit">注册</button>
                    <p id="registerError" class="error-text"></p>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.remove();
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    if (tab === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        document.querySelectorAll('.auth-tab')[0].classList.add('active');
    } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
    }
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = '';

    const { data, error } = await window.sb.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        errorEl.textContent = '登录失败：' + error.message;
    } else {
        currentUser = data.user;
        updateLoginButton();
        closeLoginModal();
    }
}

async function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorEl = document.getElementById('registerError');
    errorEl.textContent = '';

    if (!name) {
        errorEl.textContent = '请输入名字';
        return;
    }

    const { data, error } = await window.sb.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: name
            }
        }
    });

    if (error) {
        errorEl.textContent = '注册失败：' + error.message;
    } else {
        currentUser = data.user;
        updateLoginButton();
        closeLoginModal();
    }
}

function openProfileModal() {
    closeUserMenu();
    const existingModal = document.getElementById('profileModal');
    if (existingModal) existingModal.remove();

    const userName = currentUser.user_metadata?.name || '';

    const modalHtml = `
        <div id="profileModal" class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" onclick="closeProfileModal()">&times;</button>
                <h2 style="margin-bottom: 20px; font-size: 24px; font-weight: bold;">My Profile</h2>
                <div id="profileForm">
                    <input type="text" id="profileName" placeholder="名字" value="${userName}">
                    <input type="email" id="profileEmail" placeholder="邮箱" value="${currentUser.email}" readonly style="background-color: #f3f4f6; cursor: not-allowed;">
                    <button onclick="handleProfileUpdate()" class="auth-submit">保存修改</button>
                    <p id="profileError" class="error-text"></p>
                    <p id="profileSuccess" class="success-text" style="display: none;"></p>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.remove();
}

async function handleProfileUpdate() {
    const name = document.getElementById('profileName').value;
    const errorEl = document.getElementById('profileError');
    const successEl = document.getElementById('profileSuccess');
    errorEl.textContent = '';
    successEl.style.display = 'none';

    if (!name) {
        errorEl.textContent = '请输入名字';
        return;
    }

    const { data, error } = await window.sb.auth.updateUser({
        data: { name: name }
    });

    if (error) {
        errorEl.textContent = '更新失败：' + error.message;
    } else {
        currentUser = data.user;
        updateLoginButton();
        successEl.textContent = '修改成功！';
        successEl.style.display = 'block';
        setTimeout(() => {
            closeProfileModal();
        }, 1500);
    }
}

function updateLoginButton() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        if (currentUser) {
            const userName = currentUser.user_metadata?.name || currentUser.email.split('@')[0];
            loginBtn.textContent = userName;
            loginBtn.onclick = toggleUserMenu;
        } else {
            loginBtn.textContent = '注册/登录';
            loginBtn.onclick = openLoginModal;
        }
    }
}

function toggleUserMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    const existingMenu = document.getElementById('userDropdown');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    const menu = document.createElement('div');
    menu.id = 'userDropdown';
    menu.className = 'fixed bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[200px] z-50';
    menu.style.top = '70px';
    menu.style.right = '20px';
    const userName = currentUser.user_metadata?.name || currentUser.email.split('@')[0];
    menu.innerHTML = `
        <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-xs text-gray-500 mb-1">已登录</p>
            <p class="font-semibold text-gray-800 truncate">${userName}</p>
        </div>
        <a href="#" onclick="openProfileModal(); return false;" class="block px-5 py-3 hover:bg-purple-50 text-gray-700 transition-colors">
            <span class="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333EA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
                My Profile
            </span>
        </a>
        <a href="my-uploads.html" class="block px-5 py-3 hover:bg-blue-50 text-gray-700 transition-colors">
            <span class="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
                我的上传
            </span>
        </a>
        <a href="my-favorites.html" class="block px-5 py-3 hover:bg-orange-50 text-gray-700 transition-colors">
            <span class="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                我的收藏
            </span>
        </a>
        <a href="#" onclick="handleLogout()" class="block px-5 py-3 hover:bg-red-50 text-red-600 transition-colors border-t border-gray-100">
            <span class="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17,21,12,16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Log Out
            </span>
        </a>
    `;
    document.body.appendChild(menu);
    document.addEventListener('click', closeUserMenu);
}

function closeUserMenu() {
    const menu = document.getElementById('userDropdown');
    if (menu) menu.remove();
    document.removeEventListener('click', closeUserMenu);
}

async function handleLogout() {
    closeUserMenu();
    const { error } = await window.sb.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
    }
    window.location.reload();
}

window.sb.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    updateLoginButton();
    if (event === 'SIGNED_IN') {
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
    }
});

window.sb.auth.getSession().then(({ data: { session } }) => {
    currentUser = session?.user || null;
    updateLoginButton();
});
