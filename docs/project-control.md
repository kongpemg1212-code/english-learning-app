# 项目总控文档

## 当前状态

- 运行形态：网页 / PWA / 可双击 `index.html` 进入单文件版
- 默认词库：Cambridge YLE Pre A1 Starters
- 主题数量：15
- 词汇数量：361
- 历史记录：本地持久化 + 匿名云端存档
- 家长端：支持下载模板、粘贴 CSV、导入并切换词库

## 当前已完成能力

- 今日任务根据历史进度生成新词和复习词
- 学过但未掌握的词优先复习
- 已掌握词不再作为新词重复出现
- 进度页展示总星星、连续学习、已掌握词、常错词、最近学习记录
- 词条支持 `example` 与 `exampleZh`
- 导入词库支持 `image`、`audio`、`example`、`exampleZh`
- 图片未提供时使用内置图形/emoji 兜底
- 首次连上云端后，会把本地已有学习记录自动回填到云端

## 当前约束

- 图片不会自动上网搜索
- 导入词库本身目前仍以本地为主，云端核心同步对象是学习进度与每日任务
- 如果 Supabase 没有打开 Anonymous Sign-In，网页会提示去后台打开
- 匿名云端存档更适合同一设备长期使用；如果未来需要跨设备恢复，建议再升级成邮箱绑定或恢复码方案

## 文档入口

- [总索引](./superpowers/README.md)
- [设计规格](./superpowers/specs/2026-04-12-kids-vocabulary-pwa-design.md)
- [实现计划](./superpowers/plans/2026-04-12-kids-vocabulary-pwa.md)
- [词包协议](./superpowers/reference/word-pack-schema.md)
- [导入协议](./superpowers/reference/textbook-import-contract.md)
