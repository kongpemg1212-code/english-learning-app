# 项目管理文档索引

这组文档用于把“少儿单词背诵”从一个可运行仓库，升级成一个可持续推进的项目。

它们不替代 `docs/superpowers/` 下的设计规格和实现计划，而是补上项目接管、节奏管理、优先级和执行规则。

## 文档清单

- [项目接管章程](./project-takeover.md)
  定义当前接管目标、工作流、风险边界、完成标准，以及 superpowers 和 oh-my-codex 在这个仓库中的使用方式。

- [迭代任务板](./iteration-board.md)
  记录当前 `Now / Next / Later` 优先级、每个工作流的目标、主文件范围和完成信号。

- [运行节奏](./operating-rhythm.md)
  约定日常推进、周节奏、发布节奏，以及何时使用 `omx explore`、superpowers 技能和仓库内现有 workflow 文档。

## 推荐阅读顺序

1. 先看 [`../project-control.md`](../project-control.md)，确认项目现状和已有能力。
2. 再看 [项目接管章程](./project-takeover.md)，确认当前阶段到底在“接管什么”。
3. 进入执行前，看 [迭代任务板](./iteration-board.md)，决定本轮只推进哪一件事。
4. 开工与收尾时，对照 [运行节奏](./operating-rhythm.md)，确保流程闭环。
5. 需要产品设计、实现计划或协议细节时，再跳转到 [`../superpowers/README.md`](../superpowers/README.md)。

## 管理原则

- 轻量优先：继续保持“小仓库、强约束、少模板”，不把项目改造成 AI workflow showcase。
- 事实优先：项目状态以代码、测试、构建和已落盘文档为准，不以聊天结论为准。
- 单轮单目标：每次迭代只主推一个明确目标，避免同时拉扯学习引擎、导入链路和云端能力。
- 文档即入口：新一轮工作先更新任务板，再改代码；完成后补验证结论和风险。

## 与 OMX 的关系

- `.omx/project-memory.json` 用来沉淀跨会话事实，不替代用户可读文档。
- `.omx/state/` 和 `.omx/logs/` 是运行态数据，不手工当作项目文档维护。
- 用户可读、可审阅、可交接的信息，统一落在 `docs/` 目录。
