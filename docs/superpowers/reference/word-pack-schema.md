# 词包数据协议

> 适用范围：YLE 默认词包、自定义主题词包、教材导入后的标准化输出

## 1. 目标

词包协议的目标是让“内容来源”和“学习引擎”解耦。无论数据来自默认 YLE 主题、学校教材还是家长自定义词表，进入应用前都要统一成同一份结构。

## 2. 目录建议

```text
docs/
src/
data/
  word-packs/
    yle-core/
      pack.json
      topics/
        animals.json
        school.json
      media/
        images/
        audio/
```

如果后续有多个来源，建议继续按来源拆目录：

```text
data/word-packs/
  yle-core/
  textbook-pep/
  custom-import/
```

## 3. 词包元信息

```ts
type WordPackMeta = {
  id: string
  name: string
  version: string
  source: "yle-core" | "textbook" | "custom-import"
  locale: "en-US"
  targetLocale: "zh-CN"
  level: "preA1" | "A1"
  description?: string
}
```

建议规则：

- `id` 使用稳定 slug，例如 `yle-core-v1`
- `version` 使用语义版本或日期版本
- `source` 用来区分默认词库和导入内容

## 4. 单词结构

```ts
type WordItem = {
  id: string
  word: string
  normalizedWord: string
  meaningZh: string
  phonics?: string
  ipa?: string
  image?: string
  audio?: string
  example?: string
  exampleZh?: string
  topic: string
  tags: string[]
  level: "preA1" | "A1"
  source: "yle-core" | "textbook" | "custom-import"
  unit?: string
  sortOrder?: number
}
```

### 字段说明

- `id`
  稳定主键，推荐 `source-topic-word` 格式，例如 `yle-animals-cat`

- `word`
  原始展示单词

- `normalizedWord`
  用于搜索和去重，统一转小写并清理空格

- `meaningZh`
  面向孩子的中文释义，尽量短，不堆复杂义项

- `image`
  对应图片资源路径

- `audio`
  对应音频资源路径

- `topic`
  主题归类，例如 `animals`

- `unit`
  用于教材导入时保留教材单元信息

## 5. 主题结构

```ts
type TopicMeta = {
  id: string
  title: string
  titleZh: string
  order: number
  coverImage?: string
  icon?: string
}
```

## 6. 词包整体结构

```ts
type WordPack = {
  meta: WordPackMeta
  topics: TopicMeta[]
  words: WordItem[]
}
```

## 7. JSON 示例

```json
{
  "meta": {
    "id": "yle-core-v1",
    "name": "YLE Core Pack",
    "version": "1.0.0",
    "source": "yle-core",
    "locale": "en-US",
    "targetLocale": "zh-CN",
    "level": "preA1",
    "description": "首版少儿英语主题词包"
  },
  "topics": [
    {
      "id": "animals",
      "title": "Animals",
      "titleZh": "动物",
      "order": 1,
      "coverImage": "/word-packs/yle-core/media/images/topics/animals.png"
    }
  ],
  "words": [
    {
      "id": "yle-animals-cat",
      "word": "cat",
      "normalizedWord": "cat",
      "meaningZh": "猫",
      "phonics": "c-a-t",
      "ipa": "/kæt/",
      "image": "/word-packs/yle-core/media/images/animals/cat.png",
      "audio": "/word-packs/yle-core/media/audio/animals/cat.mp3",
      "example": "This is a cat.",
      "exampleZh": "这是一只猫。",
      "topic": "animals",
      "tags": ["animal", "pet"],
      "level": "preA1",
      "source": "yle-core",
      "sortOrder": 1
    }
  ]
}
```

## 8. 媒体资源规则

### 图片

- 尽量统一为插画风格
- 比例建议统一，例如 `1:1` 或 `4:3`
- 建议使用透明底 PNG 或压缩 WebP
- 如果自定义词包不提供图片，前端允许回退到内置图形/emoji

### 音频

- 命名与单词 ID 保持一致
- 一词一音频
- 优先真人发音，缺失时由 TTS 兜底

### 例句

- 建议每个词至少提供 1 个常用句
- 字段使用 `example` 与 `exampleZh`

## 9. 数据校验规则

每个词导入前应校验：

- `id` 唯一
- `word` 非空
- `meaningZh` 非空
- `topic` 必须存在于 `topics`
- `source` 必须合法
- 资源路径存在或可回退

## 10. 去重规则

建议按以下优先级判断是否重复：

1. `normalizedWord + topic`
2. `normalizedWord + source + unit`
3. `id`

去重时保留字段更完整的词项。

## 11. 与应用层的边界

词包协议只负责“内容表达”，不负责：

- 复习进度
- 掌握状态
- 奖励解锁
- 每日任务生成

这些属于应用运行时数据，应单独存储。
