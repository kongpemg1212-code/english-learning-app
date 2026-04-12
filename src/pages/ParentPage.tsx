import { useMemo, useState } from 'react'

import { getActiveWordPack } from '../data/word-packs/activePack'
import { normalizeImportedPack } from '../features/import/normalizeImportedPack'
import { parseCsv } from '../features/import/parseCsv'
import { Card } from '../components/ui/Card'
import { useAppStore } from '../store/useAppStore'

export function ParentPage() {
  const totalStars = useAppStore((state) => state.totalStars)
  const currentStreak = useAppStore((state) => state.currentStreak)
  const importedPacks = useAppStore((state) => state.importedPacks)
  const selectedPackId = useAppStore((state) => state.selectedPackId)
  const addImportedPack = useAppStore((state) => state.addImportedPack)
  const selectPack = useAppStore((state) => state.selectPack)
  const activePack = useMemo(
    () => getActiveWordPack(importedPacks, selectedPackId),
    [importedPacks, selectedPackId],
  )
  const [packName, setPackName] = useState('My 词包')
  const [csvText, setCsvText] = useState(
    'word,meaningZh,topic,unit,example,exampleZh,image,audio\ncat,猫,animals,Unit 1,This is a cat.,这是一只猫。,,\n',
  )
  const [message, setMessage] = useState<string | null>(null)

  function downloadTemplate() {
    const template = [
      'word,meaningZh,topic,unit,example,exampleZh,image,audio',
      'cat,猫,animals,Unit 1,This is a cat.,这是一只猫。,,',
      'book,书,school,Unit 1,This is my book.,这是我的书。,,',
    ].join('\n')
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'word-import-template.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  function importCsvText() {
    const rows = parseCsv(csvText)
    const normalizedRows = rows
      .filter((row) => row.word && row.meaningZh)
      .map((row) => ({
        word: row.word,
        meaningZh: row.meaningZh,
        topic: row.topic,
        unit: row.unit,
        example: row.example,
        exampleZh: row.exampleZh,
        image: row.image,
        audio: row.audio,
      }))

    if (normalizedRows.length === 0) {
      setMessage('没有读到有效单词，请检查表头和内容。')
      return
    }

    const pack = normalizeImportedPack({
      name: packName.trim() || 'My 词包',
      rows: normalizedRows,
    })

    addImportedPack(pack)
    setMessage(`已导入 ${pack.words.length} 个词，并切换到 ${pack.meta.name}`)
  }

  return (
    <main style={{ padding: '20px 0' }}>
      <Card style={{ display: 'grid', gap: '16px' }}>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>家长查看</p>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>轻量陪练面板</h1>
        <p style={{ margin: 0 }}>总星星：{totalStars}</p>
        <p style={{ margin: 0 }}>连续学习：{currentStreak} 天</p>
        <p style={{ margin: 0 }}>当前词库：{activePack.meta.name}</p>
        <div style={{ display: 'grid', gap: '10px' }}>
          <button
            type="button"
            onClick={downloadTemplate}
            style={{
              minHeight: '48px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-surface-border)',
              background: 'rgba(255,255,255,0.86)',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            下载导入模板
          </button>
          <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
            图片不会自动上网搜索；如果 image 留空，系统会使用内置图形/emoji 兜底。example 和 exampleZh 可以填一句常用句。
          </p>
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <label style={{ fontWeight: 700 }}>
            词包名称
            <input
              value={packName}
              onChange={(event) => setPackName(event.target.value)}
              style={{
                width: '100%',
                marginTop: '6px',
                minHeight: '44px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-surface-border)',
                padding: '0 12px',
              }}
            />
          </label>
          <label style={{ fontWeight: 700 }}>
            粘贴 CSV 词表
            <textarea
              value={csvText}
              onChange={(event) => setCsvText(event.target.value)}
              rows={8}
              style={{
                width: '100%',
                marginTop: '6px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-surface-border)',
                padding: '12px',
                resize: 'vertical',
              }}
            />
          </label>
          <button
            type="button"
            onClick={importCsvText}
            style={{
              minHeight: '52px',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
              color: '#fff',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            导入词表并切换
          </button>
          {message ? <p style={{ margin: 0, color: 'var(--color-text-light)' }}>{message}</p> : null}
        </div>
        {importedPacks.length > 0 ? (
          <div style={{ display: 'grid', gap: '8px' }}>
            <strong>已导入词库</strong>
            {importedPacks.map((pack) => (
              <button
                key={pack.meta.id}
                type="button"
                onClick={() => selectPack(pack.meta.id)}
                style={{
                  minHeight: '44px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-surface-border)',
                  background:
                    selectedPackId === pack.meta.id
                      ? 'rgba(78,205,196,0.2)'
                      : 'rgba(255,255,255,0.86)',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                {pack.meta.name} · {pack.words.length} 词
              </button>
            ))}
            <button
              type="button"
              onClick={() => selectPack(undefined)}
              style={{
                minHeight: '44px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-surface-border)',
                background: !selectedPackId ? 'rgba(255,230,109,0.25)' : 'rgba(255,255,255,0.86)',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              切回 Cambridge 默认词库
            </button>
          </div>
        ) : null}
      </Card>
    </main>
  )
}
