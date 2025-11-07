'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface Step {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  timeEstimate: string;
}

export default function GSCConfigWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [gscUrl, setGscUrl] = useState('');
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: '获取Google验证码',
      description: '从Google Search Console获取验证码',
      status: 'active',
      timeEstimate: '90秒'
    },
    {
      id: 2,
      title: '配置验证码',
      description: '将验证码添加到网站',
      status: 'pending',
      timeEstimate: '30秒'
    },
    {
      id: 3,
      title: '验证网站',
      description: '在GSC中验证网站所有权',
      status: 'pending',
      timeEstimate: '30秒'
    },
    {
      id: 4,
      title: '提交Sitemap',
      description: '提交sitemap到搜索引擎',
      status: 'pending',
      timeEstimate: '30秒'
    }
  ]);

  const updateStepStatus = (stepId: number, status: Step['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const goToNextStep = () => {
    updateStepStatus(currentStep, 'completed');
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      updateStepStatus(currentStep + 1, 'active');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* 头部 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 Google Search Console 配置向导
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          跟随这个向导，3分钟完成GSC配置
        </p>
      </div>

      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                ${step.status === 'completed' 
                  ? 'bg-green-500 text-white' 
                  : step.status === 'active'
                  ? 'bg-blue-500 text-white'
                  : step.status === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-300 text-gray-700'
                }
              `}>
                {step.status === 'completed' ? '✓' : step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            步骤 {currentStep} / {steps.length}
          </span>
        </div>
      </div>

      {/* 步骤内容 */}
      <div className="space-y-6">
        
        {/* 第1步：获取验证码 */}
        {currentStep === 1 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-4">
              📋 第1步：获取Google验证码 (90秒)
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <h4 className="font-semibold mb-2">🌐 打开Google Search Console</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  点击下面的链接打开GSC（建议在新标签页中打开）:
                </p>
                <a 
                  href="https://search.google.com/search-console/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  🔗 打开 Google Search Console
                </a>
              </div>

              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <h4 className="font-semibold mb-2">➕ 添加资源</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>点击左上角的 <strong>"添加资源"</strong> 按钮</li>
                  <li>选择 <strong>"URL前缀"</strong> 选项（不要选择域名）</li>
                  <li>在输入框中输入：<code className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">https://visionong.dpdns.org</code></li>
                  <li>点击 <strong>"继续"</strong> 按钮</li>
                </ol>
              </div>

              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <h4 className="font-semibold mb-2">🏷️ 选择验证方法</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>在验证页面中，选择 <strong>"HTML标签"</strong> 方法（第一个选项）</li>
                  <li>复制显示的代码中 <code>content="..."</code> 里面的内容</li>
                  <li><strong>注意</strong>：只复制引号内的验证码，不要复制引号</li>
                </ol>
                
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                  <p className="text-sm">
                    <strong>示例：</strong> 如果显示 <code>&lt;meta name="google-site-verification" content="abcd1234efgh5678" /&gt;</code><br/>
                    您只需要复制 <code>abcd1234efgh5678</code>
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <h4 className="font-semibold mb-2">📋 粘贴验证码</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  请将从GSC复制的验证码粘贴到下面：
                </p>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="例如: abcd1234efgh5678"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  验证码通常是16-32位的字母数字组合
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={goToNextStep}
                disabled={verificationCode.length < 10}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                验证码已获取 → 下一步
              </button>
            </div>
          </div>
        )}

        {/* 第2步：配置验证码 */}
        {currentStep === 2 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-4">
              ⚙️ 第2步：配置验证码 (30秒)
            </h3>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <h4 className="font-semibold mb-2">🎯 您的验证码</h4>
                <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded font-mono text-sm">
                  {verificationCode || '未设置'}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* 方式1：可视化界面 */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                  <h4 className="font-semibold text-blue-600 mb-2">🎨 方式1：可视化界面</h4>
                  <p className="text-sm mb-3">推荐方式，最简单快捷</p>
                  <a 
                    href="/admin/gsc-setup" 
                    target="_blank"
                    className="inline-block bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    打开配置界面
                  </a>
                </div>

                {/* 方式2：命令行 */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                  <h4 className="font-semibold text-purple-600 mb-2">⚡ 方式2：命令行</h4>
                  <p className="text-sm mb-3">适合开发者</p>
                  <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono mb-2">
                    node scripts/setup-gsc.js {verificationCode}
                  </div>
                  <button
                    onClick={() => copyToClipboard(`node scripts/setup-gsc.js ${verificationCode}`)}
                    className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                  >
                    复制命令
                  </button>
                </div>

                {/* 方式3：手动编辑 */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                  <h4 className="font-semibold text-orange-600 mb-2">✏️ 方式3：手动编辑</h4>
                  <p className="text-sm mb-3">完全控制</p>
                  <div className="text-xs mb-2">
                    编辑 <code>app/layout.tsx</code> 第123行
                  </div>
                  <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono">
                    content="{verificationCode}"
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ 重要提醒
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• 如果使用手动编辑，配置后需要重新部署网站</li>
                  <li>• 可视化界面会自动处理部署</li>
                  <li>• 命令行脚本会自动更新文件</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={goToNextStep}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                验证码已配置 → 下一步
              </button>
            </div>
          </div>
        )}

        {/* 第3步：验证网站 */}
        {currentStep === 3 && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4">
              ✅ 第3步：验证网站 (30秒)
            </h3>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <h4 className="font-semibold mb-2">🔄 返回Google Search Console</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>返回到之前打开的GSC验证页面</li>
                  <li>点击页面底部的 <strong>"验证"</strong> 按钮</li>
                  <li>等待几秒钟，应该会显示 ✅ <strong>"所有权已验证"</strong></li>
                </ol>
              </div>

              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <h4 className="font-semibold mb-2">🔍 验证状态检查</h4>
                <p className="text-sm mb-3">您可以使用以下方式检查验证是否成功：</p>
                
                <div className="space-y-2">
                  <button
                    onClick={() => window.open('/api/gsc-status', '_blank')}
                    className="block w-full text-left bg-blue-100 dark:bg-blue-900/30 p-3 rounded border hover:bg-blue-200 dark:hover:bg-blue-900/50"
                  >
                    <div className="font-medium">📊 检查SEO状态</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      访问 /api/gsc-status 查看详细状态
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      const cmd = 'curl -s https://visionong.dpdns.org | grep "google-site-verification"';
                      copyToClipboard(cmd);
                    }}
                    className="block w-full text-left bg-gray-100 dark:bg-gray-900/30 p-3 rounded border hover:bg-gray-200 dark:hover:bg-gray-900/50"
                  >
                    <div className="font-medium">🔧 命令行检查</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                      curl -s https://visionong.dpdns.org | grep "google-site-verification"
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">点击复制命令</div>
                  </button>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  🚨 验证失败？
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• 等待5-10分钟后重试（DNS传播需要时间）</li>
                  <li>• 确认验证码配置正确且网站已重新部署</li>
                  <li>• 检查网站是否可以正常访问</li>
                  <li>• 清除浏览器缓存后重试</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={goToNextStep}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                网站已验证 → 下一步
              </button>
            </div>
          </div>
        )}

        {/* 第4步：提交Sitemap */}
        {currentStep === 4 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-200 mb-4">
              🗺️ 第4步：提交Sitemap (30秒)
            </h3>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <h4 className="font-semibold mb-2">📍 在GSC中提交Sitemap</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>在Google Search Console左侧菜单中点击 <strong>"站点地图"</strong></li>
                  <li>点击 <strong>"添加新的站点地图"</strong> 按钮</li>
                  <li>输入：<code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">sitemap.xml</code></li>
                  <li>点击 <strong>"提交"</strong></li>
                  <li>重复步骤2-4，这次输入：<code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">news-sitemap.xml</code></li>
                </ol>
              </div>

              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <h4 className="font-semibold mb-2">🔗 要提交的Sitemap列表</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-600 rounded">
                    <span className="font-mono text-sm">sitemap.xml</span>
                    <button
                      onClick={() => copyToClipboard('sitemap.xml')}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      复制
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-600 rounded">
                    <span className="font-mono text-sm">news-sitemap.xml</span>
                    <button
                      onClick={() => copyToClipboard('news-sitemap.xml')}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <h4 className="font-semibold mb-2">🚀 自动提交（可选）</h4>
                <p className="text-sm mb-3">您也可以使用我们的自动提交功能：</p>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/submit-sitemap', { method: 'POST' });
                      const data = await response.json();
                      alert(data.success ? '提交成功！' : '提交失败，请手动提交');
                    } catch (error) {
                      alert('提交失败，请手动提交');
                    }
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                >
                  🤖 自动提交到搜索引擎
                </button>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  🎉 恭喜！配置即将完成
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  完成sitemap提交后，您的网站将开始出现在Google搜索结果中。通常需要几天到几周的时间才能看到完整效果。
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  updateStepStatus(4, 'completed');
                  alert('🎉 配置完成！您的网站现在已经连接到Google Search Console。');
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✅ 配置完成！
              </button>
            </div>
          </div>
        )}

        {/* 完成状态 */}
        {steps.every(step => step.status === 'completed') && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
              配置完成！
            </h3>
            <p className="text-green-700 dark:text-green-300 mb-4">
              您的网站现在已经成功连接到Google Search Console
            </p>
            <div className="space-y-2 text-sm text-green-600 dark:text-green-400">
              <p>✅ 网站验证成功</p>
              <p>✅ Sitemap已提交</p>
              <p>✅ 开始接收搜索数据</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}