# 少儿单词背诵

一个面向低龄儿童的英语单词闯关 PWA。当前默认词库为 Cambridge YLE Pre A1 Starters，目标是把“图片化、可重复听、每天几分钟、不会轻易忘”做成一个单人自用也足够顺手的网页应用。

## 你现在可以怎么用

### 孩子端

- 打开网站后先选 `临时使用` 或 `继续我的记录`
- 新词先走翻转闪卡：先看图，再翻面看英文、中文、例句，并可点击听单词/听例句
- 后面进入小游戏：看图选词、听音点图、配对、拼写、Boss 复习

### 家长端

- 在 `进度 -> 家长页` 看当前词库、星星、连续学习
- 可以输入一个简单名字作为学习账号，例如 `maya`
- 同一台设备上切换这个名字时，会切换到对应的本地学习记录
- 可以下载 CSV 模板、导入自己的词表、切换词库

## 当前产品形态

- 孩子端：`今日任务 / 地图 / 花园 / 进度`
- 家长端：轻量账号找回、CSV 模板下载、词表导入、词库切换
- 默认内容：16 个 Cambridge 主题、370 个词
- 记忆机制：每日新词 + 历史复习 + 错词回流
- 本地入口：可直接双击 `index.html`
- 线上地址：[GitHub Pages](https://kongpemg1212-code.github.io/english-learning-app/)

## 本轮重点升级

- 默认词包新增 `daily-routines`
- `animals / family-and-friends / food-and-drink / school / daily-routines` 五个高频主题改成统一儿童化内置插画包
- 首页不再默认直接进入某个账号，而是先选 `临时使用` 或 `继续我的记录`
- 题面和候选项现在按当前主题/当前练习词对齐，不再乱配
- 完成当天任务后可以进入 `听今天的小故事`，故事会先读本机 SQLite 缓存，没有缓存时使用可插拔 storyProvider，当前线上默认走本地 fallback 故事

## AI 故事模式

- 当前已实现最小可上线版：StoryPage、SQLite 缓存、本地 fallback 故事、storyProvider 接口
- `.env.local` 不放 AI API Key，只能放代理地址，例如 `VITE_AI_STORY_PROXY_URL`
- 真正的 AI API Key 应该放在你自己的后端代理里，不进入 GitHub，也不进入浏览器包
- 当前线上代理地址：`https://kids-word-story-api.kongpemg1212.workers.dev/`
- 如果代理不可用，网站也能正常给孩子生成一个本地模板小故事

## 项目架构

### 1. 页面层

- `src/App.tsx`
  应用入口，负责路由切换、当前词库展示、轻量账号同步入口。
- `src/pages/TodayPage.tsx`
  今日任务页，负责生成当天 session 并启动学习流。
- `src/pages/MapPage.tsx`
  地图选主题。
- `src/pages/GardenPage.tsx`
  成长奖励展示。
- `src/pages/ProgressPage.tsx`
  孩子/家长查看学习结果。
- `src/pages/ParentPage.tsx`
  轻量账号找回、词表导入、词库切换。

### 2. 学习流层

- `src/components/lesson/LessonFlow.tsx`
  把“发现新词 -> 小游戏 -> Boss”串成一条线。
- `src/components/lesson/NewWordCard.tsx`
  新词翻转闪卡。现在支持图片优先、翻面、听单词、听例句。
- `src/components/game/*`
  各种题型组件：看图、听音、配对、拼写、Boss。

### 3. 内容与媒体层

- `src/types/word.ts`
  单词 contract。核心字段：`word / meaningZh / visualKey / image / audio / example / exampleZh`
- `src/data/word-packs/`
  默认词包与主题 JSON
- `src/components/ui/WordVisual.tsx`
  单词视觉渲染。优先图片，没有就走内置视觉兜底。
- `src/components/ui/wordVisualMap.ts`
  内置视觉 token 映射。

### 4. 学习引擎层

- `src/engine/scheduler.ts`
  间隔复习与答题结果推进。
- `src/engine/sessionBuilder.ts`
  每日任务生成。
- `src/engine/scoring.ts`
  星星与任务奖励计算。

### 5. 存储层

- `src/store/useAppStore.ts`
  UI 级状态：星星、花园、当前主题、当前词库、声音开关、轻量账号等。
- `src/storage/repositories/*.ts`
  读写单词进度、每日任务。
- `src/storage/sqlite/client.ts`
  浏览器内 SQLite 客户端。把 profile 状态、单词进度、每日任务都存在本机 SQLite 数据库里。
- `src/features/profile/*`
  轻量账号名处理与本地 profile 切换逻辑。

## 轻量账号说明

- 这是单人自用的“找回历史”方案，不是正式账号系统
- 推荐用好记的名字，例如 `maya`
- 同一台设备上，知道这个名字的人也可以切换到这份记录
- 这是本机方案，不支持不同设备之间自动同步
- 如果你后面真的需要跨设备或更强安全性，再升级成正式账号体系

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

## 项目入口

- 总控文档：[`docs/project-control.md`](/Users/kong/Downloads/少儿单词背诵/docs/project-control.md)
- 管理文档：[`docs/management/README.md`](/Users/kong/Downloads/少儿单词背诵/docs/management/README.md)
- 文档索引：[`docs/superpowers/README.md`](/Users/kong/Downloads/少儿单词背诵/docs/superpowers/README.md)
- 设计规格：[`docs/superpowers/specs/2026-04-12-kids-vocabulary-pwa-design.md`](/Users/kong/Downloads/少儿单词背诵/docs/superpowers/specs/2026-04-12-kids-vocabulary-pwa-design.md)
- 实现计划：[`docs/superpowers/plans/2026-04-12-kids-vocabulary-pwa.md`](/Users/kong/Downloads/少儿单词背诵/docs/superpowers/plans/2026-04-12-kids-vocabulary-pwa.md)

## 当前工作流

- [`docs/workflows/pack-import.md`](/Users/kong/Downloads/少儿单词背诵/docs/workflows/pack-import.md)
- [`docs/workflows/release-checklist.md`](/Users/kong/Downloads/少儿单词背诵/docs/workflows/release-checklist.md)

这个仓库仍然是一个以业务交付为主的前端应用仓库，不会为了 AI 工作流而引入重型目录和复杂约定。当前还主动关闭了旧的 service worker 缓存链路，避免 GitHub Pages 发布后手机端长期拿到旧页面。
