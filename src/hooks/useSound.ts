type SoundName =
  | 'tap'
  | 'correct'
  | 'wrong-soft'
  | 'combo'
  | 'mission-complete'
  | 'garden-grow'

type UseSoundResult = {
  enabled: boolean
  play: (sound: SoundName) => void
}

export function useSound(enabled = false): UseSoundResult {
  return {
    enabled,
    play: () => {
      // Audio is intentionally a no-op until concrete assets are wired.
    },
  }
}
