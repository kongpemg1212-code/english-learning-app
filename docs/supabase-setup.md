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

当前版本的登录后同步，使用的是 `auth.users.user_metadata.learning_app`。

这意味着：

- 现在不需要你先手动建业务表
- 登录成功后，学习进度和每日任务会直接写到该用户的 metadata
- 这样最快能把“单独账号记住学到哪里”跑起来

后续如果数据量再增长，可以再迁移到独立表结构。

## Auth 设置

- 打开 Email 登录
- 使用 Magic Link / OTP
- Redirect URL 加入：
  - `https://kongpemg1212-code.github.io/english-learning-app/`

## 当前状态

代码已经接入登录 UI、免密码登录和 metadata 同步逻辑；只要 GitHub Secrets 已配置完成，就可以直接开始使用。
