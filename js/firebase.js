const firebaseConfig = {
    apiKey: "AIzaSyDEF50lhwKtJHG60r4LODNJD9qf_3eaeD4",
    authDomain: "edutoolbox-maggieduu.firebaseapp.com",
    projectId: "edutoolbox-maggieduu",
    storageBucket: "edutoolbox-maggieduu.firebasestorage.app",
    messagingSenderId: "936003862916",
    appId: "1:936003862916:web:0d1e26acf32e92975d1dd1",
    measurementId: "G-7HVY2BJ9NN"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

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

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = '';

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            currentUser = userCredential.user;
            updateLoginButton();
            closeLoginModal();
        })
        .catch((error) => {
            errorEl.textContent = '登录失败：' + error.message;
        });
}

function handleRegister() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorEl = document.getElementById('registerError');
    errorEl.textContent = '';

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            currentUser = userCredential.user;
            db.collection('users').doc(currentUser.uid).set({
                email: currentUser.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            updateLoginButton();
            closeLoginModal();
        })
        .catch((error) => {
            errorEl.textContent = '注册失败：' + error.message;
        });
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

auth.onAuthStateChanged((user) => {
    currentUser = user;
    updateLoginButton();
});
