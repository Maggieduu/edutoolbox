/* ========================================
   Edu Toolbox - Shared Components
   ======================================== */

// Current language
let currentLang = 'zh';
let index = 0;
let typingInterval = null;

/* ========================================
   Initialize Page
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
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
    const existingNavbar = document.querySelector('.navbar');
    if (existingNavbar) existingNavbar.remove();

    // Get current page from URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const t = SITE_DATA.translations[currentLang];

    // Build navbar HTML
    let navHtml = `
        <nav class="navbar">
            <div class="navbar-left">
                <a href="index.html" class="navbar-brand en-text">
                    <span class="logo-icon">🧰</span>
                    <span>EduToolbox</span>
                </a>
                <div class="lang-switcher">
                    <button class="lang-btn ${currentLang === 'zh' ? 'active' : ''}" data-lang="zh" data-i18n="langZh">中文</button>
                    <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en" data-i18n="langEn">EN</button>
                </div>
            </div>
            <div class="navbar-right">
                <ul class="navbar-nav">
    `;

    SITE_DATA.nav.forEach(item => {
        const isActive = currentPage === item.link ||
                        (currentPage === 'index.html' && item.link === 'index.html');
        const isComingSoon = item.commingSoon ? 'comming-soon' : '';
        const name = currentLang === 'zh' ? item.name : item.nameEn;

        if (isComingSoon) {
            navHtml += `<a href="${item.link}" class="nav-link ${isComingSoon}" title="${t.coming}">${name}</a>`;
        } else {
            navHtml += `<a href="${item.link}" class="nav-link ${isActive ? 'active' : ''}">${name}</a>`;
        }
    });

    navHtml += `
                </ul>
                <a href="#" class="login-btn" data-i18n="loginBtn">${t.loginBtn}</a>
            </div>
        </nav>
    `;

    // Insert navbar at the beginning of body
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

    // Note: login button handler is managed by supabase.js via updateLoginButton()
}

/* ========================================
   Footer
   ======================================== */
function initFooter() {
    // Remove existing footer if any
    const existingFooter = document.querySelector('.footer');
    if (existingFooter) existingFooter.remove();

    const t = SITE_DATA.translations[currentLang];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Build footer HTML
    let footerHtml = `
        <footer class="footer">
            <div class="footer-links">
    `;

    SITE_DATA.nav.forEach(item => {
        const name = currentLang === 'zh' ? item.name : item.nameEn;
        footerHtml += `<a href="${item.link}">${name}</a>`;
    });

    footerHtml += `
            </div>
            <p>${t.copyright}</p>
        </footer>
    `;

    // Insert footer at the end of body
    document.body.insertAdjacentHTML('beforeend', footerHtml);
}

/* ========================================
   Language Switching
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

    // Reset typing animation
    resetTyping();
}

/* ========================================
   Typing Effect
   ======================================== */
function initTyping() {
    // Start typing after a short delay
    setTimeout(() => {
        typeText();
    }, 500);

    // Auto-reset typing effect every 8 seconds
    setInterval(() => {
        resetTyping();
    }, 8000);
}

function typeText() {
    const t = SITE_DATA.translations[currentLang];
    const text = t.typing;
    const typingElement = document.getElementById('typingText');

    if (!typingElement) return;

    if (index < text.length) {
        typingElement.textContent += text.charAt(index);
        index++;
        typingInterval = setTimeout(typeText, 200);
    }
}

function resetTyping() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    typingElement.textContent = '';
    index = 0;
    if (typingInterval) clearTimeout(typingInterval);
    typeText();
}

/* ========================================
   Scroll Cards (Homepage)
   ======================================== */
function initScrollCards() {
    const container = document.getElementById('toolsContainer');
    if (!container) return;

    // Clone cards multiple times for richer visual scroll (4 copies)
    const cards = container.innerHTML;
    container.innerHTML = cards + cards + cards + cards;

    // Pause on hover
    container.addEventListener('mouseenter', () => {
        container.style.animationPlayState = 'paused';
    });
    container.addEventListener('mouseleave', () => {
        container.style.animationPlayState = 'running';
    });
}

/* ========================================
   Generate Cards from Data
   ======================================== */
function generateCards(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const t = SITE_DATA.translations[currentLang];
    let html = '';

    data.forEach(item => {
        const titleKey = item.title;
        const titleEnKey = item.titleEn;
        const badge = item.coming ? 'badge-coming' : `badge-${item.badge}`;
        const badgeText = item.coming ? t.coming : t[item.badge];
        const cardClass = item.coming ? 'card disabled' : 'card';
        const icon = item.icon || '';
        const btnText = item.coming ? t.coming : getBtnText(item.badge, t);

        let cardLink = '#';
        let clickHandler = '';
        if (!item.coming) {
            if (item.badge === 'game' || item.badge === 'tool') {
                clickHandler = `onclick="handleCardClick(event, '${item.link}', '${item.badge}')"`;
            } else {
                cardLink = item.link;
            }
        }

        html += `
            <a href="${cardLink}" class="${cardClass}" ${clickHandler}>
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

function handleCardClick(event, link, badge) {
    event.preventDefault();
    if (!currentUser) {
        alert('请先登录才能使用此功能');
        if (typeof openLoginModal === 'function') openLoginModal();
        return;
    }
    window.location.href = `play.html?src=${link}`;
}

function getBtnText(badge, t) {
    switch(badge) {
        case 'game': return t.play;
        case 'tool': return t.generate;
        case 'ai': return t.try;
        case 'resource': return t.browse;
        default: return '→';
    }
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
        const cardLink = `play.html?src=${item.link}`;
        const clickHandler = `onclick="handleScrollCardClick(event, '${item.link}')"`;

        const imageSrc = item.image || '';
        const imageHtml = imageSrc
            ? `<img src="${imageSrc}" alt="" class="card-image-placeholder" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <span class="card-icon-fallback" style="display:none;">${item.icon}</span>`
            : `<span class="card-image-placeholder">${item.icon}</span>`;

        html += `
            <a href="${cardLink}" class="tool-card" ${clickHandler}>
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

function handleScrollCardClick(event, link) {
    event.preventDefault();
    if (!currentUser) {
        alert('请先登录才能使用此功能');
        if (typeof openLoginModal === 'function') openLoginModal();
        return;
    }
    window.location.href = `play.html?src=${link}`;
}
