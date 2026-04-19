/**
 * 社区功能 - 模板分享
 */

// 模板数据结构
const templateSchema = {
    gameType: '',
    title: '',
    description: '',
    content: {},
    author: '',
    authorName: '',
    createdAt: null,
    playCount: 0
};

// 加载社区模板
async function loadCommunityTemplates() {
    const container = document.getElementById('community-templates');
    if (!container) return;

    container.innerHTML = '<p class="loading">加载中...</p>';

    try {
        const { data, error } = await window.sb.from('templates')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>暂无模板，成为第一个分享者！</p>';
            return;
        }

        container.innerHTML = '';
        data.forEach(template => {
            const card = createTemplateCard(template, template.id);
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

    const favoritedBy = template.favorited_by || [];
    const isFavorited = currentUser && favoritedBy.includes(currentUser.id);
    const starClass = isFavorited ? 'text-yellow-500' : 'text-gray-300';
    const starTitle = isFavorited ? '已收藏' : '收藏';

    card.innerHTML = `
        <div class="template-header">
            <span class="template-badge">${gameTypeLabels[template.game_type] || template.game_type}</span>
            <span class="template-plays">${template.play_count || 0} 次游玩</span>
        </div>
        <h3 class="template-title">${template.title}</h3>
        <p class="template-desc">${template.description || '暂无描述'}</p>
        <div class="template-footer">
            <span class="template-author">by ${template.author_name || template.author}</span>
            <div class="template-actions">
                <button class="btn-play" onclick="playTemplate('${docId}')">▶ 玩</button>
                ${currentUser ? `<button class="btn-star ${starClass}" onclick="toggleFavorite('${docId}')" title="${starTitle}">⭐</button>` : ''}
            </div>
        </div>
    `;
    return card;
}

// 收藏/取消收藏模板
async function toggleFavorite(docId) {
    if (!currentUser) {
        alert('请先登录');
        return;
    }

    try {
        const { data, error } = await window.sb.from('templates').select('favorited_by').eq('id', docId).single();
        if (error || !data) {
            alert('模板不存在');
            return;
        }

        const favoritedBy = data.favorited_by || [];
        const userId = currentUser.id;
        const isFavorited = favoritedBy.includes(userId);

        let newFavoritedBy;
        if (isFavorited) {
            newFavoritedBy = favoritedBy.filter(id => id !== userId);
        } else {
            newFavoritedBy = [...favoritedBy, userId];
        }

        const { error: updateError } = await window.sb.from('templates').update({ favorited_by: newFavoritedBy }).eq('id', docId);

        if (updateError) throw updateError;

        loadCommunityTemplates();

    } catch (error) {
        console.error('收藏失败:', error);
        alert('操作失败');
    }
}

// 玩游戏模板
async function playTemplate(docId) {
    try {
        const { data, error } = await window.sb.from('templates').select('*').eq('id', docId).single();
        if (error || !data) {
            alert('模板不存在');
            return;
        }

        const template = data;

        // 增加游玩次数
        await window.sb.from('templates').update({ play_count: (template.play_count || 0) + 1 }).eq('id', docId);

        // 根据游戏类型跳转到对应游戏
        localStorage.setItem('currentTemplate', JSON.stringify(template));
        window.location.href = `play.html?src=./names/Name1/index.html&template=${docId}`;

    } catch (error) {
        console.error('加载模板失败:', error);
        alert('加载失败');
    }
}

// 上传模板（需要登录）
function showUploadModal() {
    if (!currentUser) {
        alert('请先登录');
        if (typeof openLoginModal === 'function') openLoginModal();
        return;
    }

    const modal = document.createElement('div');
    modal.id = 'uploadModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div class="bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-2xl px-6 py-4 flex justify-between items-center">
                <h3 class="text-white text-xl font-bold">📤 上传模板</h3>
                <button onclick="document.getElementById('uploadModal').remove()" class="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <form id="upload-form" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">游戏类型</label>
                    <select id="upload-game-type" required class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors bg-white" onchange="updateTemplateFields()">
                        <option value="">选择游戏类型</option>
                        <option value="gomoku">🎮 五子棋</option>
                        <option value="word-search">🔍 汉字大侦探</option>
                        <option value="flashcards">🃏 生词翻翻看</option>
                        <option value="scrambled">📝 疯狂的句子</option>
                        <option value="name-picker">🎯 随机点名器</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">模板标题</label>
                    <input type="text" id="upload-title" placeholder="例如：Grade2 同义词练习" required class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">描述</label>
                    <textarea id="upload-desc" placeholder="简要描述这个模板..." rows="2" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors resize-none"></textarea>
                </div>
                <div id="template-fields-container">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">词语（用逗号分隔）</label>
                    <input type="text" id="upload-words" placeholder="例如：大,小,高,矮,胖,瘦" required class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors">
                    <p class="text-xs text-gray-500 mt-1">输入用于游戏的词语，用逗号分隔</p>
                </div>
                <button type="submit" class="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-pink-600 transform hover:-translate-y-0.5 transition-all shadow-lg">
                    🚀 发布模板
                </button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    document.getElementById('upload-form').onsubmit = async (e) => {
        e.preventDefault();
        await uploadTemplate();
        modal.remove();
    };
}

function updateTemplateFields() {
    const gameType = document.getElementById('upload-game-type').value;
    const container = document.getElementById('template-fields-container');
    
    const fieldConfigs = {
        'gomoku': { label: '词语（用逗号分隔）', placeholder: '例如：同,学,习,游,戏', hint: '输入成对的词语用于五子棋' },
        'word-search': { label: '词语（用逗号分隔）', placeholder: '例如：北京,上海,广州,深圳', hint: '输入要在汉字大侦探中隐藏的词语' },
        'flashcards': { label: '词语对（用逗号分隔，每对用/分隔）', placeholder: '例如：大/小,高/矮,胖/瘦', hint: '输入成对的词语/解释' },
        'scrambled': { label: '句子（每行一句）', placeholder: '例如：今天天气真好\n明天可能会下雨', hint: '输入完整的句子' },
        'name-picker': { label: '名字（用逗号分隔）', placeholder: '例如：张三,李四,王五,赵六', hint: '输入要随机点名的名字' }
    };
    
    const config = fieldConfigs[gameType] || { label: '内容', placeholder: '请输入内容', hint: '' };
    container.innerHTML = `
        <label class="block text-sm font-semibold text-gray-700 mb-2">${config.label}</label>
        <textarea id="upload-words" placeholder="${config.placeholder}" required rows="3" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors resize-none"></textarea>
        <p class="text-xs text-gray-500 mt-1">${config.hint}</p>
    `;
}

// 上传模板到数据库
async function uploadTemplate() {
    const gameType = document.getElementById('upload-game-type').value;
    const title = document.getElementById('upload-title').value;
    const description = document.getElementById('upload-desc').value;
    const wordsInput = document.getElementById('upload-words').value;

    let content;
    try {
        if (gameType === 'flashcards') {
            const pairs = wordsInput.split(',').map(pair => pair.trim().split('/').map(s => s.trim()));
            content = { pairs: pairs };
        } else if (gameType === 'scrambled') {
            content = { sentences: wordsInput.split('\n').map(s => s.trim()).filter(s => s) };
        } else {
            content = { words: wordsInput.split(',').map(w => w.trim()).filter(w => w) };
        }
    } catch (e) {
        alert('格式错误');
        return;
    }

    try {
        const { error } = await window.sb.from('templates').insert({
            game_type: gameType,
            title: title,
            description: description,
            content: content,
            author: currentUser.email,
            author_name: currentUser.email.split('@')[0],
            created_at: new Date().toISOString(),
            play_count: 0
        });

        if (error) throw error;

        alert('发布成功！');
        loadCommunityTemplates();

    } catch (error) {
        console.error('上传失败:', error);
        alert('上传失败');
    }
}
