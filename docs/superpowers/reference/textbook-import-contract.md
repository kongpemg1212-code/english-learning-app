# 教材导入协议

> 目标：让校内教材、外教课词表、家长整理词表都能进入同一条标准化导入流程。

## 1. 设计原则

- 导入层只负责“把外部词表变成系统词包”
- 不直接修改学习引擎
- 所有导入内容都要归一化
- 出错时给清晰提示，不 silently fail

## 2. 支持的输入格式

首轮建议支持：

- CSV
- Excel
- JSON

后续可以扩展：

- 教材模板导入
- 在线表格粘贴

## 3. 最小字段集合

以下字段是导入成功的最小要求：

- 英文单词
- 中文释义

建议字段：

- 所属单元
- 主题
- 图片链接
- 音频链接
- 例句
- 例句中文
- 难度

## 4. 标准导入行结构

```ts
type ImportedWordRow = {
  word: string
  meaningZh: string
  unit?: string
  topic?: string
  image?: string
  audio?: string
  example?: string
  exampleZh?: string
  level?: string
  sourceLabel?: string
}
```

## 5. 标准映射规则

导入流程应支持列名映射。例如：

| 外部列名 | 标准字段 |
| --- | --- |
| 单词 / Word / English | `word` |
| 中文 / 释义 / Meaning | `meaningZh` |
| 单元 / Unit | `unit` |
| 主题 / Topic | `topic` |
| 图片 / Image | `image` |
| 音频 / Audio | `audio` |
| 例句 / Sentence | `example` |
| 例句中文 | `exampleZh` |

## 6. 归一化流程

导入时按以下顺序处理：

1. 读取原始文件
2. 建立字段映射
3. 清理空行
4. 标准化 `word`
5. 生成 `normalizedWord`
6. 补默认 `topic`
7. 补默认 `source`
8. 检查重复词
9. 输出为系统 `WordPack`

## 7. 字段清洗规则

### 单词

- 去前后空格
- 统一大小写策略
- 去除重复空白
- 保留必要连字符

### 中文释义

- 去掉过长说明
- 面向孩子优先保留主义项
- 不强行保留复杂词性堆叠

### 主题

如果外部词表没有主题：

- 可使用 `custom`
- 或按单元生成 `unit-1`, `unit-2`

## 8. 去重策略

优先按 `normalizedWord + topic` 去重。

如果同一单词多次出现：

- 优先保留带图片或音频的记录
- 其次保留带例句的记录
- 再其次保留字段更完整的记录

## 9. 输出格式

导入完成后必须输出为统一词包：

```ts
type ImportedWordPack = {
  meta: {
    id: string
    name: string
    version: string
    source: "textbook" | "custom-import"
    locale: "en-US"
    targetLocale: "zh-CN"
    level: "preA1" | "A1"
    description?: string
  }
  topics: TopicMeta[]
  words: WordItem[]
}
```

## 10. 错误处理

导入失败时，至少区分以下类型：

- 缺少必要字段
- 文件格式错误
- 行数据为空
- 单词全部重复
- 媒体链接不可用

建议返回结构：

```ts
type ImportResult = {
  ok: boolean
  packId?: string
  importedCount: number
  skippedCount: number
  warnings: string[]
  errors: string[]
}
```

## 11. 示例 CSV

```csv
word,meaningZh,unit,topic,example,exampleZh
cat,猫,Unit 1,animals,This is a cat.,这是一只猫。
school bag,书包,Unit 1,school,This is my school bag.,这是我的书包。
banana,香蕉,Unit 2,food,I like bananas.,我喜欢香蕉。
```

## 12. 与产品层的边界

教材导入协议只负责：

- 输入解析
- 字段映射
- 去重清洗
- 生成标准词包

补充说明：

- `example` 和 `exampleZh` 现在是正式支持字段
- `image` 若留空，前端会使用内置图形/emoji 兜底
- `image` 当前不会自动联网搜索

不负责：

- 决定每天学几个词
- 复习调度
- 花园奖励
- 家长端统计
