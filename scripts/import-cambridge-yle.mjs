import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const sourcePath = path.join(projectRoot, 'Cambridge_YLE_PreA1_Starters_Vocabulary.md')
const packPath = path.join(projectRoot, 'src', 'data', 'word-packs', 'yle-core', 'pack.json')
const topicsDir = path.join(projectRoot, 'src', 'data', 'word-packs', 'yle-core', 'topics')
const allWordsPath = path.join(projectRoot, 'src', 'data', 'word-packs', 'yle-core', 'all-words.json')

const topicMap = [
  ['Animals', { id: 'animals', titleZh: '动物', icon: 'paw' }],
  ['Colours', { id: 'colours', titleZh: '颜色', icon: 'palette' }],
  ['Family & Friends', { id: 'family-and-friends', titleZh: '家人和朋友', icon: 'heart' }],
  ['Food & Drink', { id: 'food-and-drink', titleZh: '食物和饮料', icon: 'apple' }],
  ['The Home', { id: 'home', titleZh: '家', icon: 'home' }],
  ['School', { id: 'school', titleZh: '学校', icon: 'backpack' }],
  ['Sports & Leisure', { id: 'sports-and-leisure', titleZh: '运动和休闲', icon: 'ball' }],
  ['Toys', { id: 'toys', titleZh: '玩具', icon: 'toy' }],
  ['Transport', { id: 'transport', titleZh: '交通工具', icon: 'car' }],
  ['Days of the Week', { id: 'days-of-the-week', titleZh: '星期', icon: 'calendar' }],
  ['Months', { id: 'months', titleZh: '月份', icon: 'calendar-month' }],
  ['Seasons', { id: 'seasons', titleZh: '季节', icon: 'leaf' }],
  ['Weather', { id: 'weather', titleZh: '天气', icon: 'cloud' }],
  ['Places & Directions', { id: 'places-and-directions', titleZh: '地点和方向', icon: 'map-pin' }],
  ['Work', { id: 'work', titleZh: '工作', icon: 'briefcase' }],
]

function sanitizeWord(rawWord) {
  return rawWord
    .replace(/\s*\(.*$/, '')
    .split('/')[0]
    .replace(/\s+/g, ' ')
    .trim()
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function articleFor(word) {
  return /^[aeiou]/i.test(word) ? 'an' : 'a'
}

function generateExample(word, meaningZh, topicId) {
  const cleanWord = word.trim()

  if (topicId === 'colours') {
    return {
      example: `It is ${cleanWord}.`,
      exampleZh: `它是${meaningZh}的。`,
    }
  }

  if (topicId === 'weather') {
    return {
      example: `It is ${cleanWord} today.`,
      exampleZh: `今天天气${meaningZh}。`,
    }
  }

  if (topicId === 'family-and-friends') {
    return {
      example: `This is my ${cleanWord}.`,
      exampleZh: `这是我的${meaningZh}。`,
    }
  }

  if (topicId === 'food-and-drink') {
    return {
      example: `I like ${cleanWord}.`,
      exampleZh: `我喜欢${meaningZh}。`,
    }
  }

  if (topicId === 'work') {
    return {
      example: `She is ${articleFor(cleanWord)} ${cleanWord}.`,
      exampleZh: `她是一名${meaningZh}。`,
    }
  }

  if (topicId === 'places-and-directions') {
    return {
      example: `The ${cleanWord} is here.`,
      exampleZh: `${meaningZh}在这里。`,
    }
  }

  if (topicId === 'school') {
    return {
      example: `This is my ${cleanWord}.`,
      exampleZh: `这是我的${meaningZh}。`,
    }
  }

  if (topicId === 'home') {
    return {
      example: `This is the ${cleanWord}.`,
      exampleZh: `这是${meaningZh}。`,
    }
  }

  if (topicId === 'transport') {
    return {
      example: `I can see ${articleFor(cleanWord)} ${cleanWord}.`,
      exampleZh: `我能看到一辆${meaningZh}。`,
    }
  }

  if (topicId === 'toys') {
    return {
      example: `I have ${articleFor(cleanWord)} ${cleanWord}.`,
      exampleZh: `我有一个${meaningZh}。`,
    }
  }

  if (topicId === 'sports-and-leisure') {
    return {
      example: `I can play with the ${cleanWord}.`,
      exampleZh: `我可以玩${meaningZh}。`,
    }
  }

  return {
    example: `Look at ${articleFor(cleanWord)} ${cleanWord}.`,
    exampleZh: `看这个${meaningZh}。`,
  }
}

const markdown = await fs.readFile(sourcePath, 'utf8')
const lines = markdown.split(/\r?\n/)

const generatedTopics = []
const generatedWordsByTopic = new Map()
let currentTopic = null
let currentTopicKey = null
let inThematicSection = false

for (const line of lines) {
  if (line.startsWith('## 主题分类词汇')) {
    inThematicSection = true
    continue
  }

  if (!inThematicSection) {
    continue
  }

  const topicMatch = line.match(/^###\s+(.+?)\s+[\u4e00-\u9fff].*$/)
  if (topicMatch) {
    currentTopicKey = topicMatch[1].trim()
    const mapping = topicMap.find(([key]) => key === currentTopicKey)
    if (!mapping) {
      currentTopic = null
      continue
    }

    currentTopic = mapping[1]
    generatedTopics.push({
      id: currentTopic.id,
      title: currentTopicKey,
      titleZh: currentTopic.titleZh,
      order: generatedTopics.length + 1,
      icon: currentTopic.icon,
    })
    generatedWordsByTopic.set(currentTopic.id, [])
    continue
  }

  if (!currentTopic) {
    continue
  }

  if (!line.startsWith('|') || line.includes('| 单词 | 中文 |') || /^\|\s*-+/.test(line)) {
    continue
  }

  const cells = line
    .split('|')
    .map((cell) => cell.trim())
    .filter(Boolean)

  if (cells.length < 2 || cells[0] === '单词' || cells[0] === '------') {
    continue
  }

  const rawWord = cells[0]
  const meaningZh = cells[1]
  const word = sanitizeWord(rawWord)

  if (!word || !meaningZh) {
    continue
  }

  const words = generatedWordsByTopic.get(currentTopic.id)
  const wordId = `yle-${currentTopic.id}-${slugify(word)}`
  if (words.some((item) => item.id === wordId)) {
    continue
  }

  words.push({
    id: wordId,
    word,
    normalizedWord: word.toLowerCase(),
    meaningZh,
    ...generateExample(word, meaningZh, currentTopic.id),
    topic: currentTopic.id,
    tags: [currentTopic.id],
    level: 'preA1',
    source: 'yle-core',
    sortOrder: words.length + 1,
  })
}

await fs.writeFile(
  packPath,
  `${JSON.stringify(
    {
      meta: {
        id: 'yle-core-v1',
        name: 'YLE Core Pack',
        version: '2.0.0',
        source: 'yle-core',
        locale: 'en-US',
        targetLocale: 'zh-CN',
        level: 'preA1',
        description: 'Cambridge YLE Pre A1 Starters 主题词包',
      },
      topics: generatedTopics,
    },
    null,
    2,
  )}\n`,
)

for (const [topicId, words] of generatedWordsByTopic.entries()) {
  await fs.writeFile(path.join(topicsDir, `${topicId}.json`), `${JSON.stringify(words, null, 2)}\n`)
}

const allWords = [...generatedWordsByTopic.values()].flat()
await fs.writeFile(allWordsPath, `${JSON.stringify(allWords, null, 2)}\n`)
