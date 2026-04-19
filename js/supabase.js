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
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorEl = document.getElementById('registerError');
    errorEl.textContent = '';

    const { data, error } = await window.sb.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        errorEl.textContent = '注册失败：' + error.message;
    } else {
        currentUser = data.user;
        if (data.user) {
            const { error: dbError } = await window.sb.from('users').insert({
                id: data.user.id,
                email: data.user.email,
                created_at: new Date().toISOString()
            });
        }
        updateLoginButton();
        closeLoginModal();
    }
}

function updateLoginButton() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        if (currentUser) {
            loginBtn.textContent = currentUser.email.split('@')[0];
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
    menu.className = 'fixed bg-white rounded-xl shadow-xl border-2 border-gray-200 py-2 min-w-[180px] z-50';
    menu.style.top = '70px';
    menu.style.right = '20px';
    menu.innerHTML = `
        <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-sm text-gray-500">已登录</p>
            <p class="font-semibold text-gray-800 truncate">${currentUser.email}</p>
        </div>
        <a href="#" onclick="showMyProfile()" class="block px-4 py-3 hover:bg-orange-50 text-gray-700 transition-colors">
            👤 My Profile
        </a>
        <a href="my-favorites.html" class="block px-4 py-3 hover:bg-orange-50 text-gray-700 transition-colors">
            ⭐ 我的收藏
        </a>
        <a href="#" onclick="handleLogout()" class="block px-4 py-3 hover:bg-red-50 text-red-600 transition-colors">
            🚪 Log Out
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

function showMyProfile() {
    closeUserMenu();
    const modal = document.createElement('div');
    modal.id = 'profileModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div class="bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-2xl px-6 py-4">
                <h3 class="text-white text-xl font-bold">👤 My Profile</h3>
            </div>
            <form id="profile-form" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">显示名称</label>
                    <input type="text" id="profile-name" value="${currentUser.email.split('@')[0]}" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">邮箱</label>
                    <input type="email" value="${currentUser.email}" disabled class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-500">
                    <p class="text-xs text-gray-500 mt-1">邮箱无法修改</p>
                </div>
                <button type="submit" class="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg">
                    保存修改
                </button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    document.getElementById('profile-form').onsubmit = async (e) => {
        e.preventDefault();
        const newName = document.getElementById('profile-name').value.trim();
        if (newName) {
            updateLoginButtonDisplay(newName);
            modal.remove();
            alert('Profile updated!');
        }
    };
}

function updateLoginButtonDisplay(name) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) loginBtn.textContent = name;
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
});
