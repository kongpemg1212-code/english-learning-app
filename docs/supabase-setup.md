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

## Supabase 表结构

建议执行以下 SQL：

```sql
create table if not exists public.word_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null,
  stage int not null default 0,
  seen_count int not null default 0,
  correct_count int not null default 0,
  wrong_count int not null default 0,
  consecutive_correct int not null default 0,
  last_reviewed_at text,
  next_review_at text,
  status text not null default 'new',
  primary key (user_id, word_id)
);

create table if not exists public.daily_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  date text not null,
  pack_id text,
  topic_id text,
  new_words jsonb not null default '[]'::jsonb,
  review_words jsonb not null default '[]'::jsonb,
  challenge_words jsonb not null default '[]'::jsonb,
  mode_sequence jsonb not null default '[]'::jsonb,
  estimated_minutes int not null default 0,
  status text not null default 'todo',
  primary key (user_id, date)
);

alter table public.word_progress enable row level security;
alter table public.daily_sessions enable row level security;

create policy "users can manage their own word progress"
on public.word_progress
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can manage their own daily sessions"
on public.daily_sessions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## Auth 设置

- 打开 Email 登录
- 使用 Magic Link / OTP
- Redirect URL 加入：
  - `https://kongpemg1212-code.github.io/english-learning-app/`

## 当前状态

代码已经接入登录 UI 和云端仓储逻辑；真正启用还需要你把 Supabase 项目参数配置进 GitHub Secrets。
