#!/usr/bin/env node
/**
 * Edu Toolbox - 编辑游戏/工具向导
 *
 * 使用方法:
 *   node scripts/edit-game.js
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

function showMenu(data) {
    console.log('\n🎓 Edu Toolbox - 编辑游戏/工具\n');
    console.log('─'.repeat(40));
    console.log('\n📋 当前列表:\n');

    const games = [];
    const tools = [];
    const aiTools = [];

    // 提取游戏
    const gameMatches = data.match(/\/\/ [^\n]+\n            (game\d)Title: '([^']+)',/g);
    if (gameMatches) {
        gameMatches.forEach(m => {
            const idMatch = m.match /(game\d)/;
            const titleMatch = m.match /Title: '([^']+)'/;
            if (idMatch && titleMatch) {
                games.push({ id: idMatch[1], title: titleMatch[1], type: 'game' });
            }
        });
    }

    // 提取工具
    const toolMatches = data.match(/\/\/ [^\n]+\n            (tool\d)Title: '([^']+)',/g);
    if (toolMatches) {
        toolMatches.forEach(m => {
            const idMatch = m.match /(tool\d)/;
            const titleMatch = m.match /Title: '([^']+)'/;
            if (idMatch && titleMatch) {
                tools.push({ id: idMatch[1], title: titleMatch[1], type: 'tool' });
            }
        });
    }

    // 提取AI工具
    const aiMatches = data.match(/\/\/ [^\n]+\n            (ai\d)Title: '([^']+)',/g);
    if (aiMatches) {
        aiMatches.forEach(m => {
            const idMatch = m.match /(ai\d)/;
            const titleMatch = m.match /Title: '([^']+)'/;
            if (idMatch && titleMatch) {
                aiTools.push({ id: idMatch[1], title: titleMatch[1], type: 'ai' });
            }
        });
    }

    console.log('🎮 游戏:');
    games.forEach((g, i) => console.log(`   ${i + 1}. [${g.id}] ${g.title}`));

    console.log('\n🛠️ 工具:');
    tools.forEach((t, i) => console.log(`   ${games.length + i + 1}. [${t.id}] ${t.title}`));

    if (aiTools.length > 0) {
        console.log('\n🤖 AI工具:');
        aiTools.forEach((a, i) => console.log(`   ${games.length + tools.length + i + 1}. [${a.id}] ${a.title}`));
    }

    return { games, tools, aiTools };
}

async function main() {
    const data = loadData();
    const { games, tools, aiTools } = showMenu(data);

    console.log('\n' + '─'.repeat(40));
    const choice = await question('\n请输入要编辑的编号 (0 退出): ');

    if (choice === '0' || choice === '') {
        console.log('\n已退出\n');
        rl.close();
        return;
    }

    const num = parseInt(choice);
    let selected = null;
    let type = '';

    if (num >= 1 && num <= games.length) {
        selected = games[num - 1];
        type = 'game';
    } else if (num > games.length && num <= games.length + tools.length) {
        selected = tools[num - games.length - 1];
        type = 'tool';
    } else if (num > games.length + tools.length && num <= games.length + tools.length + aiTools.length) {
        selected = aiTools[num - games.length - tools.length - 1];
        type = 'ai';
    } else {
        console.log('\n❌ 无效的编号\n');
        rl.close();
        return;
    }

    console.log(`\n✏️  编辑: [${selected.id}] ${selected.title}`);
    console.log('─'.repeat(40));

    // 获取当前信息
    const id = selected.id;
    const titleZh = await question(`中文名称 (当前: ${selected.title}): `);
    const descZh = await question('简短描述(中文): ');
    const descFullZh = await question('完整描述(中文): ');

    console.log('\n' + '─'.repeat(40));
    console.log('\n📋 确认修改:\n');
    console.log(`ID: ${id}`);
    console.log(`中文名称: ${titleZh}`);
    console.log(`简短描述: ${descZh}`);
    console.log(`完整描述: ${descFullZh}`);

    const confirm = await question('\n确认保存？(y/n): ');
    if (confirm.toLowerCase() !== 'y') {
        console.log('\n❌ 已取消\n');
        rl.close();
        return;
    }

    // 更新 data.js
    let newData = data;

    // 更新中文标题
    const titleZhRegex = new RegExp(`(\/\/ [^\\n]+\\n            ${id}Title: ')[^']+(')`);
    newData = newData.replace(titleZhRegex, `$1${titleZh}$2`);

    // 更新描述
    const descZhRegex = new RegExp(`(${id}Desc: ')[^']+(')`);
    newData = newData.replace(descZhRegex, `$1${descZh}$2`);

    const descFullZhRegex = new RegExp(`(${id}DescFull: ')[^']*(')`);
    if (type !== 'ai') {
        newData = newData.replace(descFullZhRegex, `$1${descFullZh}$2`);
    }

    saveData(newData);

    console.log('\n✅ 保存成功！\n');
    rl.close();
}

main().catch(e => { console.error(e); rl.close(); });
