# AI 故事模式设计

> 日期：2026-04-18
> 状态：最小可上线版设计
> 适用范围：完成当天任务后的故事奖励与轻量 AI 陪练

## 目标

孩子完成当天任务后，可以解锁一个 3 到 6 句的小故事。故事优先复用当天新词和已学词，允许少量新词，但新词必须带中文解释。

## 非目标

- 不做开放式自由聊天
- 不把 AI API Key 放进前端或 GitHub
- 不做 AI 配图生成
- 不做长期无限聊天记录

## 体验流

1. 孩子完成今日任务。
2. 花园页出现 `听今天的小故事`。
3. 点击进入 StoryPage。
4. StoryPage 先查本机 SQLite 缓存。
5. 有缓存直接显示；无缓存则走 storyProvider。
6. storyProvider 如果没有代理可用，则生成本地 fallback 故事。
7. 每句故事支持朗读，新词可查看中文解释。

## 技术策略

- 前端只保留 `storyProvider` 接口。
- 线上版本不暴露 AI Key。
- 本地 `.env.local` 只允许配置代理地址，例如 `VITE_AI_STORY_PROXY_URL`。
- 真正的 AI API Key 应放在 Cloudflare Worker / Vercel / Netlify Function 等代理服务里。

## 数据结构

```ts
type StoryPayload = {
  title: string
  topicId: string
  sentences: StorySentence[]
  questions: StoryQuestion[]
  generatedAt: string
}
```

SQLite 新增：

- `ai_story_cache(profile_id, story_date, topic_id, payload)`
- `ai_chat_history(profile_id, story_date, topic_id, message_id, role, content, created_at)`

## 最小可上线版

- 完成页/花园页入口
- StoryPage
- SQLite 缓存
- fallback 故事
- 可插拔 storyProvider
- 每句朗读
- 新词解释
