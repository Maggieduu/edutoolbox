#!/usr/bin/env node
/**
 * Edu Toolbox - 编辑滚动展示列表
 *
 * 使用方法:
 *   node scripts/edit-iframe.js
 *
 * 控制首页滚动卡片展示哪些游戏/工具
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = p => new Promise(r => rl.question(p, a => r(a.trim())));

function loadData() {
    const dataPath = path.join(__dirname, '..', 'js', 'data.js');
    return fs.readFileSync(dataPath, 'utf8');
}

function saveData(data) {
    const dataPath = path.join(__dirname, '..', 'js', 'data.js');
    fs.writeFileSync(dataPath, data);
}

async function main() {
    console.log('\n🎓 Edu Toolbox - 编辑滚动展示列表\n');
    console.log('─'.repeat(40));

    const data = loadData();

    // 解析所有项目
    const allItems = [];

    // 游戏
    const gameRegex = /\/\/ ([^\n]+)\n            (game\d)Title: '([^']+)',\n            \2TitleEn: '([^']*)',\n            \2Desc: '([^']+)',\n            \2DescFull: '([^']+)',/g;
    let match;
    while ((match = gameRegex.exec(data)) !== null) {
        allItems.push({
            id: match[2],
            title: match[3],
            desc: match[5],
            descFull: match[6],
            type: 'game',
            folder: 'Name' + match[2].replace('game', '')
        });
    }

    // 工具
    const toolRegex = /\/\/ ([^\n]+)\n            (tool\d)Title: '([^']+)',\n            \2TitleEn: '([^']*)',\n            \2Desc: '([^']+)',/g;
    while ((match = toolRegex.exec(data)) !== null) {
        allItems.push({
            id: match[2],
            title: match[3],
            desc: match[5],
            descFull: '',
            type: 'tool',
            folder: 'Name' + match[2].replace('tool', '')
        });
    }

    console.log('\n📋 所有可用项目:\n');
    allItems.forEach((item, i) => {
        const typeLabel = item.type === 'game' ? '🎮' : '🛠️';
        console.log(`   ${i + 1}. ${typeLabel} ${item.title} (${item.id})`);
    });

    console.log('\n' + '─'.repeat(40));
    console.log('\n✏️  选择要在滚动卡片展示的项目');
    console.log('   输入编号，用空格分隔（如：1 3 5 7）');
    console.log('   直接回车表示展示所有项目\n');

    const selection = await question('展示项目编号 (直接回车=全部): ');

    let selectedItems = allItems;
    if (selection && selection.trim() !== '') {
        const selectedNums = selection.split(' ').map(n => parseInt(n.trim()) - 1);
        selectedItems = selectedNums.filter(n => !isNaN(n) && n >= 0 && n < allItems.length)
            .map(n => allItems[n]);

        if (selectedItems.length === 0) {
            console.log('\n❌ 无效选择，已取消\n');
            rl.close();
            return;
        }
    }

    console.log('\n📋 将展示以下项目:\n');
    selectedItems.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.type === 'game' ? '🎮' : '🛠️'} ${item.title}`);
    });

    const confirm = await question('\n确认？(y/n): ');
    if (confirm.toLowerCase() !== 'y') {
        console.log('\n❌ 已取消\n');
        rl.close();
        return;
    }

    // 生成新的 games 和 tools 数组
    const selectedGames = selectedItems.filter(i => i.type === 'game');
    const selectedTools = selectedItems.filter(i => i.type === 'tool');

    // 更新 games 数组
    let newData = data;

    // 找到 games 数组的位置并替换
    const gamesArrayMatch = data.match(/(\/\/ Games data\n    games: \[)([\s\S]*?)(\],\n    \/\/ Tools data)/);
    if (gamesArrayMatch) {
        const gamesItems = selectedGames.map(item => `        {
            title: '${item.id}Title',
            titleEn: '${item.id}TitleEn',
            desc: '${item.id}Desc',
            descFull: '${item.id}DescFull',
            link: './names/${item.folder}/index.html',
            image: './names/${item.folder}/preview${item.folder.replace('Name', '')}.jpg',
            icon: '${getIcon(item.id)}',
            badge: 'game'
        }`).join(',\n');

        newData = newData.replace(
            /(\/\/ Games data\n    games: \[)[\s\S]*?(],\n    \/\/ Tools data)/,
            `$1\n${gamesItems}\n    $2`
        );
    }

    // 更新 tools 数组
    const toolsArrayMatch = newData.match(/(\/\/ Tools data\n    tools: \[)([\s\S]*?)(\],\n    \/\/ AI tools)/);
    if (toolsArrayMatch) {
        const toolsItems = selectedTools.map(item => `        {
            title: '${item.id}Title',
            titleEn: '${item.id}TitleEn',
            desc: '${item.id}Desc',
            link: './names/${item.folder}/index.html',
            image: './names/${item.folder}/preview${item.folder.replace('Name', '')}.jpg',
            icon: '${getIcon(item.id)}',
            badge: 'tool'
        }`).join(',\n');

        newData = newData.replace(
            /(\/\/ Tools data\n    tools: \[)[\s\S]*?(],\n    \/\/ AI tools)/,
            `$1\n${toolsItems}\n    $2`
        );
    }

    saveData(newData);

    console.log('\n✅ 已更新滚动展示列表！');
    console.log(`   展示 ${selectedGames.length} 个游戏, ${selectedTools.length} 个工具\n`);

    rl.close();
}

function getIcon(id) {
    const icons = {
        'game1': '🎮', 'game2': '🔍', 'game3': '🃏', 'game4': '🐍', 'game5': '📝',
        'game6': '🧠', 'game7': '🎯', 'game8': '⭐', 'game9': '🎨',
        'tool1': '🖨️', 'tool2': '🎯', 'tool3': '📋', 'tool4': '✏️'
    };
    return icons[id] || '🎮';
}

main().catch(e => { console.error(e); rl.close(); });
