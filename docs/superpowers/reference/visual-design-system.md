# 视觉设计系统

> 目标：把“儿童友好、第一眼有吸引力、可持续统一扩展”的视觉方向前置定义，避免后续边写组件边拼样式。

## 1. 视觉原则

- 圆润，不尖锐
- 温暖，不冰冷
- 多彩，但不过载
- 像游戏，不像后台
- 有呼吸感，但不晃眼

## 2. 色彩系统

建议首版以奶油底 + 高饱和点缀为基调。

推荐 token：

```css
:root {
  --color-primary: #ff6b6b;
  --color-secondary: #4ecdc4;
  --color-accent: #ffe66d;
  --color-success: #51cf66;
  --color-warning: #ffb347;
  --color-bg: #fff8f0;
  --color-surface: #ffffff;
  --color-text: #3d3a35;
  --color-text-light: #6b675f;
}
```

页面主色建议：

- 今日任务：偏暖色
- 花园：偏绿色
- 地图：偏蓝色
- 进度：偏金色或彩虹点缀

## 3. 字体系统

推荐方向：

- 标题：粗圆体
- 正文：圆润无衬线

示例：

```css
:root {
  --font-heading: "Fredoka", "Baloo 2", cursive;
  --font-body: "Nunito", "Quicksand", sans-serif;
}
```

要求：

- 标题字重明显
- 正文字体不能过细
- 英文单词展示时要大、清晰、留白足够

## 4. 圆角、阴影与触控

```css
:root {
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-pill: 999px;

  --touch-target: 64px;
  --touch-target-lg: 80px;
}
```

要求：

- 主要点击元素的最小点击区不低于 `64px`
- 主要答案卡、主题卡优先使用大圆角
- 阴影应柔和，避免传统商务 UI 的重投影

## 5. 背景系统

禁止使用大面积纯白背景直接铺满。

推荐方案：

- 奶油底色 `#FFF8F0`
- 叠加 3 到 5 个柔和的半透明径向渐变光斑
- 光斑缓慢移动，形成轻微呼吸感

不同页面可更换光斑主色，但不改变整体视觉语言。

## 6. 插画与图标

### 插画

- 扁平插画
- 圆润描边
- 高饱和点缀色
- 同一来源或同一提示词风格

### 图标

- 圆润 SVG 风格
- 避免过细线框
- 避免混搭多套设计语言

## 7. 地图视觉规范

- 垂直滚动蛇形路径
- 节点有大小层级：普通、当前、Boss
- 当前节点具备呼吸高亮
- 完成节点显示星级
- 背景加入轻装饰：树、云、动物、路牌

## 8. 花园视觉规范

- 植物具有明确成长阶段
- 花园界面要让“今天又长大了一点”很明显
- 每个奖励都应可点、可看、可解释
- 断签不出现枯萎或惩罚性视觉

## 9. 动画层级

### 微动画

- 按钮按下
- 卡片弹入
- 星星飞入
- 正确答案发光

### 中交互

- 翻卡
- 拖拽吸附
- 地图节点切换
- 页面滑入滑出

### 重奖励

- 全屏庆祝
- 花园成长
- 解锁新奖励

## 10. 推荐动画关键词

- `pop`
- `bounce`
- `glow`
- `shake`
- `floatUp`
- `celebrate`
- `shimmer`

## 11. 减少动画模式

必须支持：

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

要求：

- 减少动画时保留状态可见性
- 不因关闭动画而损失关键信息
