import { createClient } from '@supabase/supabase-js';

// 1. 模拟文章数据 (从 page.tsx 复制而来)
const mockArticles = [
  { id: 1, slug: 'openai-gpt-5-rumor', category: 'UPDATES', title: '有传言说OpenAI 正在准备推出其下一代大型 AI 模型 GPT-5', summary: '最快将在八月发布，可能是为了避开欧洲 8 月 2 号生效的严格 AI 法案。', tags: ['AI'], source: 'www.theverge.com', date: '7/29/2025' },
  { id: 2, slug: 'google-imo-2025', category: 'UPDATES', title: '谷歌也宣布自己得了 IMO 2025 的金牌', summary: '他们这个是 IMO 委员会评估认证过的，没有像 Open AI 那样抢跑。', tags: ['评估', 'AI'], source: 'x.com', date: '7/29/2025' },
  { id: 3, slug: 'google-q2-earnings', category: 'UPDATES', title: '谷歌二季度财报发了', summary: '每月处理的 tokens 数量从5月的480万亿增长到现在的980万亿。AI 概览功能在搜索中已覆盖200个国家/地区、40种语言，月活用户超过...', tags: ['AI'], source: 'x.com', date: '7/29/2025' },
  { id: 4, slug: 'midjourney-video-update', category: 'UPDATES', title: 'Midjourney 视频生成更新', summary: '现在可以制作循环视频和首尾帧视频，循环视频还需要勾选 loop 选项就行。', tags: ['Midjourney', '视频生成', 'AI'], source: 'x.com', date: '7/29/2025' },
  { id: 5, slug: 'claude-code-agent', category: 'UPDATES', title: 'Claude Code 发布子 Agent 功能', summary: '输入 /agents 命令开启，现在提示词里可以指挥各种嵌套的 Agent 执行任务了，子 Agent 允许你创建一组专门处理不同任务的定制Agent。比...', tags: ['Claude', '对话', 'Agent'], source: 'x.com', date: '7/29/2025' },
  { id: 6, slug: 'chatgpt-agent-mode', category: 'UPDATES', title: 'chatgpt 的 Agent 模式已经全量向所有付费用户提供', summary: '。', tags: ['GPT-4', '对话', 'Agent'], source: 'x.com', date: '7/29/2025' },
  { id: 7, slug: 'cursor-pr-bug-detection', category: 'UPDATES', title: 'Cursor 推出了一套能自动检测 PR 逻辑 bug 的系统', summary: '非常贵 40 美元加 Token 付费，系统核心是 Bugbot，专注于检测最难发现的逻辑 bug，并保持低误报率。它结合多种模型、加大算力，并...', tags: [], source: 'x.com', date: '7/29/2025' },
  { id: 8, slug: 'dia-skill-library', category: 'UPDATES', title: 'Dia 这个官方的提示词 (skill) 库现在支持直接添加到浏览器了', summary: '喜欢哪个提示词一键添加。', tags: ['代码', '提示词', 'AI'], source: 'x.com', date: '7/29/2025' },
  { id: 9, slug: 'google-notebooklm-video', category: 'UPDATES', title: '谷歌 NotebookLM 的视频概览功能要上线了', summary: '原来是用来跟播客绑定的PPT时间轴的方式来实现，这种效果好啊，成本低而且方便理解播客内容，还能导出完整视频。', tags: [], source: 'x.com', date: '7/29/2025' },
];


// 2. 从环境变量加载 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('错误: 缺少 Supabase 环境变量。');
  console.error('请确保 .env.local 文件中存在 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。');
  process.exit(1);
}

// 3. 初始化 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 4. 将模拟数据映射到数据库表结构
const postsToInsert = mockArticles.map(article => ({
  title: article.title,
  slug: article.slug,
  content: article.summary, // 由于没有完整内容，暂时使用摘要作为内容
  excerpt: article.summary,
  cover_image_url: `/images/covers/${article.slug}.png`, // 创建一个占位图片链接
  category: article.category,
  tags: article.tags,
  status: 'published', // 设置默认状态为 'published'
  youtube_url: null, // 模拟数据中无此字段
  source: article.source,
}));

// 5. 执行上传操作的主函数
async function uploadPosts() {
  console.log('开始上传数据到 Supabase...');

  console.log(`准备插入 ${postsToInsert.length} 条文章数据...`);

  const { data, error } = await supabase
    .from('posts')
    .insert(postsToInsert)
    .select(); // .select() 会返回插入的数据

  if (error) {
    console.error('数据插入失败:', error);
  } else {
    console.log('数据插入成功!');
    console.log('已插入的记录:', data);
  }
}

// 6. 运行主函数
uploadPosts();