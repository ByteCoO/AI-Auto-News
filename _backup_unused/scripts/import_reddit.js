const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 尝试加载环境变量 (简单处理 .env.local)
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// 最好使用 SERVICE_ROLE_KEY 以绕过 RLS 插入数据，如果没有则使用 ANON_KEY
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importData(filePath) {
  try {
    console.log(`⏳ Reading JSON file: ${filePath}`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(rawData);
    
    const posts = parsedData.posts || [];
    if (posts.length === 0) {
      console.log('⚠️ No posts found in the JSON file.');
      return;
    }

    console.log(`🚀 Found ${posts.length} posts. Preparing to insert...`);

    const formattedPosts = posts.map(post => ({
      subreddit: parsedData.subreddit || post.subreddit || 'unknown',
      title: post.title,
      author: post.author,
      score: post.score || 0,
      num_comments: post.num_comments || 0,
      flair: post.flair,
      created_utc: post.created_utc,
      created_beijing: post.created_beijing, // 需要数据库支持该格式转换
      url: post.url,
      permalink: post.permalink,
      selftext: post.selftext,
      is_video: post.is_video || false,
      domain: post.domain,
      rank: post.rank,
      fetch_date: parsedData.fetch_date
    }));

    const { data, error } = await supabase
      .from('reddit_posts')
      .upsert(formattedPosts, { onConflict: 'permalink' }) // 根据 permalink 去重
      .select();

    if (error) {
      console.error('❌ Error inserting data:', error);
    } else {
      console.log(`✅ Successfully inserted/updated ${data ? data.length : 0} posts from ${parsedData.subreddit}!`);
    }

  } catch (err) {
    console.error('❌ Exception occurred:', err.message);
  }
}

// 接收命令行传参作为文件路径
const targetFile = process.argv[2];
if (!targetFile) {
  console.log('Usage: node scripts/import_reddit.js <path-to-json-file>');
  process.exit(1);
}

importData(path.resolve(process.cwd(), targetFile));
