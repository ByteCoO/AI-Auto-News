# 上传数据到 Supabase 使用指南

## 1. 安装依赖

```bash
pip install supabase python-dotenv
```

## 2. 配置 Supabase 连接

1. 复制 `.env.example` 为 `.env`：
   ```bash
   copy .env.example .env
   ```

2. 编辑 `.env` 文件，填入你的 Supabase 凭据：
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-service-role-key-or-anon-key
   ```

### 获取 Supabase 凭据：

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 复制：
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** 或 **service_role key** → `SUPABASE_KEY`

> ⚠️ **重要**: 建议使用 `service_role key`（拥有完整权限），但不要在前端代码中使用！

## 3. 运行上传脚本

```bash
python upload_to_supabase.py
```

## 脚本功能

- ✓ 读取 `out/data.txt` 中的 JSON 数据
- ✓ 逐条插入到 `reddit_opportunities` 表
- ✓ 自动处理重复数据（基于 `reddit_comment_id` 唯一约束）
- ✓ 显示上传进度和结果统计

## 常见问题

### Q: 提示字段不存在？
确保你的 Supabase 表结构与 `数据库.txt` 中的 SQL 定义一致。

### Q: 如何只测试部分数据？
在 `upload_to_supabase.py` 的 `main()` 函数中添加：
```python
data = data[:3]  # 只上传前3条
```

### Q: 上传失败后重新上传？
脚本会自动跳过已存在的记录（基于唯一约束），可以安全重复运行。
