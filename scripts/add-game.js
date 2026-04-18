#!/usr/bin/env node
/**
 * Edu Toolbox - 添加游戏/工具向导
 *
 * 使用方法:
 *   node scripts/add-game.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

function getNextFolderNum(namesPath) {
    const entries = fs.readdirSync(namesPath);
    const nums = entries
        .filter(e => e.startsWith('Name') && fs.statSync(path.join(namesPath, e)).isDirectory())
        .map(e => parseInt(e.replace('Name', '')))
        .filter(n => !isNaN(n));
    return nums.length > 0 ? Math.max(...nums) + 1 : 1;
}

function generateGamesList() {
    const namesPath = path.join(__dirname, '..', 'names');
    const entries = fs.readdirSync(namesPath);
    const folders = entries
        .filter(e => e.startsWith('Name') && fs.statSync(path.join(namesPath, e)).isDirectory())
        .sort((a, b) => parseInt(a.replace('Name', '')) - parseInt(b.replace('Name', '')));

    const games = folders.map(folder => {
        const indexPath = path.join(namesPath, folder, 'index.html');
        let title = folder;
        if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf8');
            const match = content.match(/<title>(.*?)<\/title>/);
            if (match) {
                title = match[1].trim();
            }
        }
        return { folder, title };
    });

    return JSON.stringify({ games }, null, 2);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = p => new Promise(r => rl.question(p, a => r(a.trim())));

async function main() {
    console.log('\n🎓 Edu Toolbox - 添加游戏/工具向导\n');
    console.log('─'.repeat(40));

    const typeChoice = await question('类型: 1=游戏, 2=工具: ');
    const type = typeChoice === '2' ? 'tool' : 'game';
    const typeName = type === 'game' ? '游戏' : '工具';

    const namesPath = path.join(__dirname, '..', 'names');
    const nextNum = getNextFolderNum(namesPath);
    const folder = 'Name' + nextNum;

    console.log('\n添加新的 ' + typeName + ' (' + folder + ')\n');
    console.log('─'.repeat(40));

    const titleZh = await question('中文名称: ');
    const titleEn = await question('英文名称: ');
    const descZh = await question('\n简短描述(中文): ');
    const descEn = await question('简短描述(英文): ');
    const descFullZh = await question('\n完整描述(中文): ');
    const descFullEn = await question('完整描述(英文): ');

    console.log('\n图标: 🎮 🔍 🃏 🐍 📝 🎯 🧠 ⭐ 🎨 📖 ✏️ 🏆 💡 🔤');
    const iconChoice = await question('选择图标序号(1-14, 默认1): ');
    const icons = ['🎮', '🔍', '🃏', '🐍', '📝', '🎯', '🧠', '⭐', '🎨', '📖', '✏️', '🏆', '💡', '🔤'];
    const icon = icons[parseInt(iconChoice) - 1] || '🎮';

    console.log('\n' + '─'.repeat(40));
    console.log('\n📋 确认信息:\n');
    console.log('类型: ' + typeName);
    console.log('文件夹: names/' + folder + '/');
    console.log('中文名称: ' + titleZh);
    console.log('英文名称: ' + titleEn);
    console.log('简短描述: ' + descZh + ' / ' + descEn);
    console.log('完整描述: ' + descFullZh + ' / ' + descEn);
    console.log('图标: ' + icon);

    const confirm = await question('\n确认创建文件夹？(y/n): ');
    if (confirm.toLowerCase() !== 'y') {
        console.log('\n❌ 已取消\n');
        rl.close();
        return;
    }

    const folderPath = path.join(__dirname, '..', 'names', folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // 创建临时 index.html 作为占位
    const placeholderHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titleZh}</title>
</head>
<body>
    <h1>${icon} ${titleZh}</h1>
    <p>${descZh}</p>
    <p>请替换为实际游戏内容</p>
</body>
</html>`;
    fs.writeFileSync(path.join(folderPath, 'index.html'), placeholderHtml);

    // 更新 games.json 目录
    const gamesJsonPath = path.join(__dirname, '..', 'games.json');
    fs.writeFileSync(gamesJsonPath, generateGamesList());

    console.log('\n✅ 已创建:');
    console.log('   - names/' + folder + '/index.html');
    console.log('   - games.json (已更新)');

    console.log('\n📝 下一步:');
    console.log('1. 替换 names/' + folder + '/index.html 为实际游戏');
    console.log('2. 添加预览图 names/' + folder + '/preview' + nextNum + '.jpg (可选)');
    console.log('3. 在 js/data.js 中添加数据\n');

    rl.close();
}

main().catch(e => { console.error(e); rl.close(); });
