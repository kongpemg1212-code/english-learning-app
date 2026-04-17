import { useEffect, useRef } from 'react'

type SpeakKind = 'word' | 'sentence' | 'hint'

type SpeakOptions = {
  audioUrl?: string
  lang?: string
  kind?: SpeakKind
}

const preferredEnglishVoices = [
  'Samantha',
  'Karen',
  'Tessa',
  'Moira',
  'Ava',
  'Serena',
  'Jenny',
  'Aria',
  'Google UK English Female',
  'Google UK English',
  'Google US English',
]

const preferredChineseVoices = ['Tingting', 'Meijia', 'Sin-ji', 'Xiaoxiao', 'Yunxi']

function pickVoice(voices: SpeechSynthesisVoice[], lang: string) {
  const matching = voices.filter((voice) => voice.lang.toLowerCase().startsWith(lang.toLowerCase()))
  const priorities = lang.startsWith('zh') ? preferredChineseVoices : preferredEnglishVoices

  for (const name of priorities) {
    const exact = matching.find((voice) => voice.name.includes(name))
    if (exact) {
      return exact
    }
  }

  const femaleHint = matching.find((voice) => /female|samantha|karen|ava|serena|jenny|aria/i.test(voice.name))
  if (femaleHint) {
    return femaleHint
  }

  return matching[0] ?? voices[0] ?? null
}

export function useSpeech() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const syncVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices()
      }

      syncVoices()
      window.speechSynthesis.addEventListener?.('voiceschanged', syncVoices)

      return () => {
        window.speechSynthesis.removeEventListener?.('voiceschanged', syncVoices)
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }

        window.speechSynthesis.cancel()
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  async function speak(text: string, options: SpeakOptions = {}) {
    const trimmedText = text.trim()
    if (!trimmedText) {
      return
    }

    const { audioUrl, lang = 'en-US', kind = 'word' } = options

    if (audioUrl && typeof Audio !== 'undefined') {
      try {
        audioRef.current?.pause()
        const audio = new Audio(audioUrl)
        audioRef.current = audio
        await audio.play()
        return
      } catch {
        audioRef.current = null
      }
    }

    if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(trimmedText)
      utterance.lang = lang
      utterance.voice = pickVoice(voicesRef.current, lang)
      utterance.rate = kind === 'word' ? 0.9 : kind === 'sentence' ? 0.96 : 1
      utterance.pitch = kind === 'word' ? 1.12 : 1.04
      window.speechSynthesis.speak(utterance)
    }
  }

  return { speak }
}
