# 项目接管章程

## 1. 接管目标

本次接管不是重写产品，而是把当前仓库收束成一个可持续推进的项目：

- 有明确入口：知道从哪里读现状、读计划、看优先级。
- 有固定节奏：知道每天怎么推进、每周怎么收敛、发布前怎么验收。
- 有执行约束：知道什么时候直接改，什么时候先设计，什么时候必须先验证。
- 有共享语言：后续不论是人、Codex 还是 oh-my-codex 工作流，都按同一套文档边界推进。

## 2. 当前基线

- 产品形态：低龄儿童英语单词闯关 PWA，包含今日任务、地图、花园、进度、家长入口。
- 技术栈：React 19、TypeScript、Vite、Vitest、Zustand、Framer Motion、Supabase。
- 发布形态：GitHub Pages 在线版本 + `dist/standalone.html` 本地离线版本。
- 内容基线：Cambridge YLE Pre A1 Starters，15 个主题，361 个词。
- 当前环境：`omx doctor` 已通过，本地 oh-my-codex 可直接用于探索、状态管理和后续执行工作流。

## 3. 接管边界

本项目继续保持“业务交付优先”的轻量模式，不引入重型治理负担。

- 不为了 AI 工作流而新增复杂目录或无实际价值的模板。
- 不在未确认收益前引入新依赖。
- 不把一个迭代拆成同时推进多个高耦合主题。
- 不把 `.omx/` 里的运行态文件当成正式交付物。

## 4. 当前阶段的四条主线

### A. 学习主循环稳定性

目标是守住孩子端最核心的每日体验，避免“能打开但今天学不了”。

- 重点关注：`src/engine/`、`src/pages/TodayPage.tsx`、`src/components/lesson/`、`src/components/game/`
- 成功信号：今日任务生成稳定、学习流不断裂、奖励与进度回写一致

### B. 内容导入与词包运营

目标是让默认词库和家长导入词库都能稳定进入同一条消费链路。

- 重点关注：`src/features/import/`、`src/data/word-packs/`、`src/components/ui/wordVisualMap.ts`
- 成功信号：导入后主题可见、任务可生成、句子和图形兜底可用

### C. 持久化与云端存档

目标是降低本地记录、轻量账号云端找回、词库切换之间的认知和回归风险。

- 重点关注：`src/storage/`、`src/lib/supabase.ts`、`src/features/profile/`、`src/pages/ParentPage.tsx`
- 成功信号：云端状态可理解、失败有提示、已有学习数据不会悄悄丢失

### D. 交付与发布可预测性

目标是让“测试通过、能构建、可上线、可本地打开”成为一个固定闭环。

- 重点关注：`.github/workflows/deploy-pages.yml`、`docs/workflows/release-checklist.md`、`scripts/generate-standalone.mjs`
- 成功信号：本地验证和 Pages 发布路径一致，发布前后检查有据可依

## 5. 默认执行模型

### 先用 oh-my-codex 做事实收束

- 读仓库、找文件、看关系时，优先使用 `omx explore` 或等价的快速只读方式。
- 跨会话稳定事实记到 `.omx/project-memory.json`，但用户可读结论必须同步到 `docs/`。

### 再用 superpowers 选择工作流

- 需求模糊、涉及方案取舍：先走 `brainstorming` 或 `plan`
- 多步实现、需要明确文件级任务：走 `writing-plans`
- 发现 bug、行为不符预期：走 `systematic-debugging`
- 自认完成前：走 `verification-before-completion`
- 改动较大、准备合入前：走 `requesting-code-review`

### 最后回到仓库文档收口

- 当前状态写回 [`../project-control.md`](../project-control.md)
- 当前优先级写回 [迭代任务板](./iteration-board.md)
- 流程变化写回 [运行节奏](./operating-rhythm.md) 或现有 `docs/workflows/*.md`

## 6. 进入执行前的准入标准

满足以下条件才进入代码改动：

- 本轮只定义了一个主目标
- 已明确影响文件范围
- 已知道如何验证成功
- 若改动涉及流程或协议，已找到需要同步更新的文档

## 7. 完成定义

一轮工作只有同时满足以下条件，才算真正完成：

- 代码或文档改动已经落盘
- `README.md` / `docs/project-control.md` / 对应管理文档入口没有失联
- 必要验证已执行并读过结果
- 已知风险被记录，而不是留在聊天里

## 8. 当前主要风险

- 学习引擎、页面状态和持久化之间存在跨文件耦合，容易出现“局部改好，整链路退化”。
- 本地优先与轻量账号云端并存，最容易在切换、首次同步和异常提示处出现体验断层。
- 在线 Pages 版本与本地 `standalone.html` 同时存在，发布链路需要持续对齐。
- 词包 schema、导入清洗和视觉兜底是同一条内容链路，任何一环变更都可能影响今日任务和地图主题。
