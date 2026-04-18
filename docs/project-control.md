# 项目总控文档

## 当前状态

- 运行形态：网页 / PWA / 可双击 `index.html` 进入单文件版
- 默认词库：Cambridge YLE Pre A1 Starters
- 主题数量：16
- 词汇数量：370
- 历史记录：本机 SQLite + 轻量账号本地切换
- 家长端：支持下载模板、粘贴 CSV、导入并切换词库
- 默认轻量账号：`maya`

## 当前已完成能力

- 今日任务根据历史进度生成新词和复习词
- 学过但未掌握的词优先复习
- 已掌握词不再作为新词重复出现
- 进度页展示总星星、连续学习、已掌握词、常错词、最近学习记录
- 词条支持 `example` 与 `exampleZh`
- 导入词库支持 `image`、`audio`、`example`、`exampleZh`
- 图片未提供时使用内置图形/emoji 兜底
- 首页现在先区分 `临时使用` 和 `继续我的记录`
- 系统不再默认直接进入某个账号，而是让用户先选进入方式
- 新词发现页已升级为图片优先、点击翻转、可重复发音的闪卡式交互
- 题面选词已改成同主题匹配，避免“考的词和候选项对不上”
- 到期复习词会进入后续练习步骤，不会只停留在统计里
- 默认词库已补齐稳定视觉兜底，不再出现大批单词没有闪卡映射
- `daily-routines` 已加入默认词包
- 五个高频主题已切到统一儿童化内置插画包：`animals`、`family-and-friends`、`food-and-drink`、`school`、`daily-routines`
- 轻量账号用于区分同一台设备上的不同学习记录，不做跨设备同步
- AI 故事模式已落最小骨架：完成任务后可进入 StoryPage，优先读 SQLite 缓存，未配置代理时走本地 fallback 故事

## 当前约束

- 图片不会自动上网搜索
- 导入词库和学习状态目前都存在本机 SQLite，不依赖 Supabase
- 轻量账号适合同设备单人自用，不适合作为严格权限体系

## 文档入口

- [总索引](./superpowers/README.md)
- [管理文档](./management/README.md)
- [设计规格](./superpowers/specs/2026-04-12-kids-vocabulary-pwa-design.md)
- [实现计划](./superpowers/plans/2026-04-12-kids-vocabulary-pwa.md)
- [词包协议](./superpowers/reference/word-pack-schema.md)
- [导入协议](./superpowers/reference/textbook-import-contract.md)
- [词包导入工作流](./workflows/pack-import.md)
- [发布检查清单](./workflows/release-checklist.md)

## 当前管理阶段

- 当前模式：轻量接管模式
- 当前主线：学习主循环保护 + 发布基线稳固
- 管理入口：先看 `docs/management/README.md`，再决定本轮具体推进项

## 轻量借鉴版整理

当前仓库吸收了“best practice repo”的三点做法，但保持轻量：

- 用总控文档统一收束当前状态、约束和入口
- 用 workflow 文档收纳重复动作，而不是把流程散落在聊天里
- 用极简 `.mcp.json` 保留最常用的浏览器验证能力

当前没有引入：

- 重型 subagents / commands 编排
- 大量 hooks / role 目录
- 针对 AI 工作流而不是业务产品的复杂结构
