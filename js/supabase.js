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
        } else {
            loginBtn.textContent = '注册/登录';
        }
    }
}

window.sb.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    updateLoginButton();
});
