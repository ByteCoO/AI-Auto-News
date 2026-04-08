#!/usr/bin/env node

/**
 * Google Search Console 自动化设置脚本
 * 使用方法: node scripts/setup-gsc.js [verification-code]
 */

const fs = require('fs');
const path = require('path');

const VERIFICATION_CODE_PLACEHOLDER = 'your-google-site-verification-code-here';
const LAYOUT_FILE_PATH = path.join(process.cwd(), 'app', 'layout.tsx');

function updateVerificationCode(verificationCode) {
  try {
    // 读取layout.tsx文件
    if (!fs.existsSync(LAYOUT_FILE_PATH)) {
      console.error('❌ 错误: 找不到 app/layout.tsx 文件');
      process.exit(1);
    }

    let content = fs.readFileSync(LAYOUT_FILE_PATH, 'utf8');
    
    // 检查是否包含占位符
    if (!content.includes(VERIFICATION_CODE_PLACEHOLDER)) {
      console.log('⚠️  警告: 未找到验证码占位符，可能已经设置过了');
      return;
    }

    // 替换验证码
    const updatedContent = content.replace(
      VERIFICATION_CODE_PLACEHOLDER,
      verificationCode
    );

    // 写入文件
    fs.writeFileSync(LAYOUT_FILE_PATH, updatedContent, 'utf8');
    
    console.log('✅ 成功更新 Google Search Console 验证码');
    console.log(`📁 文件位置: ${LAYOUT_FILE_PATH}`);
    console.log(`🔑 验证码: ${verificationCode}`);

  } catch (error) {
    console.error('❌ 更新验证码时出错:', error.message);
    process.exit(1);
  }
}

function showUsage() {
  console.log(`
🔍 Google Search Console 设置脚本

使用方法:
  node scripts/setup-gsc.js <verification-code>

示例:
  node scripts/setup-gsc.js abcdefgh12345678

步骤:
1. 访问 https://search.google.com/search-console/
2. 添加资源: https://visionong.dpdns.org
3. 选择 HTML 标签验证方法
4. 复制验证码并运行此脚本
5. 重新部署网站
6. 在 GSC 中点击"验证"

要提交的 Sitemap:
- https://visionong.dpdns.org/sitemap.xml
- https://visionong.dpdns.org/news-sitemap.xml
`);
}

function checkSitemaps() {
  console.log('\n📊 检查 Sitemap 配置...\n');
  
  const sitemaps = [
    'app/sitemap.ts',
    'app/news-sitemap.xml/route.ts',
    'app/rss.xml/route.ts'
  ];

  sitemaps.forEach(sitemap => {
    const fullPath = path.join(process.cwd(), sitemap);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${sitemap} - 已配置`);
    } else {
      console.log(`❌ ${sitemap} - 未找到`);
    }
  });

  console.log('\n🔗 可用的 Sitemap URLs:');
  console.log('   • https://visionong.dpdns.org/sitemap.xml');
  console.log('   • https://visionong.dpdns.org/news-sitemap.xml');
  console.log('   • https://visionong.dpdns.org/rss.xml');
}

function generateGSCTasks() {
  console.log(`
📋 Google Search Console 设置任务清单:

□ 1. 网站验证
   - 访问 https://search.google.com/search-console/
   - 添加资源: https://visionong.dpdns.org
   - 选择 HTML 标签验证方法
   - 运行: node scripts/setup-gsc.js <verification-code>

□ 2. 提交 Sitemap
   - 在 GSC 中转到 "Sitemaps" 部分
   - 添加: sitemap.xml
   - 添加: news-sitemap.xml

□ 3. 配置设置
   - 设置首选域名
   - 配置国际定位
   - 设置抓取频率

□ 4. 监控设置
   - 启用电子邮件通知
   - 配置性能监控
   - 设置 Core Web Vitals 监控

□ 5. 验证完成
   - 检查索引覆盖率
   - 验证搜索性能数据
   - 确认没有错误或警告

🎯 预期结果:
   - 1-2周内开始看到搜索数据
   - 页面逐步被索引
   - 性能指标开始显示
`);
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showUsage();
    checkSitemaps();
    generateGSCTasks();
    return;
  }

  const command = args[0];

  switch (command) {
    case '--check':
    case '-c':
      checkSitemaps();
      break;
    
    case '--help':
    case '-h':
      showUsage();
      break;
      
    case '--tasks':
    case '-t':
      generateGSCTasks();
      break;

    default:
      // 假设第一个参数是验证码
      if (command.length < 10) {
        console.error('❌ 错误: 验证码长度太短，请检查是否正确');
        process.exit(1);
      }
      
      updateVerificationCode(command);
      console.log('\n📋 接下来的步骤:');
      console.log('1. 重新部署网站');
      console.log('2. 在 Google Search Console 中点击"验证"');
      console.log('3. 提交 sitemap.xml 和 news-sitemap.xml');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  updateVerificationCode,
  checkSitemaps,
  generateGSCTasks
};