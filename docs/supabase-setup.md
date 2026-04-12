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

当前版本使用的是“匿名云端存档”：

- 首次进入时，前端会调用 Supabase Anonymous Sign-In
- 不需要密码
- 不需要邮件确认
- 成功后，学习进度和每日任务会同步到 `auth.users.user_metadata.learning_app`

这意味着：

- 现在不需要你先手动建业务表
- 建立云端档案后，学习进度和每日任务会直接写到该用户的 metadata
- 这样最快能把“云端记住学到哪里”跑起来

后续如果数据量再增长，可以再迁移到独立表结构。

## Auth 设置

- 打开 Anonymous Sign-In
- 如果要保留邮件登录，可以同时开着，但当前网页版本已经不依赖 Magic Link

## 当前状态

代码已经接入“一键进入并保存进度”的匿名云端存档 UI、metadata 同步逻辑，以及本地进度首次回填云端；只要 GitHub Secrets 已配置完成，并且 Supabase 已打开 Anonymous Sign-In，就可以直接开始使用。
