/* ========================================
   Edu Toolbox - Shared Components
   ======================================== */

// Current language
let currentLang = 'zh';
let index = 0;
let typingInterval = null;

/* ========================================
   Invite Code Gate
   ======================================== */
function checkInviteCode() {
    const savedCode = localStorage.getItem('eduInviteCode');
    if (savedCode && savedCode.toUpperCase() === INVITE_CODE.toUpperCase()) {
        return true;
    }
    return false;
}

function showInviteGate() {
    const gateHTML = `
        <div id="inviteGate" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #FFFDE7;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 24px;
                border: 4px solid #333;
                box-shadow: 8px 8px 0px #333;
                text-align: center;
                max-width: 400px;
            ">
                <h2 style="
                    color: #FF6B6B;
                    margin-bottom: 20px;
                    font-size: 28px;
                    text-shadow: 2px 2px 0px #333;
                ">🎓 Edu Toolbox</h2>
                <p style="color: #666; margin-bottom: 25px;">请输入邀请码进入</p>
                <input type="text" id="inviteInput" placeholder="请输入邀请码" style="
                    width: 100%;
                    padding: 15px;
                    font-size: 18px;
                    border: 3px solid #333;
                    border-radius: 12px;
                    margin-bottom: 15px;
                    text-align: center;
                    box-sizing: border-box;
                ">
                <button id="inviteSubmit" style="
                    width: 100%;
                    padding: 15px;
                    background: #FFE500;
                    color: #333;
                    border: 3px solid #333;
                    border-radius: 12px;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 4px 4px 0px #333;
                    transition: all 0.2s;
                ">进入</button>
                <p id="inviteError" style="color: #FF6B6B; margin-top: 15px; display: none;">邀请码错误，请重试</p>
            </div>
        </div>
    `;
    document.body.innerHTML = gateHTML;

    document.getElementById('inviteSubmit').addEventListener('click', submitInviteCode);
    document.getElementById('inviteInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') submitInviteCode();
    });
}

function submitInviteCode() {
    const input = document.getElementById('inviteInput').value.trim();
    if (input.toUpperCase() === INVITE_CODE.toUpperCase()) {
        localStorage.setItem('eduInviteCode', input.toUpperCase());
        location.reload();
    } else {
        document.getElementById('inviteError').style.display = 'block';
        document.getElementById('inviteInput').style.borderColor = '#FF6B6B';
    }
}

/* ========================================
   Initialize Page
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    if (!checkInviteCode()) {
        showInviteGate();
        return;
    }
    initNavbar();
    initFooter();
    initLanguage();
    initTyping();
});

/* ========================================
   Navigation Bar
   ======================================== */
function initNavbar() {
    // Remove existing navbar if any
    const existingNav = document.querySelector('.navbar');
    if (existingNav) existingNav.remove();

    const isHomepage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');

    const navHtml = `
        <nav class="navbar">
            <div class="navbar-left">
                <a href="index.html" class="navbar-brand">
                    <span class="logo-icon">🎓</span>
                    <span class="logo-text">Edu Toolbox</span>
                </a>
                <div class="lang-switch">
                    <button class="lang-btn ${currentLang === 'zh' ? 'active' : ''}" data-lang="zh" data-i18n="langZh">中文</button>
                    <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en" data-i18n="langEn">EN</button>
                </div>
            </div>
            <div class="navbar-nav">
                <a href="index.html" class="nav-link ${isHomepage ? 'active' : ''}">首页</a>
                <a href="games.html" class="nav-link ${window.location.pathname.includes('games') ? 'active' : ''}">游戏</a>
                <a href="tools.html" class="nav-link ${window.location.pathname.includes('tools') ? 'active' : ''}">工具</a>
                <a href="ai.html" class="nav-link ${window.location.pathname.includes('ai') ? 'active' : ''}">AI助手</a>
                <a href="resources.html" class="nav-link ${window.location.pathname.includes('resources') ? 'active' : ''}">其他资源</a>
                <a href="#" class="nav-link coming-soon">社区</a>
                <a href="#" class="login-btn">注册/登录</a>
            </div>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navHtml);

    // Add language switcher event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentLang = this.dataset.lang;
            updateLanguage();
            initNavbar(); // Re-render navbar with new language
            initFooter(); // Re-render footer with new language
        });
    });
}

/* ========================================
   Footer
   ======================================== */
function initFooter() {
    const existingFooter = document.querySelector('.footer');
    if (existingFooter) existingFooter.remove();

    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <div class="footer-links">
            <a href="index.html">首页</a>
            <a href="games.html">游戏</a>
            <a href="tools.html">工具</a>
            <a href="ai.html">AI助手</a>
            <a href="resources.html">其他资源</a>
            <a href="#">社区</a>
        </div>
        <p>&copy; 2024 Edu Toolbox. All rights reserved.</p>
    `;
    document.body.appendChild(footer);
}

/* ========================================
   Language System
   ======================================== */
function initLanguage() {
    updateLanguage();
}

function updateLanguage() {
    const t = SITE_DATA.translations[currentLang];

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerHTML = t[key];
        }
    });

    // Update typing text with new language
    const typingText = document.getElementById('typingText');
    const taglineSpan = document.querySelector('.tagline span');
    if (taglineSpan && typingText) {
        const plainText = taglineSpan.textContent;
        typingText.setAttribute('data-full-text', plainText);
        typingText.textContent = '';
        // Delay restart slightly to ensure DOM is updated
        setTimeout(() => {
            restartTyping(plainText, plainText.length);
        }, 50);
    }
}

function restartTyping(text, textLength) {
    if (typingInterval) clearInterval(typingInterval);
    const typingText = document.getElementById('typingText');
    if (!typingText) return;

    let i = 0;
    typingInterval = setInterval(() => {
        if (i < textLength) {
            typingText.textContent = text.substring(0, i + 1);
            i++;
        } else {
            clearInterval(typingInterval);
        }
    }, 100);
}

/* ========================================
   Typing Effect
   ======================================== */
function initTyping() {
    const typingText = document.getElementById('typingText');
    const taglineElement = document.querySelector('.tagline span');

    if (!typingText || !taglineElement) return;

    const plainText = taglineElement.textContent;
    typingText.textContent = plainText;
    typingText.setAttribute('data-full-text', plainText);
    taglineElement.textContent = '';
    taglineElement.style.display = 'none';

    const startBtn = document.querySelector('.typing-start-btn');

    let i = 0;
    typingText.textContent = '';
    typingInterval = setInterval(() => {
        if (i < plainText.length) {
            typingText.textContent = plainText.substring(0, i + 1);
            i++;
        } else {
            clearInterval(typingInterval);
        }
    }, 100);

    if (startBtn) {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clearInterval(typingInterval);
            typingText.textContent = plainText;
        });
    }
}

function resetTyping() {
    if (typingInterval) {
        clearInterval(typingInterval);
    }
    const typingText = document.getElementById('typingText');
    if (typingText) {
        const fullText = typingText.getAttribute('data-full-text');
        if (fullText) {
            typingText.textContent = fullText;
        }
    }
}

/* ========================================
   Generate Cards
   ======================================== */
function getBtnText(badge, t) {
    switch(badge) {
        case 'game': return t.play;
        case 'tool': return t.generate;
        case 'ai': return t.try;
        case 'resource': return t.browse;
        default: return '→';
    }
}

function generateCards(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const t = SITE_DATA.translations[currentLang];
    let html = '';

    data.forEach(item => {
        const titleKey = item.title;
        const badge = item.coming ? 'badge-coming' : `badge-${item.badge}`;
        const badgeText = item.coming ? t.coming : t[item.badge];
        const cardClass = item.coming ? 'card disabled' : 'card';
        const icon = item.icon || '';
        const btnText = item.coming ? t.coming : getBtnText(item.badge, t);

        let cardLink = '#';
        if (!item.coming) {
            if (item.badge === 'game' || item.badge === 'tool') {
                cardLink = `play.html?src=${item.link}`;
            } else {
                cardLink = item.link;
            }
        }

        html += `
            <a href="${cardLink}" class="${cardClass}">
                <span class="category-badge ${badge}">${badgeText}</span>
                ${item.image
                    ? `<img src="${item.image}" alt="" class="card-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                       <span class="card-icon" style="display:none;">${icon}</span>`
                    : `<span class="card-icon">${icon}</span>`
                }
                <h3 data-i18n="${titleKey}">${t[titleKey]}</h3>
                <p data-i18n="${item.desc}">${t[item.desc]}</p>
                <span class="btn">${btnText}</span>
            </a>
        `;
    });

    container.innerHTML = html;
}

/* ========================================
   Generate Scroll Cards (Homepage)
   ======================================== */
function generateScrollCards() {
    const container = document.getElementById('toolsContainer');
    if (!container) return;

    const t = SITE_DATA.translations[currentLang];
    let html = '';

    const allItems = [...SITE_DATA.games, ...SITE_DATA.tools];

    allItems.forEach(item => {
        let cardLink = item.link;
        if (item.badge === 'game' || item.badge === 'tool') {
            cardLink = `play.html?src=${item.link}`;
        }

        const imageSrc = item.image || '';
        const imageHtml = imageSrc
            ? `<img src="${imageSrc}" alt="" class="card-image-placeholder" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <span class="card-icon-fallback" style="display:none;">${item.icon}</span>`
            : `<span class="card-image-placeholder">${item.icon}</span>`;

        html += `
            <a href="${cardLink}" class="tool-card">
                ${imageHtml}
                <div class="card-content">
                    <h3 data-i18n="${item.title}">${t[item.title]}</h3>
                    <p data-i18n="${item.desc}">${t[item.desc]}</p>
                </div>
                <span class="try-btn">${t.play}</span>
            </a>
        `;
    });

    container.innerHTML = html;
    initScrollCards();
}

function initScrollCards() {
    const container = document.getElementById('toolsContainer');
    if (!container) return;

    // Clone cards for seamless loop
    const cards = container.innerHTML;
    container.innerHTML = cards + cards;

    // Pause on hover
    container.addEventListener('mouseenter', () => {
        container.style.animationPlayState = 'paused';
    });
    container.addEventListener('mouseleave', () => {
        container.style.animationPlayState = 'running';
    });
}
