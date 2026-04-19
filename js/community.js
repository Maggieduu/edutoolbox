/**
 * 社区功能 - 模板分享
 */

// 模板数据结构
const templateSchema = {
    gameType: '',
    title: '',
    description: '',
    title: '',
    content: {},
    author: '',
    authorName: '',
    createdAt: null,
    playCount: 0
};

// 支持分享的游戏白名单
const supportedGamesForSharing = ['gomoku', 'word-search', 'flashcards', 'scrambled', 'name-picker', 'who-is-mole'];

// 加载社区模板
async function loadCommunityTemplates() {
    const container = document.getElementById('community-templates');
    if (!container) return;

    container.innerHTML = '<p class="loading">加载中...</p>';

    try {
        const { data, error } = await window.sb.from('templates')
            .select('*')
            .is('cloned_from', null)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>暂无模板，成为第一个分享者！</p>';
            return;
        }

        // 获取当前用户克隆的所有模板ID
        let clonedIds = new Set();
        if (currentUser) {
            const { data: userClones } = await window.sb
                .from('templates')
                .select('cloned_from')
                .eq('author', currentUser.email)
                .not('cloned_from', 'is', null);
            if (userClones) {
                userClones.forEach(c => clonedIds.add(c.cloned_from));
            }
        }

        container.innerHTML = '';
        data.forEach(template => {
            const card = createTemplateCard(template, template.id, clonedIds);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('加载模板失败:', error);
        container.innerHTML = '<p>加载失败，请刷新重试</p>';
    }
}

// 创建模板卡片
function createTemplateCard(template, docId, clonedIds) {
    const card = document.createElement('div');
    card.className = 'template-card';

    const gameTypeLabels = {
        'gomoku': '五子棋',
        'word-search': '汉字大侦探',
        'flashcards': '生词翻翻看',
        'snake': '贪吃蛇',
        'scrambled': '疯狂的句子',
        'name-picker': '随机点名器',
        'who-is-mole': '谁是卧底'
    };

    const isCloned = clonedIds.has(docId);
    const heartColor = isCloned ? '#FF6B6B' : '#D1D5DB';
    const heartTitle = isCloned ? '取消收藏' : '收藏';

    const playButton = currentUser 
        ? `<button class="btn-play" onclick="playTemplate('${docId}')">▶ 玩</button>`
        : `<button class="btn-play" onclick="showLoginRequired()" disabled>▶ 玩</button>`;

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
                ${playButton}
                ${currentUser ? `<button class="btn-heart" onclick="toggleFavorite('${docId}')" title="${heartTitle}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${heartColor}" stroke="${heartColor}" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>` : ''}
            </div>
        </div>
    `;
    return card;
}

// 收藏/取消收藏模板（真正复制到用户账户）
async function toggleFavorite(docId) {
    if (!currentUser) {
        alert('请先登录');
        return;
    }

    try {
        // 查找用户克隆的这个模板（必须有 cloned_from 字段）
        const { data: existingCloned, error: findError } = await window.sb
            .from('templates')
            .select('id')
            .eq('cloned_from', docId)
            .eq('author', currentUser.email)
            .single();

        if (findError && findError.code !== 'PGRST116') {
            console.error('查询失败:', findError);
        }

        if (existingCloned) {
            // 取消收藏：只删除克隆的模板
            const { error: deleteError } = await window.sb.from('templates').delete().eq('id', existingCloned.id);
            if (deleteError) throw deleteError;
            alert('已取消收藏');
        } else {
            // 收藏：先检查数量（只算克隆的模板，不算用户原创的）
            const { data: userClones, error: countError } = await window.sb
                .from('templates')
                .select('id')
                .eq('author', currentUser.email)
                .not('cloned_from', 'is', null);

            if (countError) throw countError;

            if (userClones && userClones.length >= 3) {
                alert('最多只能收藏3个模板！请先取消一些收藏。');
                return;
            }

            const { data: originalTemplate, error: fetchError } = await window.sb
                .from('templates')
                .select('*')
                .eq('id', docId)
                .single();

            if (fetchError || !originalTemplate) {
                alert('模板不存在');
                return;
            }

            const { error: insertError } = await window.sb.from('templates').insert({
                game_type: originalTemplate.game_type,
                title: originalTemplate.title,
                description: originalTemplate.description,
                content: originalTemplate.content,
                author: currentUser.email,
                author_name: currentUser.email.split('@')[0],
                cloned_from: docId,
                play_count: 0
            });

            if (insertError) throw insertError;
            alert('已收藏到你的账户！');
        }

        loadCommunityTemplates();

    } catch (error) {
        console.error('操作失败:', error);
        alert('操作失败，请重试');
    }
}

// 显示登录提示
function showLoginRequired() {
    alert('请先登录才能使用此功能');
    if (typeof openLoginModal === 'function') openLoginModal();
}

// 玩游戏模板（需要登录）
async function playTemplate(docId) {
    if (!currentUser) {
        showLoginRequired();
        return;
    }
    try {
        const { data, error } = await window.sb.from('templates').select('*').eq('id', docId).single();
        if (error || !data) {
            alert('模板不存在');
            return;
        }

        const template = data;

        // 增加游玩次数（仅登录用户）
        try {
            await window.sb.from('templates').update({ play_count: (template.play_count || 0) + 1 }).eq('id', docId);
        } catch (e) {
            console.log('更新游玩次数失败，但不影响游戏', e);
        }

        // 根据游戏类型跳转到对应游戏
        const gamePaths = {
            'gomoku': './names/Name1/index.html',
            'word-search': './names/Name2/index.html',
            'flashcards': './names/Name4/index.html',
            'snake': './names/Name5/index.html',
            'scrambled': './names/Name6/index.html',
            'name-picker': './names/Name7/index.html',
            'who-is-mole': './names/Name8/index.html'
        };

        localStorage.setItem('currentTemplate', JSON.stringify(template));
        const gamePath = gamePaths[template.game_type] || './names/Name1/index.html';
        window.location.href = `play.html?src=${gamePath}&template=${docId}`;

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

    const gameLabels = {
        'gomoku': '🎮 五子棋',
        'word-search': '🔍 汉字大侦探',
        'flashcards': '🃏 生词翻翻看',
        'scrambled': '📝 疯狂的句子',
        'name-picker': '🎯 随机点名器',
        'who-is-mole': '🕵️ 谁是卧底'
    };

    // 只显示白名单里的游戏
    const gameOptions = supportedGamesForSharing
        .map(game => `<option value="${game}">${gameLabels[game]}</option>`)
        .join('');

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
                        ${gameOptions}
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
        'gomoku': { label: '词语对（用空格分隔，每对用/分隔）', placeholder: '例如：大/小 高/矮 胖/瘦', hint: '输入成对的词语用于五子棋' },
        'word-search': { label: '词语（用空格分隔）', placeholder: '例如：北京 上海 广州 深圳', hint: '输入要在汉字大侦探中隐藏的词语' },
        'flashcards': { label: '词语对（用空格分隔，每对用/分隔）', placeholder: '例如：大/小 高/矮 胖/瘦', hint: '输入成对的词语/解释' },
        'scrambled': { label: '句子（每行一句）', placeholder: '例如：今天天气真好\n明天可能会下雨', hint: '输入完整的句子' },
        'name-picker': { label: '名字（用空格分隔）', placeholder: '例如：张三 李四 王五 赵六', hint: '输入要随机点名的名字' },
        'who-is-mole': { label: '汉字（用空格分隔）', placeholder: '例如：天 地 日 月 山 水', hint: '输入单个汉字，每个字用空格隔开' }
    };
    
    const config = fieldConfigs[gameType];
    if (!config) {
        container.innerHTML = '<p class="text-gray-500 text-sm">请选择一个支持分享的游戏类型</p>';
        return;
    }
    
    container.innerHTML = `
        <label class="block text-sm font-semibold text-gray-700 mb-2">${config.label}</label>
        <textarea id="upload-words" placeholder="${config.placeholder}" required rows="3" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors resize-none"></textarea>
        <p class="text-xs text-gray-500 mt-1">${config.hint}</p>
    `;
}

// 上传模板到数据库
async function uploadTemplate() {
    const gameType = document.getElementById('upload-game-type').value;
    
    // 安全检查：确保只允许白名单游戏上传
    if (!supportedGamesForSharing.includes(gameType)) {
        alert('这个游戏类型不支持分享模板');
        return;
    }
    
    const title = document.getElementById('upload-title').value;
    const description = document.getElementById('upload-desc').value;
    const wordsInput = document.getElementById('upload-words').value;

    let content;
    try {
        if (gameType === 'flashcards' || gameType === 'gomoku') {
            const pairs = wordsInput.split(/[,\s]+/).map(pair => pair.trim().split('/').map(s => s.trim())).filter(p => p[0]);
            content = { pairs: pairs.map(p => ({ red: p[0], blue: p[1] })) };
        } else if (gameType === 'scrambled') {
            content = { sentences: wordsInput.split('\n').map(s => s.trim()).filter(s => s) };
        } else {
            content = { words: wordsInput.split(/[,\s]+/).map(w => w.trim()).filter(w => w) };
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
