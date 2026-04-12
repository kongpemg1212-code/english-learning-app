# 少儿单词背诵

一个面向低龄儿童的英语单词闯关 PWA。当前默认词库为 Cambridge YLE Pre A1 Starters，核心目标是把“有趣、可视化、每天能坚持、不会轻易忘”做成一个轻量网页应用。

## 当前产品形态

- 孩子端：`今日任务 / 地图 / 花园 / 进度`
- 家长端：CSV 模板下载、词表导入、词库切换
- 默认内容：15 个 Cambridge 主题、361 个词
- 记忆机制：每日新词 + 历史复习 + 错词回流
- 本地入口：可直接双击 `index.html`
- 线上地址：[GitHub Pages](https://kongpemg1212-code.github.io/english-learning-app/)

## 项目入口

- 总控文档：[`docs/project-control.md`](/Users/kong/Downloads/少儿单词背诵/docs/project-control.md)
- 文档索引：[`docs/superpowers/README.md`](/Users/kong/Downloads/少儿单词背诵/docs/superpowers/README.md)
- 设计规格：[`docs/superpowers/specs/2026-04-12-kids-vocabulary-pwa-design.md`](/Users/kong/Downloads/少儿单词背诵/docs/superpowers/specs/2026-04-12-kids-vocabulary-pwa-design.md)
- 实现计划：[`docs/superpowers/plans/2026-04-12-kids-vocabulary-pwa.md`](/Users/kong/Downloads/少儿单词背诵/docs/superpowers/plans/2026-04-12-kids-vocabulary-pwa.md)

## 轻量工作流

这个仓库借鉴了 “best practice repo” 的组织方式，但只保留最有用的轻量部分，不引入重型 agent 编排。

- 固定总控文档：记录当前状态、约束、风险和文档入口
- 固定 workflow 文档：把重复动作沉淀成短流程
- 极简 MCP 配置：只保留最常用的浏览器验证工具

当前保留的 workflow：

- [`docs/workflows/pack-import.md`](/Users/kong/Downloads/少儿单词背诵/docs/workflows/pack-import.md)
- [`docs/workflows/release-checklist.md`](/Users/kong/Downloads/少儿单词背诵/docs/workflows/release-checklist.md)

## 开发命令

```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
```

## 目录说明

- `src/`：应用源码
- `src/data/word-packs/`：默认词库与主题数据
- `docs/`：设计、计划、协议、工作流与总控文档
- `scripts/`：词库导入与本地构建辅助脚本
- `public/`：PWA 静态资源

## 当前借鉴边界

借鉴的是：

- 文档分层
- 轻量工作流
- 最小工具配置

没有引入的是：

- 大量 subagents / commands / hooks
- 重型 AI 编排目录
- 过多环境与执行约定

这个项目仍然是一个以业务交付为主的前端应用仓库，而不是 AI workflow showcase。
