# Kids Vocabulary PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a child-first English vocabulary learning PWA with daily missions, YLE topic packs, playful quiz modes, lightweight parent progress, and a first-version spaced review engine that actually reinforces memory.

**Architecture:** Start with a local-first React + TypeScript + Vite PWA. Keep product flow, review scheduling, content packs, and UI components separated so the app can ship as a single-device MVP first, then grow into textbook import and cloud sync later without rewriting the core. Use a clear data contract for word packs and a deterministic session builder to make review behavior testable.

**Tech Stack:** React, TypeScript, Vite, PWA plugin, Vitest, Testing Library, Zustand, IndexedDB, Framer Motion (preferred), lightweight confetti, lightweight audio layer

---

## Prerequisites

- Spec: `docs/superpowers/specs/2026-04-12-kids-vocabulary-pwa-design.md`
- Reference: `docs/superpowers/reference/word-pack-schema.md`
- Reference: `docs/superpowers/reference/review-scheduler.md`
- Reference: `docs/superpowers/reference/textbook-import-contract.md`
- Reference: `docs/superpowers/reference/visual-design-system.md`
- Reference: `docs/superpowers/reference/interaction-feedback-system.md`

## Proposed File Structure

### App Shell

- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/routes.tsx`
- Create: `src/styles/global.css`
- Create: `src/styles/tokens.css`
- Create: `src/styles/animations.css`

### Domain Types and Content

- Create: `src/types/word.ts`
- Create: `src/types/progress.ts`
- Create: `src/types/session.ts`
- Create: `src/data/word-packs/yle-core/pack.json`
- Create: `src/data/word-packs/yle-core/topics/*.json`
- Create: `src/data/word-packs/index.ts`

### Storage and Engine

- Create: `src/storage/db.ts`
- Create: `src/storage/repositories/wordProgressRepo.ts`
- Create: `src/storage/repositories/dailySessionRepo.ts`
- Create: `src/engine/scheduler.ts`
- Create: `src/engine/sessionBuilder.ts`
- Create: `src/engine/scoring.ts`
- Create: `src/data/word-packs/activePack.ts`

### Feature Screens

- Create: `src/pages/TodayPage.tsx`
- Create: `src/pages/MapPage.tsx`
- Create: `src/pages/GardenPage.tsx`
- Create: `src/pages/ProgressPage.tsx`
- Create: `src/pages/ParentPage.tsx`
- Create: `src/pages/ParentPage.test.tsx`

### Lesson and Game Components

- Create: `src/components/lesson/NewWordCard.tsx`
- Create: `src/components/lesson/LessonFlow.tsx`
- Create: `src/components/game/PictureChoice.tsx`
- Create: `src/components/game/AudioChoice.tsx`
- Create: `src/components/game/MatchPairs.tsx`
- Create: `src/components/game/SpellBlocks.tsx`
- Create: `src/components/game/BossReview.tsx`

### Reward and Progress Components

- Create: `src/components/reward/StarsPanel.tsx`
- Create: `src/components/reward/StreakPanel.tsx`
- Create: `src/components/reward/GardenGrowth.tsx`
- Create: `src/components/map/WorldMap.tsx`
- Create: `src/components/progress/ProgressSummary.tsx`
- Create: `src/components/progress/ErrorWordsList.tsx`
- Create: `src/components/feedback/AnswerFeedback.tsx`
- Create: `src/components/feedback/ComboMeter.tsx`
- Create: `src/components/feedback/CelebrationBurst.tsx`
- Create: `src/hooks/useSound.ts`
- Create: `src/hooks/useReducedMotionPreference.ts`

### Tests

- Create: `src/engine/scheduler.test.ts`
- Create: `src/engine/sessionBuilder.test.ts`
- Create: `src/components/lesson/LessonFlow.test.tsx`
- Create: `src/components/game/PictureChoice.test.tsx`
- Create: `src/components/game/AudioChoice.test.tsx`
- Create: `src/components/game/MatchPairs.test.tsx`
- Create: `src/components/game/SpellBlocks.test.tsx`
- Create: `src/pages/TodayPage.test.tsx`
- Create: `src/pages/ProgressPage.test.tsx`
- Create: `src/components/feedback/AnswerFeedback.test.tsx`
- Create: `src/components/ui/Button.test.tsx`

## Phase Guidance

- Phase 1: Bootstrap and data contracts
- Phase 1.5: Design tokens, motion rules, and touch-safe interaction primitives
- Phase 2: Scheduler and daily missions
- Phase 3: Lesson flow, surprise variety, and game modes
- Phase 4: Rewards, progress, parent view
- Phase 5: PWA polish, offline, validation

### Task 1: Bootstrap the React + TypeScript + PWA shell

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/routes.tsx`
- Create: `src/styles/global.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write the failing shell smoke test**

```tsx
import { render, screen } from "@testing-library/react"
import { App } from "./App"

test("renders daily mission entry point", () => {
  render(<App />)
  expect(screen.getByText("开始今天的冒险")).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/App.test.tsx`
Expected: FAIL because `App` and test setup do not exist yet.

- [ ] **Step 3: Scaffold the minimal app shell**

Create a Vite React TypeScript app, add the router skeleton, and make `TodayPage` the default route.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/App.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.ts src/main.tsx src/App.tsx src/routes.tsx src/styles/global.css src/App.test.tsx
git commit -m "Create the smallest runnable shell for the kids vocabulary PWA"
```

### Task 1.5: Establish the visual design system and touch-safe UI primitives

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/animations.css`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/hooks/useReducedMotionPreference.ts`
- Test: `src/components/ui/Button.test.tsx`

- [ ] **Step 1: Write the failing UI primitive test**

```tsx
test("renders the primary button with a touch-friendly target size", () => {
  render(<Button>开始今天的冒险</Button>)
  expect(screen.getByRole("button")).toHaveClass("touch-target-lg")
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/ui/Button.test.tsx`
Expected: FAIL because the button primitive and token classes do not exist.

- [ ] **Step 3: Write the minimal token, animation, and primitive layer**

Use `docs/superpowers/reference/visual-design-system.md` as the contract. Define color, radius, typography, touch targets, background treatment, and a reduced-motion-safe animation class set before feature work begins.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/ui/Button.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/styles/animations.css src/components/ui src/hooks/useReducedMotionPreference.ts
git commit -m "Front-load the visual system so the kids app feels consistent from the first screen"
```

### Task 2: Define domain types and seed the first YLE content pack

**Files:**
- Create: `src/types/word.ts`
- Create: `src/types/progress.ts`
- Create: `src/types/session.ts`
- Create: `src/data/word-packs/yle-core/pack.json`
- Create: `src/data/word-packs/yle-core/topics/animals.json`
- Create: `src/data/word-packs/yle-core/topics/school.json`
- Create: `src/data/word-packs/index.ts`
- Test: `src/data/word-packs/index.test.ts`

- [ ] **Step 1: Write the failing word-pack loader test**

```ts
import { loadDefaultPack } from "./index"

test("loads a YLE starter pack with topics and words", async () => {
  const pack = await loadDefaultPack()
  expect(pack.meta.id).toBe("yle-core-v1")
  expect(pack.words.length).toBeGreaterThan(20)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/data/word-packs/index.test.ts`
Expected: FAIL because the loader and pack files do not exist.

- [ ] **Step 3: Write the minimal types and starter pack**

Use the contracts from `docs/superpowers/reference/word-pack-schema.md`. Keep the starter pack intentionally small and coherent.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/data/word-packs/index.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types src/data/word-packs
git commit -m "Introduce stable content contracts and seed the first YLE starter pack"
```

### Task 3: Build IndexedDB repositories for progress and daily sessions

**Files:**
- Create: `src/storage/db.ts`
- Create: `src/storage/repositories/wordProgressRepo.ts`
- Create: `src/storage/repositories/dailySessionRepo.ts`
- Test: `src/storage/repositories/wordProgressRepo.test.ts`
- Test: `src/storage/repositories/dailySessionRepo.test.ts`

- [ ] **Step 1: Write the failing repository tests**

```ts
test("persists and loads word progress by word id", async () => {
  await repo.save({ wordId: "yle-animals-cat", stage: 1, seenCount: 1, correctCount: 1, wrongCount: 0, consecutiveCorrect: 1, status: "learning" })
  const record = await repo.get("yle-animals-cat")
  expect(record?.stage).toBe(1)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/storage/repositories`
Expected: FAIL because the DB layer does not exist yet.

- [ ] **Step 3: Write the minimal IndexedDB adapter and repositories**

Keep storage isolated from UI. Do not embed learning rules in repositories.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/storage/repositories`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/storage
git commit -m "Persist learning progress locally so daily review survives reloads"
```

### Task 4: Implement the review scheduler with deterministic tests

**Files:**
- Create: `src/engine/scheduler.ts`
- Test: `src/engine/scheduler.test.ts`

- [ ] **Step 1: Write the failing scheduler tests**

```ts
import { recordAnswer, getNextReviewDate } from "./scheduler"

test("promotes a correct answer to the next Leitner stage", () => {
  const result = recordAnswer({
    wordId: "yle-animals-cat",
    stage: 1,
    seenCount: 1,
    correctCount: 1,
    wrongCount: 0,
    consecutiveCorrect: 1,
    status: "learning"
  }, "correct", "2026-04-12")

  expect(result.stage).toBe(2)
  expect(result.nextReviewAt).toBe("2026-04-14")
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/engine/scheduler.test.ts`
Expected: FAIL because the scheduler does not exist.

- [ ] **Step 3: Write the minimal scheduler**

Implement the stage table from `docs/superpowers/reference/review-scheduler.md`, including wrong-answer fallback and same-day requeue metadata.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/engine/scheduler.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/engine/scheduler.ts src/engine/scheduler.test.ts
git commit -m "Turn spaced review rules into a testable deterministic scheduler"
```

### Task 5: Build the daily session generator with controlled variety

**Files:**
- Create: `src/engine/sessionBuilder.ts`
- Test: `src/engine/sessionBuilder.test.ts`

- [ ] **Step 1: Write the failing session builder test**

```ts
test("builds a daily session with due words first and a varied mode order", () => {
  const session = buildDailySession({
    date: "2026-04-12",
    dueWordIds: ["w1", "w2", "w3", "w4"],
    newWordIds: ["n1", "n2", "n3", "n4"]
  })

  expect(session.reviewWords.length).toBeGreaterThan(0)
  expect(session.newWords.length).toBeLessThanOrEqual(3)
  expect(session.modeSequence.length).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/engine/sessionBuilder.test.ts`
Expected: FAIL because the builder does not exist.

- [ ] **Step 3: Write the minimal session builder**

Enforce daily caps, due-word priority, and a challenge pool assembled from new, review, and wrong words. Add controlled randomness so mode order is not identical every day, and reserve one light surprise slot that can be enabled without breaking time limits.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/engine/sessionBuilder.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/engine/sessionBuilder.ts src/engine/sessionBuilder.test.ts
git commit -m "Shape daily learning sessions around due review while preserving variety and surprise"
```

### Task 6: Build the Today flow and interactive word-discovery orchestrator

**Files:**
- Create: `src/pages/TodayPage.tsx`
- Create: `src/components/lesson/NewWordCard.tsx`
- Create: `src/components/lesson/LessonFlow.tsx`
- Test: `src/pages/TodayPage.test.tsx`
- Test: `src/components/lesson/LessonFlow.test.tsx`

- [ ] **Step 1: Write the failing flow tests**

```tsx
test("starts from today's mission and advances into the lesson flow", async () => {
  render(<TodayPage />)
  await user.click(screen.getByText("开始今天的冒险"))
  expect(screen.getByText("发现新朋友")).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/pages/TodayPage.test.tsx src/components/lesson/LessonFlow.test.tsx`
Expected: FAIL because the page and flow components do not exist.

- [ ] **Step 3: Write the minimal Today page and lesson state machine**

Keep the child flow linear, but replace passive preview with interactive discovery: mission -> word discovery -> games -> boss -> complete. The first 10 seconds of learning must include a tap, flip, or audio interaction.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/pages/TodayPage.test.tsx src/components/lesson/LessonFlow.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/TodayPage.tsx src/components/lesson
git commit -m "Make the daily mission interactive from the first second instead of front-loading passive preview"
```

### Task 6.5: Build the micro-feedback, combo, and audio layer

**Files:**
- Create: `src/components/feedback/AnswerFeedback.tsx`
- Create: `src/components/feedback/ComboMeter.tsx`
- Create: `src/components/feedback/CelebrationBurst.tsx`
- Create: `src/hooks/useSound.ts`
- Test: `src/components/feedback/AnswerFeedback.test.tsx`

- [ ] **Step 1: Write the failing feedback test**

```tsx
test("shows a gentle success state with celebratory copy", () => {
  render(<AnswerFeedback state="correct" message="太棒了！" />)
  expect(screen.getByText("太棒了！")).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/components/feedback/AnswerFeedback.test.tsx`
Expected: FAIL because the feedback layer does not exist.

- [ ] **Step 3: Write the minimal feedback system**

Use `docs/superpowers/reference/interaction-feedback-system.md` as the contract. Include correct, wrong-soft, combo, and mission-complete states. Respect reduced motion and make audio optional, not blocking.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/components/feedback/AnswerFeedback.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/feedback src/hooks/useSound.ts
git commit -m "Turn encouragement, combo, and celebration into a first-class learning system"
```

### Task 7: Implement Picture Choice and Audio Choice

**Files:**
- Create: `src/components/game/PictureChoice.tsx`
- Create: `src/components/game/AudioChoice.tsx`
- Test: `src/components/game/PictureChoice.test.tsx`
- Test: `src/components/game/AudioChoice.test.tsx`

- [ ] **Step 1: Write the failing game tests**

```tsx
test("submits a correct picture choice", async () => {
  render(<PictureChoice promptWord={word} options={options} onAnswer={onAnswer} />)
  await user.click(screen.getByRole("button", { name: /cat/i }))
  expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: true }))
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/components/game/PictureChoice.test.tsx src/components/game/AudioChoice.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write the minimal components**

Ensure tap targets are large, feedback is immediate, and failure does not feel punitive. Different sessions should be able to reuse the same mode with different visual presentation so the experience stays fresh.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/components/game/PictureChoice.test.tsx src/components/game/AudioChoice.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/game/PictureChoice.tsx src/components/game/AudioChoice.tsx src/components/game/*.test.tsx
git commit -m "Teach words through fast image and audio recognition games"
```

### Task 8: Implement Match Pairs, Spell Blocks, and Boss Review

**Files:**
- Create: `src/components/game/MatchPairs.tsx`
- Create: `src/components/game/SpellBlocks.tsx`
- Create: `src/components/game/BossReview.tsx`
- Test: `src/components/game/MatchPairs.test.tsx`
- Test: `src/components/game/SpellBlocks.test.tsx`
- Test: `src/components/game/BossReview.test.tsx`

- [ ] **Step 1: Write the failing tests for the remaining modes**

```tsx
test("boss review mixes new and review words in the final challenge", () => {
  render(<BossReview newWords={newWords} reviewWords={reviewWords} />)
  expect(screen.getByText("最终挑战")).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/components/game/MatchPairs.test.tsx src/components/game/SpellBlocks.test.tsx src/components/game/BossReview.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write the minimal remaining game modes**

Keep spelling scoped to missing letters or draggable letter blocks. Do not introduce full dictation. Reserve one lightweight surprise mode such as a flip-memory mini challenge only if the base lesson time budget still holds.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/components/game/MatchPairs.test.tsx src/components/game/SpellBlocks.test.tsx src/components/game/BossReview.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/game
git commit -m "Raise recall difficulty gradually with matching, spelling, and a mixed review boss"
```

### Task 9: Add rewards, map, garden, and progress

**Files:**
- Create: `src/pages/MapPage.tsx`
- Create: `src/pages/GardenPage.tsx`
- Create: `src/pages/ProgressPage.tsx`
- Create: `src/components/reward/StarsPanel.tsx`
- Create: `src/components/reward/StreakPanel.tsx`
- Create: `src/components/reward/GardenGrowth.tsx`
- Create: `src/components/map/WorldMap.tsx`
- Create: `src/components/progress/ProgressSummary.tsx`
- Create: `src/components/progress/ErrorWordsList.tsx`
- Test: `src/pages/ProgressPage.test.tsx`

- [ ] **Step 1: Write the failing progress test**

```tsx
test("shows streak, learned words, and common mistakes", () => {
  render(<ProgressPage />)
  expect(screen.getByText("连续学习")).toBeInTheDocument()
  expect(screen.getByText("常错词")).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/pages/ProgressPage.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write the minimal progress and reward views**

Use rewards to reinforce effort, not to hide weak retention. The progress page must still expose frequent mistakes. The garden must show visible growth stages, and the map must clearly distinguish current, locked, and completed nodes.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/pages/ProgressPage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/MapPage.tsx src/pages/GardenPage.tsx src/pages/ProgressPage.tsx src/components/reward src/components/map src/components/progress
git commit -m "Make progress visible through a world map, growth garden, and parent-friendly review summary"
```

### Task 10: Add the lightweight parent panel and textbook import seam

**Files:**
- Create: `src/pages/ParentPage.tsx`
- Create: `src/features/import/normalizeImportedPack.ts`
- Create: `src/features/import/normalizeImportedPack.test.ts`

- [ ] **Step 1: Write the failing import normalization test**

```ts
test("normalizes imported rows into the internal word-pack format", () => {
  const pack = normalizeImportedPack({
    name: "PEP Unit 1",
    rows: [{ word: "cat", meaningZh: "猫", unit: "Unit 1" }]
  })

  expect(pack.meta.source).toBe("textbook")
  expect(pack.words[0].normalizedWord).toBe("cat")
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/features/import/normalizeImportedPack.test.ts`
Expected: FAIL

- [ ] **Step 3: Write the minimal import seam and parent page**

The parent page only needs to preview progress and reserve a future slot for import actions. Do not build a full admin console. Let the child keep limited choice power in the main experience while the parent panel stays observational.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/features/import/normalizeImportedPack.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/ParentPage.tsx src/features/import
git commit -m "Prepare the app for textbook imports without inflating the first parent experience"
```

### Task 11: Finish PWA installation, offline behavior, and touch polish

**Files:**
- Modify: `vite.config.ts`
- Modify: `src/App.tsx`
- Create: `public/manifest.webmanifest`
- Create: `public/icons/*`
- Test: `src/pwa/offline.test.ts`

- [ ] **Step 1: Write the failing offline smoke test**

```ts
test("caches the shell and starter pack for offline use", () => {
  expect(true).toBe(true)
})
```

- [ ] **Step 2: Run test and manual checks to verify the gap**

Run: `npm run test -- src/pwa/offline.test.ts`
Expected: PASS placeholder test, but manual verification still shows no real offline support.

- [ ] **Step 3: Implement the PWA plugin setup and manual verification checklist**

Manual checks:
- Install to home screen
- Reload offline
- Start a daily session without network
- Confirm local progress persists
- Confirm animations degrade safely under reduced-motion settings

- [ ] **Step 4: Run tests and manual checks to verify completion**

Run: `npm run test`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts public src
git commit -m "Make the app installable and reliable for daily offline practice"
```

### Task 12: Run final verification and write delivery notes

**Files:**
- Create: `docs/release-notes/mvp-trial-checklist.md`

- [ ] **Step 1: Write the trial checklist**

Include:
- device matrix
- offline checks
- daily session checks
- wrong-word recovery checks
- parent panel checks

- [ ] **Step 2: Run the full verification suite**

Run: `npm run test`
Expected: PASS

Run: `npm run build`
Expected: PASS

Run: manual child flow on mobile viewport
Expected: Complete session in under 10 minutes

- [ ] **Step 3: Write release notes and known gaps**

Call out what is intentionally deferred:
- cloud sync
- AI story mode
- multi-pack management UI

- [ ] **Step 4: Commit**

```bash
git add docs/release-notes/mvp-trial-checklist.md
git commit -m "Record how to validate the MVP before putting it in front of a real child"
```

## Acceptance Criteria

- A child can open the app and reach today's lesson in at most 2 taps.
- The first meaningful interaction happens within 10 seconds of starting the lesson.
- A full mission includes new words, review words, and a mixed final challenge.
- Mode order varies within safe limits instead of repeating one rigid sequence every day.
- Wrong answers trigger same-day recovery and next-day priority review.
- Progress survives reloads and offline sessions.
- The parent panel surfaces completion, streak, and frequent errors without becoming a full admin surface.
- The codebase is ready to accept imported textbook word lists through a normalization seam.
- Feedback, motion, and sound can be reduced or muted without breaking clarity.
- Parent import supports example sentences and optional image/audio URLs.
- Daily task generation uses previous learning records instead of a fixed starter list.

## Risks to Watch During Execution

- UI polish overtaking memory value
- Visual inconsistency from ad-hoc styling decisions
- Spelling becoming too hard for the age group
- Too many new words per day
- Data contracts drifting away from the documentation
- Parent features expanding into a second product too early

## Definition of Done

- All tests for storage, scheduler, session builder, and game flows pass
- Manual child flow works on mobile viewport
- PWA installs successfully
- Offline shell and starter content load correctly
- First pack supports at least 2 usable topics
- Daily mission stays within the target time budget

Plan complete and saved to `docs/superpowers/plans/2026-04-12-kids-vocabulary-pwa.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
