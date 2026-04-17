# Supabase 配置说明

## 需要的环境变量

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PUBLIC_APP_URL`

其中 `VITE_PUBLIC_APP_URL` 当前建议固定为：

`https://kongpemg1212-code.github.io/english-learning-app/`

## GitHub Pages Secrets

请在仓库 `english-learning-app` 的 GitHub Secrets 里配置：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 当前同步方式

当前版本使用的是“轻量账号云端找回”：

- 首页不再显示登录页
- 前端会默认生成一个简单账号名，例如 `maya`
- 家长端输入同一个账号后，会尝试找回这份学习历史
- 云端数据会写到 `learning_profiles` 表，而不是 `auth.users.user_metadata`

## 需要的表

请在 Supabase SQL Editor 里执行下面这段最小建表 SQL：

```sql
create table if not exists public.learning_profiles (
  profile_id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
```

仓库里也已经放好了对应 SQL 文件：

- [`supabase/sql/learning_profiles.sql`](/Users/kong/Downloads/少儿单词背诵/supabase/sql/learning_profiles.sql)

如果你希望每次更新自动刷新时间，也可以再加一个简单触发器；当前前端即使没有这个触发器也能工作。

## 这套方案的特点

- 不需要复杂登录
- 不需要邮件确认
- 支持单人自用场景下的跨设备找回
- 安全性依赖“账号字符串不要泄露”，不等同于正式账号体系

后续如果数据量、用户量或权限要求提高，再迁移到正式账号系统也不迟。

## 当前状态

代码已经接入轻量账号同步、本地进度首次回填云端，以及家长端“输入账号找回历史”的入口。只要 GitHub Secrets 已配置完成，并且 Supabase 已建好 `learning_profiles` 表，就可以开始使用。
