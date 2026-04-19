/* ========================================
   Edu Toolbox - Content Data
   ======================================== */

// All content data - edit this file to update site content
const SITE_DATA = {
    // Navigation
    nav: [
        { name: '首页', nameEn: 'Home', link: 'index.html', active: false },
        { name: '游戏', nameEn: 'Games', link: 'games.html', active: false },
        { name: '工具', nameEn: 'Tools', link: 'tools.html', active: false },
        { name: 'AI助手', nameEn: 'AI', link: 'ai.html', active: false },
        { name: '其他资源', nameEn: 'Resources', link: 'resources.html', active: false },
        { name: '社区', nameEn: 'Community', link: 'community.html', commingSoon: false }
    ],

    // Translations
    translations: {
        zh: {
            title: 'Edu Toolbox',
            subtitle: 'AI 赋能的语言教学工具平台',
            social: '🔥 600+ 教育工作者信赖 | 2,000+ 社区用户',
            featured: '精选',
            typing: '让学习变得更有趣，让教学更加轻松',
            ranking: '🔥 本月人气榜单',
            tagline1: '打造<strong>差异化</strong>教学，创造<strong>个性化</strong>学习体验',
            tagline2: '赋能 <strong>600+</strong> 教育工作者，帮助 <strong>每一个</strong>学生在自己的节奏中进步',

            // Category descriptions
            catGames: '趣味学习，边玩边学',
            catTools: '教学辅助高效便捷',
            catAi: '智能辅助教学创作',
            catResources: '丰富学习资源库',

            // Buttons
            play: '我要试用 →',
            learn: '开始学习 →',
            generate: '一键生成 →',
            use: '使用工具 →',
            try: '试试看 →',
            browse: '浏览 →',
            watch: '观看 →',
            back: '← 返回首页',
            loginBtn: '登录 / 注册',
            startBtn: '开始 →',

            // Badges
            game: '游戏',
            tool: '工具',
            ai: 'AI',
            resource: '资源',
            coming: '即将上线',

            // Popularity
            plays: '1,234 次游玩',
            hot: '本周热门',
            rating: '4.9 分',

            // 五子棋
            game1Title: '五子棋',
            game1TitleEn: 'Gomoku',
            game1Desc: '复习同义词反义词',
            game1DescFull: '利用五子棋来复习同义词和反义词，在对弈中加深词汇记忆',
            // 汉字大侦探
            game2Title: '汉字大侦探',
            game2TitleEn: 'Word Detective',
            game2Desc: '在线词语搜索',
            game2DescFull: '在线玩词语搜索游戏，挑战你的词汇量。支持多种难度级别，适合不同水平的学习者。',
            // 生词翻翻看
            game3Title: '生词翻翻看',
            game3TitleEn: 'Words Match',
            game3Desc: '翻转卡牌记忆',
            game3DescFull: '通过翻转卡牌加深对目标词汇的记忆',
            // 贪吃蛇
            game4Title: '贪吃蛇',
            game4TitleEn: 'Gluttonous Snake',
            game4Desc: '吃掉错误单词',
            game4DescFull: '吃掉错误的单词，快来挑战最高分',
            // 疯狂的句子
            game5Title: '疯狂的句子',
            game5TitleEn: 'Scrambled Sentences',
            game5Desc: '组合正确句子',
            game5DescFull: '把词语按照正确的顺序组合成句子',
            // 汉字大侦探
            tool1Title: '汉字大侦探',
            tool1TitleEn: 'Word Detective Generator',
            tool1Desc: '可生成词语搜索的工作纸，方便打印练习',
            // 随机点名器
            tool2Title: '随机点名器',
            tool2TitleEn: 'Name Picker',
            tool2Desc: '老师输入学生名字，随机抽取一位幸运同学',

            // AI
            ai1Title: '作文批改助手',
            ai1Desc: 'AI自动批改作文，提供修改建议',
            ai2Title: '造句生成器',
            ai2Desc: '根据词汇AI智能生成例句',
            ai3Title: '阅读理解生成',
            ai3Desc: '根据文本自动生成阅读理解题目',
            ai4Title: '情境对话生成',
            ai4Desc: 'AI生成特定情境的对话练习',

            // Resources
            res1Title: '词汇表',
            res1Desc: '常用词汇分类整理，支持HSK和CEFR标准',
            res2Title: '教学视频',
            res2Desc: '精选教学视频资源',
            res3Title: '工作表模板',
            res3Desc: '可打印的工作表模板',
            res4Title: '文化素材',
            res4Desc: '中国传统文化素材',

            // Footer
            footerTagline: '让教育更有趣，让学习更轻松',
            copyright: '© 2024 Edu Toolbox. All rights reserved.',

            // Language switcher
            langZh: '中文',
            langEn: 'EN',

            langEn: 'EN',

            langEn: 'EN',

            langEn: 'EN',

            langEn: 'EN',
            tagline1: 'Creating <strong>differentiated</strong> teaching and <strong>personalized</strong> learning experiences',
            langEn: 'EN'
        },

        en: {
            title: 'Edu Toolbox',
            subtitle: 'AI-Powered Tools for Language Educators',
            social: '🔥 Trusted by 600+ Educators | 2,000+ Community Followers',
            featured: 'Featured',
            typing: 'Interactive Teaching Tools, Make teaching fun and easy',
            ranking: '🔥 Monthly Top Games',
            tagline1: 'Creating differentiated teaching and personalized learning experiences',
            tagline2: 'Empowering <strong>600+</strong> educators, helping <strong>every</strong> student progress at their own pace',

            catGames: 'Learn while playing',
            catTools: 'Efficient teaching aids',
            catAi: 'Smart teaching creation',
            catResources: 'Rich learning library',

            play: 'Play Now →',
            learn: 'Start Learning →',
            generate: 'Generate →',
            use: 'Use Tool →',
            try: 'Try It →',
            browse: 'Browse →',
            watch: 'Watch →',
            back: '← Back to Home',
            loginBtn: 'Login / Register',
            startBtn: 'Start →',

            game: 'Game',
            tool: 'Tool',
            ai: 'AI',
            resource: 'Resource',
            coming: 'Coming Soon',

            plays: '1,234 plays',
            hot: 'Trending',
            rating: '4.9 rating',

            // Gomoku
            game1Title: 'Gomoku',
            game1TitleEn: '',
            game1Desc: 'Review synonyms and antonyms through Gomoku',
            game1DescFull: 'Review synonyms and antonyms through Gomoku',
            // Word Detective
            game2Title: 'Word Detective',
            game2TitleEn: '',
            game2Desc: 'Play word search puzzles online and challenge your vocabulary',
            game2DescFull: 'Play word search puzzles online and challenge your vocabulary',
            // Words Match
            game3Title: 'Words Match',
            game3TitleEn: '',
            game3Desc: 'Reinforce vocabulary memory through card flipping',
            game3DescFull: 'Reinforce vocabulary memory through card flipping',
            // Gluttonous Snake
            game4Title: 'Gluttonous Snake',
            game4TitleEn: '',
            game4Desc: 'Eat the wrong words and compete for high scores',
            game4DescFull: 'Eat the wrong words and compete for high scores',
            // Scrambled Sentences
            game5Title: 'Scrambled Sentences',
            game5TitleEn: '',
            game5Desc: 'Arrange words into correct sentence order',
            game5DescFull: 'Arrange words into correct sentence order',
            // Word Detective Generator
            tool1Title: 'Word Detective Generator',
            tool1TitleEn: '',
            tool1Desc: 'Generate word search worksheets for printing',
            // Name Picker
            tool2Title: 'Name Picker',
            tool2TitleEn: '',
            tool2Desc: 'Randomly select one lucky student',
            ai1Title: 'Essay Corrector',
            ai1Desc: 'AI automatically grades essays with feedback',
            ai2Title: 'Sentence Generator',
            ai2Desc: 'AI generates example sentences based on vocabulary',
            ai3Title: 'Reading Comprehension',
            ai3Desc: 'Generate reading comprehension questions',
            ai4Title: 'Dialogue Generator',
            ai4Desc: 'AI generates situational dialogue practice',

            res1Title: 'Vocabulary List',
            res1Desc: 'Organized vocabulary by category',
            res2Title: 'Teaching Videos',
            res2Desc: 'Curated teaching video resources',
            res3Title: 'Worksheet Templates',
            res3Desc: 'Printable worksheet templates',
            res4Title: 'Cultural Materials',
            res4Desc: 'Chinese traditional culture resources',

            footerTagline: 'Making education fun and learning easier',
            copyright: '© 2024 Edu Toolbox. All rights reserved.',

            langZh: '中文',
            langEn: 'EN'
        }
    },

    // Games data
    games: [
        {
            title: 'game1Title',
            titleEn: 'game1TitleEn',
            desc: 'game1Desc',
            descFull: 'game1DescFull',
            link: './names/Name1/index.html',
            image: './names/Name1/preview1.jpg',
            icon: '🎮',
            badge: 'game'
        },
        {
            title: 'game2Title',
            titleEn: 'game2TitleEn',
            desc: 'game2Desc',
            descFull: 'game2DescFull',
            link: './names/Name2/index.html',
            image: './names/Name2/preview2.jpg',
            icon: '🔍',
            badge: 'game'
        },
        {
            title: 'game3Title',
            titleEn: 'game3TitleEn',
            desc: 'game3Desc',
            descFull: 'game3DescFull',
            link: './names/Name4/index.html',
            image: './names/Name4/preview4.jpg',
            icon: '🃏',
            badge: 'game'
        },
        {
            title: 'game4Title',
            titleEn: 'game4TitleEn',
            desc: 'game4Desc',
            descFull: 'game4DescFull',
            link: './names/Name5/index.html',
            image: './names/Name5/preview5.jpg',
            icon: '🐍',
            badge: 'game'
        },
        {
            title: 'game5Title',
            titleEn: 'game5TitleEn',
            desc: 'game5Desc',
            descFull: 'game5DescFull',
            link: './names/Name6/index.html',
            image: './names/Name6/preview6.jpg',
            icon: '📝',
            badge: 'game'
        }
    ],

    // Tools data
    tools: [
        {
            title: 'tool1Title',
            titleEn: 'tool1TitleEn',
            desc: 'tool1Desc',
            link: './names/Name3/index.html',
            image: './names/Name3/preview3.jpg',
            icon: '🖨️',
            badge: 'tool'
        },
        {
            title: 'tool2Title',
            titleEn: 'tool2TitleEn',
            desc: 'tool2Desc',
            link: './names/Name7/index.html',
            image: './names/Name7/preview7.jpg',
            icon: '🎯',
            badge: 'tool'
        }
    ],

    // AI tools (placeholder)
    aiTools: [
        {
            title: 'ai1Title',
            desc: 'ai1Desc',
            link: '#',
            icon: '📝',
            coming: true
        },
        {
            title: 'ai2Title',
            desc: 'ai2Desc',
            link: '#',
            icon: '🎨',
            coming: true
        },
        {
            title: 'ai3Title',
            desc: 'ai3Desc',
            link: '#',
            icon: '📖',
            coming: true
        },
        {
            title: 'ai4Title',
            desc: 'ai4Desc',
            link: '#',
            icon: '🎮',
            coming: true
        }
    ],

    // Resources (placeholder)
    resources: [
        {
            title: 'res1Title',
            desc: 'res1Desc',
            link: '#',
            icon: '📖',
            coming: true
        },
        {
            title: 'res2Title',
            desc: 'res2Desc',
            link: '#',
            icon: '🎬',
            coming: true
        },
        {
            title: 'res3Title',
            desc: 'res3Desc',
            link: '#',
            icon: '📄',
            coming: true
        },
        {
            title: 'res4Title',
            desc: 'res4Desc',
            link: '#',
            icon: '🎨',
            coming: true
        }
    ],

    // Top 3 games for podium
    topGames: [
        {
            title: 'game2Title',
            desc: 'game2DescFull',
            link: './names/Name2/index.html',
            icon: '🔍',
            rank: 1,
            popularity: 'hot'
        },
        {
            title: 'game4Title',
            desc: 'game4DescFull',
            link: './names/Name5/index.html',
            icon: '🐍',
            rank: 2,
            popularity: 'plays'
        },
        {
            title: 'game1Title',
            desc: 'game1DescFull',
            link: './names/Name1/index.html',
            icon: '🎮',
            rank: 3,
            popularity: 'rating'
        }
    ]
};

// ========================================
// INVITE CODE SETTINGS
// ========================================
const INVITE_CODE = 'himaggie';  // Change this to your desired code

// ========================================

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SITE_DATA;
}