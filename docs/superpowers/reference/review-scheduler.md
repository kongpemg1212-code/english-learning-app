# 复习调度规则

> 目标：为首版提供稳定、可解释、适合 7 岁儿童的复习机制，并为后续升级到 FSRS 预留接口。

## 1. 首版原则

首版不追求最复杂的算法，而追求：

- 孩子每天负担可控
- 错词不会消失
- 新词与旧词平衡
- 调度逻辑清晰可验证

因此首版采用：

- Leitner 分层复习
- 错题当天回流
- 次日优先复习
- 每日任务总量限制

## 2. 掌握状态结构

```ts
type WordProgress = {
  wordId: string
  stage: 0 | 1 | 2 | 3 | 4 | 5
  seenCount: number
  correctCount: number
  wrongCount: number
  consecutiveCorrect: number
  lastReviewedAt?: string
  nextReviewAt?: string
  status: "new" | "learning" | "review" | "mastered"
}
```

### 状态说明

- `new`
  还没进入正式学习

- `learning`
  最近刚学过，仍需要高频复现

- `review`
  进入正常间隔复习

- `mastered`
  已较稳定，但仍会参加低频复习

## 3. Leitner 阶段建议

| Stage | 说明 | 下一次复习 |
| --- | --- | --- |
| 0 | 未学习 | 当天进入新词流程 |
| 1 | 刚学会 | 1 天后 |
| 2 | 初步记住 | 2 天后 |
| 3 | 稍稳定 | 4 天后 |
| 4 | 比较稳定 | 7 天后 |
| 5 | 稳定 | 14 天后 |

## 4. 回答后的规则

### 答对

- `seenCount + 1`
- `correctCount + 1`
- `consecutiveCorrect + 1`
- `stage` 至少升一级，最高到 5
- 更新 `lastReviewedAt`
- 计算新的 `nextReviewAt`

### 答错

- `seenCount + 1`
- `wrongCount + 1`
- `consecutiveCorrect = 0`
- `status` 回到 `learning`
- `stage` 回落到 1 或保底不高于当前阶段减 2
- 当天加入回流池
- `nextReviewAt` 设置为当天或次日优先

## 5. 当天回流机制

当天答错的词不能立刻原题重来，而应：

1. 先完成当前题
2. 在本轮后半段换题型再次出现
3. 如果再次出错，第二天继续高优先级出现

设计原因：

- 避免孩子只是记住按钮位置
- 让“错词复现”更像重新挑战，而不是机械惩罚

## 6. 每日任务生成规则

```ts
type DailySession = {
  date: string
  newWords: string[]
  reviewWords: string[]
  challengeWords: string[]
  estimatedMinutes: number
  status: "todo" | "done"
}
```

### 生成顺序

1. 先取所有 `nextReviewAt <= today` 的到期词
2. 如果到期词太多，按优先级排序后截断
3. 再补新词
4. 再从“新词 + 复习词 + 错词”里抽 Boss 关词项

### 建议默认数量

- 新词：3
- 到期复习：6 到 8
- Boss 关混合词：4 到 6

### 压力保护规则

如果到期词过多：

- 优先保证到期词
- 自动减少新词
- 不让单次学习超过 10 分钟

## 7. 题型轮换规则

同一个词在同一天应尽量跨题型出现：

- 新词初见：预览卡
- 第一轮：看图选词或听音点图
- 第二轮：拖拽配对或拼写补全
- Boss 关：混合随机

## 8. 掌握判定

建议进入“已掌握”前至少满足：

- `stage >= 5`
- `consecutiveCorrect >= 3`
- 最近一次不是靠同题型硬记

即使已掌握，也不能永久消失：

- 进入每周回顾池
- 在花园和地图上承担“回想触点”

## 9. 数据接口建议

引擎层建议提供以下接口：

```ts
type Scheduler = {
  getDueWords(date: string): string[]
  recordAnswer(wordId: string, result: "correct" | "wrong", mode: string): WordProgress
  buildDailySession(date: string): DailySession
  isMastered(wordId: string): boolean
}
```

## 10. 后续升级到 FSRS 的边界

后续升级时，尽量保持业务接口不变，只替换调度实现。

需要保留的数据：

- 每次复习日志
- 题型
- 对错结果
- 时间戳
- 用时

建议额外记录：

```ts
type ReviewLog = {
  wordId: string
  reviewedAt: string
  mode: string
  result: "correct" | "wrong"
  durationMs?: number
}
```

这样后期才能基于真实日志训练或迁移到 FSRS。

## 11. 不做的事情

首版调度层不负责：

- 页面表现
- 徽章发放
- 花园成长动画
- 家长端图表

这些由上层根据调度结果决定。
