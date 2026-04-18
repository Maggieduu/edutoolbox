/**
 * 社区功能 - 模板分享
 */

// 模板数据结构
const templateSchema = {
    gameType: '',      // 游戏类型：gomoku, word-search, flashcards 等
    title: '',         // 模板标题
    description: '',   // 描述
    content: {},       // 游戏内容（JSON格式）
    author: '',        // 作者邮箱
    authorName: '',    // 作者显示名
    createdAt: null,   // 创建时间
    playCount: 0       // 游玩次数
};

// 加载社区模板
async function loadCommunityTemplates() {
    const container = document.getElementById('community-templates');
    if (!container) return;

    container.innerHTML = '<p class="loading">加载中...</p>';

    try {
        const snapshot = await db.collection('templates')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();

        if (snapshot.empty) {
            container.innerHTML = '<p>暂无模板，成为第一个分享者！</p>';
            return;
        }

        container.innerHTML = '';
        snapshot.forEach(doc => {
            const template = doc.data();
            const card = createTemplateCard(template, doc.id);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('加载模板失败:', error);
        container.innerHTML = '<p>加载失败，请刷新重试</p>';
    }
}

// 创建模板卡片
function createTemplateCard(template, docId) {
    const card = document.createElement('div');
    card.className = 'template-card';

    const gameTypeLabels = {
        'gomoku': '五子棋',
        'word-search': '汉字大侦探',
        'flashcards': '生词翻翻看',
        'snake': '贪吃蛇',
        'scrambled': '疯狂的句子',
        'name-picker': '随机点名器'
    };

    card.innerHTML = `
        <div class="template-header">
            <span class="template-badge">${gameTypeLabels[template.gameType] || template.gameType}</span>
            <span class="template-plays">${template.playCount || 0} 次游玩</span>
        </div>
        <h3 class="template-title">${template.title}</h3>
        <p class="template-desc">${template.description || '暂无描述'}</p>
        <div class="template-footer">
            <span class="template-author">by ${template.authorName || template.author}</span>
            <div class="template-actions">
                <button class="btn-play" onclick="playTemplate('${docId}')">▶ 玩</button>
                ${currentUser ? `<button class="btn-clone" onclick="cloneTemplate('${docId}')">📋 Clone</button>` : ''}
            </div>
        </div>
    `;
    return card;
}

// 玩游戏模板
async function playTemplate(docId) {
    try {
        const doc = await db.collection('templates').doc(docId).get();
        if (!doc.exists) {
            alert('模板不存在');
            return;
        }

        const template = doc.data();

        // 增加游玩次数
        db.collection('templates').doc(docId).update({
            playCount: firebase.firestore.FieldValue.increment(1)
        });

        // 根据游戏类型跳转到对应游戏
        // 这里需要把模板内容传递到游戏中
        localStorage.setItem('currentTemplate', JSON.stringify(template));
        window.location.href = `play.html?src=./names/Name1/index.html&template=${docId}`;

    } catch (error) {
        console.error('加载模板失败:', error);
        alert('加载失败');
    }
}

// Clone 模板到我的收藏
async function cloneTemplate(docId) {
    if (!currentUser) {
        alert('请先登录');
        return;
    }

    try {
        const doc = await db.collection('templates').doc(docId).get();
        if (!doc.exists) {
            alert('模板不存在');
            return;
        }

        const template = doc.data();

        // 检查用户已有多少模板
        const userTemplates = await db.collection('templates')
            .where('author', '==', currentUser.email)
            .get();

        // 简单限制：免费用户最多5个模板
        if (userTemplates.size >= 5) {
            alert('免费用户最多保存5个模板，请升级或删除旧模板');
            return;
        }

        // 复制到用户
        await db.collection('templates').add({
            ...template,
            author: currentUser.email,
            authorName: currentUser.email.split('@')[0],
            createdAt: new Date(),
            playCount: 0,
            clonedFrom: docId
        });

        alert('已保存到你的收藏！');

    } catch (error) {
        console.error('Clone失败:', error);
        alert('Clone失败');
    }
}

// 上传模板（需要登录）
function showUploadModal() {
    if (!currentUser) {
        alert('请先登录');
        showLoginModal();
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'upload-modal';
    modal.innerHTML = `
        <div class="upload-modal-content">
            <span class="upload-close">&times;</span>
            <h2>📤 上传模板</h2>
            <form id="upload-form">
                <label>游戏类型</label>
                <select id="upload-game-type" required>
                    <option value="">选择游戏类型</option>
                    <option value="gomoku">🎮 五子棋</option>
                    <option value="word-search">🔍 汉字大侦探</option>
                    <option value="flashcards">🃏 生词翻翻看</option>
                    <option value="scrambled">📝 疯狂的句子</option>
                    <option value="name-picker">🎯 随机点名器</option>
                </select>

                <label>模板标题</label>
                <input type="text" id="upload-title" placeholder="例如：Grade2 同义词练习" required>

                <label>描述</label>
                <textarea id="upload-desc" placeholder="简要描述这个模板..."></textarea>

                <label>内容（JSON格式）</label>
                <textarea id="upload-content" placeholder='{"pairs": [["大","小"],["高","矮"]]}' required></textarea>

                <button type="submit" class="upload-submit">发布</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.upload-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    document.getElementById('upload-form').onsubmit = async (e) => {
        e.preventDefault();
        await uploadTemplate();
        modal.remove();
    };
}

// 上传模板到数据库
async function uploadTemplate() {
    const gameType = document.getElementById('upload-game-type').value;
    const title = document.getElementById('upload-title').value;
    const description = document.getElementById('upload-desc').value;
    const contentStr = document.getElementById('upload-content').value;

    let content;
    try {
        content = JSON.parse(contentStr);
    } catch (e) {
        alert('JSON格式错误');
        return;
    }

    try {
        await db.collection('templates').add({
            gameType,
            title,
            description,
            content,
            author: currentUser.email,
            authorName: currentUser.email.split('@')[0],
            createdAt: new Date(),
            playCount: 0
        });

        alert('发布成功！');
        loadCommunityTemplates();

    } catch (error) {
        console.error('上传失败:', error);
        alert('上传失败');
    }
}
