# 迭代任务板

这个文档是当前项目的轻量 backlog。规则只有两条：

- `Now` 只保留 1 个主推进目标，最多 2 个并行辅助项。
- 每完成一项，都要补上验证结果和文档回写位置。

## Now

| 优先级 | 主题 | 目标 | 主文件范围 | 完成信号 | 状态 |
| --- | --- | --- | --- | --- | --- |
| P0 | 发布基线稳固 | 保证 `test / lint / build / Pages / standalone` 是一条稳定闭环，而不是分散的检查点 | `.github/workflows/deploy-pages.yml` `docs/workflows/release-checklist.md` `scripts/generate-standalone.mjs` | 本地三连验证稳定；发布前后检查清单和真实发布路径一致 | Ready |
| P0 | 学习主循环保护 | 给今日任务生成、同主题选项匹配、复习词进入练习流、奖励回写补足保护，降低核心路径回归 | `src/engine/` `src/pages/TodayPage.tsx` `src/components/lesson/` `src/components/game/` | 核心学习流的关键行为有自动化保护 | In Progress |

## Next

| 优先级 | 主题 | 目标 | 主文件范围 | 完成信号 | 状态 |
| --- | --- | --- | --- | --- | --- |
| P1 | 词包导入硬化 | 提高 CSV 归一化、主题可见性、图片/音频字段和闪卡兜底的稳定性 | `src/features/import/` `src/data/word-packs/` `src/components/ui/wordVisualMap.ts` `docs/workflows/pack-import.md` | 导入后可生成任务、可切词库、可见主题、句子不丢 | In Progress |
| P1 | 真实素材升级 | 把默认词库从 emoji 兜底逐步升级成更像儿童闪卡的统一图片资产 | `src/data/word-packs/` `src/components/ui/WordVisual.tsx` `public/` | 高频主题拥有更高质量的卡通素材，不只依赖 emoji | Queued |
| P1 | 家长端与云端状态清晰化 | 让轻量账号、历史找回、回填逻辑更可理解且更可验证 | `src/lib/supabase.ts` `src/features/profile/` `src/storage/` `src/pages/ParentPage.tsx` | 同步/失败/未配置云端时的用户感知更清楚 | In Progress |

## Later

| 优先级 | 主题 | 目标 | 主文件范围 | 完成信号 | 状态 |
| --- | --- | --- | --- | --- | --- |
| P2 | 内容运营模板化 | 让新教材词表接入更像运营动作，而不是一次性工程处理 | `docs/workflows/pack-import.md` `src/features/import/` `src/data/word-packs/` | 新词表接入成本下降，回归步骤更清晰 | Watch |
| P2 | 复习算法升级评估 | 在现有 Leitner 稳定后，再评估是否值得迁移到更复杂的调度模型 | `src/engine/scheduler.ts` `docs/superpowers/reference/review-scheduler.md` | 有明确收益假设和验证方案再开工 | Watch |
| P2 | 跨设备恢复策略 | 评估是否从轻量账号升级到邮箱绑定或恢复码方案 | `src/lib/supabase.ts` `src/features/profile/` `docs/project-control.md` | 只有在真实用户场景需要时再升级 | Watch |

## 每项任务必须补的证据

- 改了哪些文件
- 跑了哪些验证命令
- 是否同步更新了 `docs/project-control.md`
- 是否需要更新 `docs/workflows/` 或 `docs/superpowers/` 下的协议文档

## 切换任务的规则

- `Now` 里的事项未完成前，不主动把 `Next` 提升成新的主线。
- 如果发现当前任务需要跨越两个以上主线，先拆任务，再继续做。
- 如果只是临时修复小问题，可以插入，但必须在完成后把主线状态恢复到任务板。
- 默认在验证通过后提交并推送到 GitHub，除非用户明确要求只本地改不推送。
