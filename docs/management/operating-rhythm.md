# 运行节奏

## 日常推进节奏

每次开始新一轮工作，都按这个顺序走：

1. 先看 [`../project-control.md`](../project-control.md) 和 [迭代任务板](./iteration-board.md)
2. 用 oh-my-codex 快速确认相关文件、测试、工作流入口
3. 选择正确的 superpowers 工作流，而不是直接跳进实现
4. 改动完成后做最小充分验证
5. 把结论写回文档，而不是只停留在聊天里
6. 如果用户没有特别说“不要推”，默认在验证通过后提交并推送到 GitHub

## 工作流选择表

| 场景 | 首选方式 | 说明 |
| --- | --- | --- |
| 我只需要快速了解代码关系 | `omx explore` | 用于只读定位文件、符号、依赖关系 |
| 需求还模糊，边界不清 | `brainstorming` / `plan` | 先做边界、方案和验证设计 |
| 任务已清楚，但涉及多个文件和步骤 | `writing-plans` | 先把文件范围、任务粒度、验证方式写清楚 |
| 出现 bug 或行为和预期不符 | `systematic-debugging` | 先复现、定位、再修复 |
| 准备结束这一轮工作 | `verification-before-completion` | 先证明完成，再宣布完成 |
| 改动较大，准备合入 | `requesting-code-review` | 把风险、回归点和缺口先过一遍 |

## 每日闭环

当天结束前至少完成下面 4 件事：

- 当前任务状态已写回 [迭代任务板](./iteration-board.md)
- 新的事实已反映到 [`../project-control.md`](../project-control.md) 或相关协议文档
- 验证结果已读过，不只是在终端里跑过
- 未解决风险已落成文字记录

## 每周节奏

每周至少做一次“收口检查”：

- 清掉已经完成但还挂在 `Now` 或 `Next` 的事项
- 检查 `docs/workflows/release-checklist.md` 是否仍匹配真实发布链路
- 检查 `docs/workflows/pack-import.md` 是否仍匹配真实导入链路
- 判断是否需要把新的长期事实写进 `.omx/project-memory.json`

## 发布节奏

任何准备上线到 GitHub Pages 的改动，都要至少完成：

```bash
npm run test
npm run lint
npm run build
```

然后再对照 [`../workflows/release-checklist.md`](../workflows/release-checklist.md) 做人工检查。

## OMX 目录约定

- `.omx/project-memory.json`：保留稳定事实，例如当前默认词库、发布方式、长期约束
- `.omx/state/`：运行态状态，由工具维护，不手工当流程文档
- `.omx/logs/`：运行日志，用于排查，不当作项目结论

## 什么时候更新哪份文档

- 项目整体现状变了：更新 [`../project-control.md`](../project-control.md)
- 优先级变了：更新 [迭代任务板](./iteration-board.md)
- 做事顺序或准入标准变了：更新本文件
- 产品边界、协议、视觉或调度规则变了：更新 `docs/superpowers/` 下对应文档
- 导入和发布的重复动作变了：更新 `docs/workflows/` 下对应 checklist
