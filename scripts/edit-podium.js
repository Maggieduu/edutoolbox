#!/usr/bin/env node
/**
 * Edu Toolbox - 编辑 Podium 人气榜单
 *
 * 使用方法:
 *   node scripts/edit-podium.js
 *
 * 控制首页 Podium 展示哪3个游戏
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

function getAllItems(data) {
    const allItems = [];

    // 游戏
    const gameMatches = data.match(/\/\/ [^\n]+\n            (game\d)Title: '([^']+)',\n            \1TitleEn: '([^']*)',\n            \1Desc: '([^']+)',\n            \1DescFull: '([^']+)',/g);
    if (gameMatches) {
        gameMatches.forEach(m => {
            const idMatch = m.match(/(game\d)/);
            const titleMatch = m.match(/Title: '([^']+)'/);
            const descFullMatch = m.match(/DescFull: '([^']+)'/);
            if (idMatch && titleMatch) {
                allItems.push({
                    id: idMatch[1],
                    title: titleMatch[1],
                    descFull: descFullMatch ? descFullMatch[1] : '',
                    type: 'game',
                    folder: 'Name' + idMatch[1].replace('game', '')
                });
            }
        });
    }

    // 工具
    const toolMatches = data.match(/\/\/ [^\n]+\n            (tool\d)Title: '([^']+)',\n            \1TitleEn: '([^']*)',\n            \1Desc: '([^']+)',/g);
    if (toolMatches) {
        toolMatches.forEach(m => {
            const idMatch = m.match(/(tool\d)/);
            const titleMatch = m.match(/Title: '([^']+)'/);
            const descMatch = m.match(/Desc: '([^']+)'/);
            if (idMatch && titleMatch) {
                allItems.push({
                    id: idMatch[1],
                    title: titleMatch[1],
                    descFull: descMatch ? descMatch[1] : '',
                    type: 'tool',
                    folder: 'Name' + idMatch[1].replace('tool', '')
                });
            }
        });
    }

    return allItems;
}

function getCurrentTopGames(data) {
    const topGames = [];
    const matches = data.match(/\/\* Top 3 games for podium \*\/\n    topGames: \[([\s\S]*?)\],/);

    if (matches) {
        const items = matches[1].matchAll(/title: '([^']+)',\n            desc: '([^']+)',\n            link: '([^']+)',\n            icon: '([^']+)',\n            rank: (\d+),\n            popularity: '([^']+)'/g);

        for (const match of items) {
            topGames.push({
                title: match[1],
                desc: match[2],
                link: match[3],
                icon: match[4],
                rank: match[5],
                popularity: match[6]
            });
        }
    }

    return topGames;
}

async function main() {
    console.log('\n🎓 Edu Toolbox - 编辑 Podium 人气榜单\n');
    console.log('─'.repeat(40));

    const data = loadData();
    const allItems = getAllItems(data);
    const currentTop = getCurrentTopGames(data);

    console.log('\n📋 所有可用项目:\n');
    allItems.forEach((item, i) => {
        console.log(`   ${i + 1}. [${item.type}] ${item.title} (${item.id})`);
    });

    console.log('\n' + '─'.repeat(40));
    console.log('\n🏆 当前 Podium 排名:\n');

    currentTop.forEach(item => {
        const itemData = allItems.find(i => i.title === item.title);
        if (itemData) {
            console.log(`   🥇 第${item.rank}名: ${item.title}`);
            console.log(`      描述: ${item.desc}`);
            console.log(`      图标: ${item.icon}`);
        }
    });

    console.log('\n' + '─'.repeat(40));
    console.log('\n✏️  请输入新的第1/2/3名编号 (用空格分隔，如: 2 4 1)\n');

    const newOrder = await question('新排名 (如: 2 4 1): ');

    if (!newOrder || newOrder.trim() === '') {
        console.log('\n❌ 已取消\n');
        rl.close();
        return;
    }

    const orderNums = newOrder.split(' ').map(n => parseInt(n.trim()) - 1);

    if (orderNums.length !== 3 || orderNums.some(n => isNaN(n) || n < 0 || n >= allItems.length)) {
        console.log('\n❌ 无效的输入\n');
        rl.close();
        return;
    }

    const [first, second, third] = orderNums;
    const selectedItems = [
        allItems[first],
        allItems[second],
        allItems[third]
    ];

    console.log('\n📋 确认新排名:\n');
    console.log(`   🥇 第1名: ${selectedItems[0].title}`);
    console.log(`   🥈 第2名: ${selectedItems[1].title}`);
    console.log(`   🥉 第3名: ${selectedItems[2].title}`);

    const confirm = await question('\n确认保存？(y/n): ');
    if (confirm.toLowerCase() !== 'y') {
        console.log('\n❌ 已取消\n');
        rl.close();
        return;
    }

    // 更新 data.js
    const newTopGames = `    // Top 3 games for podium
    topGames: [
        {
            title: '${selectedItems[0].id}Title',
            desc: '${selectedItems[0].id}DescFull',
            link: './names/${selectedItems[0].folder}/index.html',
            icon: '${selectedItems[0].type === 'game' ? '🔍' : '🧠'}',
            rank: 1,
            popularity: 'hot'
        },
        {
            title: '${selectedItems[1].id}Title',
            desc: '${selectedItems[1].id}DescFull',
            link: './names/${selectedItems[1].folder}/index.html',
            icon: '${selectedItems[1].type === 'game' ? '🎮' : '🧠'}',
            rank: 2,
            popularity: 'plays'
        },
        {
            title: '${selectedItems[2].id}Title',
            desc: '${selectedItems[2].id}DescFull',
            link: './names/${selectedItems[2].folder}/index.html',
            icon: '${selectedItems[2].type === 'game' ? '📝' : '🧠'}',
            rank: 3,
            popularity: 'rating'
        }
    ]`;

    let newData = data.replace(/\/\* Top 3 games for podium \*\/\n    topGames: \[[\s\S]*?\],/, newTopGames);

    saveData(newData);

    console.log('\n✅ 保存成功！\n');
    rl.close();
}

main().catch(e => { console.error(e); rl.close(); });
