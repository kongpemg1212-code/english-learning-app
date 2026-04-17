/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'

import type { WordItem } from '../../types/word'

type IllustrationSize = 'sm' | 'md' | 'lg'

const paletteByTheme = {
  animals: { bg: '#FFF7EE', accent: '#FFB37A', soft: '#FFE2C2', line: '#A86438' },
  'family-and-friends': { bg: '#FFF6FA', accent: '#F7A8C4', soft: '#FFD8E7', line: '#9D5272' },
  'food-and-drink': { bg: '#FFF9EF', accent: '#FFB85C', soft: '#FFE3A6', line: '#A8691F' },
  school: { bg: '#F5FBFF', accent: '#7DC6FF', soft: '#DDF3FF', line: '#397AA7' },
  'daily-routines': { bg: '#F8F6FF', accent: '#BFA9FF', soft: '#E9E0FF', line: '#6B59A8' },
} as const

type ThemeId = keyof typeof paletteByTheme

function getTheme(word: WordItem): ThemeId | null {
  if (word.topic in paletteByTheme) {
    return word.topic as ThemeId
  }

  return null
}

function getIllustrationKind(word: WordItem) {
  const key = word.visualKey ?? word.normalizedWord

  const explicitKinds: Record<string, string> = {
    cat: 'cat',
    dog: 'dog',
    bird: 'bird',
    fish: 'fish',
    elephant: 'elephant',
    tiger: 'tiger',
    rabbit: 'rabbit',
    duck: 'duck',
    baby: 'baby',
    boy: 'boy',
    girl: 'girl',
    dad: 'dad',
    father: 'dad',
    mum: 'mum',
    mother: 'mum',
    grandma: 'grandma',
    grandmother: 'grandma',
    grandpa: 'grandpa',
    grandfather: 'grandpa',
    family: 'family',
    friend: 'friend',
    apple: 'apple',
    banana: 'banana',
    bread: 'bread',
    cake: 'cake',
    burger: 'burger',
    carrot: 'carrot',
    milk: 'milk',
    egg: 'egg',
    juice: 'juice',
    sandwich: 'sandwich',
    alphabet: 'alphabet',
    answer: 'answer',
    board: 'board',
    book: 'book',
    classroom: 'classroom',
    computer: 'computer',
    crayon: 'crayon',
    desk: 'desk',
    pencil: 'pencil',
    teacher: 'teacher',
    student: 'student',
    'wake up': 'wake-up',
    'get dressed': 'get-dressed',
    'go to school': 'go-school',
    'have lunch': 'lunch',
    'clean my teeth': 'brush-teeth',
    'have a shower': 'shower',
    'do homework': 'homework',
    'go home': 'go-home',
    'go to bed': 'go-bed',
  }

  return explicitKinds[key] ?? 'generic'
}

function Face({ x, y, skin = '#FFD7B5' }: { x: number; y: number; skin?: string }) {
  return (
    <>
      <circle cx={x} cy={y} r="18" fill={skin} />
      <circle cx={x - 6} cy={y - 2} r="1.8" fill="#3D3A35" />
      <circle cx={x + 6} cy={y - 2} r="1.8" fill="#3D3A35" />
      <path d={`M ${x - 5} ${y + 6} Q ${x} ${y + 10} ${x + 5} ${y + 6}`} stroke="#3D3A35" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  )
}

function AnimalCat({ palette }: { palette: (typeof paletteByTheme)['animals'] }) {
  return (
    <>
      <ellipse cx="80" cy="105" rx="34" ry="30" fill={palette.accent} />
      <circle cx="80" cy="68" r="24" fill={palette.accent} />
      <path d="M61 52 69 34 75 52" fill={palette.accent} />
      <path d="M85 52 91 34 99 52" fill={palette.accent} />
      <circle cx="73" cy="66" r="2.4" fill={palette.line} />
      <circle cx="87" cy="66" r="2.4" fill={palette.line} />
      <path d="M74 77 Q80 83 86 77" stroke={palette.line} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M104 106 Q122 98 120 76" stroke={palette.line} strokeWidth="6" fill="none" strokeLinecap="round" />
    </>
  )
}

function AnimalDog({ palette }: { palette: (typeof paletteByTheme)['animals'] }) {
  return (
    <>
      <ellipse cx="80" cy="105" rx="34" ry="30" fill="#F4B47A" />
      <circle cx="80" cy="68" r="23" fill="#F4B47A" />
      <ellipse cx="60" cy="64" rx="8" ry="18" fill="#B66D45" transform="rotate(-18 60 64)" />
      <ellipse cx="100" cy="64" rx="8" ry="18" fill="#B66D45" transform="rotate(18 100 64)" />
      <circle cx="73" cy="66" r="2.4" fill={palette.line} />
      <circle cx="87" cy="66" r="2.4" fill={palette.line} />
      <ellipse cx="80" cy="76" rx="7" ry="5" fill="#6B4E3D" />
      <path d="M74 84 Q80 91 86 84" stroke={palette.line} strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  )
}

function AnimalBird({ palette }: { palette: (typeof paletteByTheme)['animals'] }) {
  return (
    <>
      <ellipse cx="82" cy="90" rx="28" ry="24" fill="#7CC6FF" />
      <circle cx="72" cy="66" r="16" fill="#7CC6FF" />
      <path d="M96 90 Q112 80 109 62" stroke="#5F9FD1" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M56 66 44 71 56 77" fill="#FFB85C" />
      <circle cx="76" cy="64" r="2.2" fill={palette.line} />
      <path d="M74 103 68 120" stroke={palette.line} strokeWidth="3" strokeLinecap="round" />
      <path d="M88 103 94 120" stroke={palette.line} strokeWidth="3" strokeLinecap="round" />
    </>
  )
}

function AnimalFish() {
  return (
    <>
      <ellipse cx="78" cy="84" rx="34" ry="24" fill="#65C9D7" />
      <path d="M108 84 130 68 130 100Z" fill="#58AAB7" />
      <circle cx="64" cy="78" r="3" fill="#3D3A35" />
      <path d="M70 92 Q80 98 90 92" stroke="#3D3A35" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M78 62 90 48 98 68" fill="#9DE7F0" />
    </>
  )
}

function AnimalElephant() {
  return (
    <>
      <ellipse cx="80" cy="98" rx="34" ry="30" fill="#B8C0D6" />
      <circle cx="82" cy="66" r="23" fill="#B8C0D6" />
      <circle cx="62" cy="68" r="13" fill="#A7B1C9" />
      <circle cx="102" cy="68" r="13" fill="#A7B1C9" />
      <path d="M82 74 Q86 96 78 114" stroke="#8B97B3" strokeWidth="8" fill="none" strokeLinecap="round" />
      <circle cx="75" cy="64" r="2.4" fill="#3D3A35" />
      <circle cx="89" cy="64" r="2.4" fill="#3D3A35" />
    </>
  )
}

function PersonCard({ outfit, hair, accessory }: { outfit: string; hair: string; accessory?: ReactNode }) {
  return (
    <>
      <Face x={80} y={62} />
      <path d="M58 56 Q80 28 102 56" fill={hair} />
      <rect x="55" y="82" width="50" height="42" rx="16" fill={outfit} />
      <rect x="61" y="120" width="12" height="20" rx="6" fill="#FFCF9C" />
      <rect x="87" y="120" width="12" height="20" rx="6" fill="#FFCF9C" />
      {accessory}
    </>
  )
}

function FoodApple() {
  return (
    <>
      <circle cx="72" cy="88" r="24" fill="#FF7B7B" />
      <circle cx="92" cy="88" r="24" fill="#FF6B6B" />
      <path d="M81 56 Q82 44 88 42" stroke="#5A7F38" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="95" cy="48" rx="12" ry="6" fill="#82C55B" transform="rotate(25 95 48)" />
    </>
  )
}

function FoodBanana() {
  return <path d="M55 102 Q78 54 122 66 Q110 112 70 116 Q60 114 55 102Z" fill="#FFD65C" stroke="#CFA63C" strokeWidth="4" strokeLinejoin="round" />
}

function FoodBread() {
  return <rect x="52" y="58" width="56" height="62" rx="22" fill="#F1BF7A" stroke="#C7894C" strokeWidth="4" />
}

function FoodCake() {
  return (
    <>
      <rect x="50" y="84" width="60" height="34" rx="12" fill="#FFB6D1" />
      <path d="M50 84 Q80 58 110 84" fill="#FFF3F7" />
      <circle cx="80" cy="70" r="5" fill="#FF6B6B" />
    </>
  )
}

function FoodBurger() {
  return (
    <>
      <path d="M48 82 Q80 52 112 82" fill="#F4BE6B" />
      <rect x="48" y="82" width="64" height="10" rx="5" fill="#7BCB61" />
      <rect x="48" y="92" width="64" height="12" rx="5" fill="#8E5B3C" />
      <rect x="48" y="104" width="64" height="16" rx="8" fill="#F0B861" />
    </>
  )
}

function FoodCarrot() {
  return (
    <>
      <path d="M80 56 104 114 56 114Z" fill="#FF9D52" />
      <path d="M80 56 74 40" stroke="#64B55A" strokeWidth="6" strokeLinecap="round" />
      <path d="M88 58 98 44" stroke="#64B55A" strokeWidth="5" strokeLinecap="round" />
    </>
  )
}

function SchoolBook() {
  return (
    <>
      <rect x="52" y="50" width="56" height="70" rx="12" fill="#7DC6FF" />
      <path d="M80 50V120" stroke="#DDF3FF" strokeWidth="4" />
      <rect x="61" y="64" width="28" height="6" rx="3" fill="#DDF3FF" />
    </>
  )
}

function SchoolAlphabet() {
  return (
    <>
      <rect x="48" y="56" width="64" height="58" rx="18" fill="#7AAAF7" />
      <text x="80" y="92" textAnchor="middle" fontSize="28" fontWeight="800" fill="#fff">ABC</text>
    </>
  )
}

function SchoolBoard() {
  return (
    <>
      <rect x="42" y="48" width="76" height="54" rx="10" fill="#6FBF8A" />
      <line x1="56" y1="102" x2="50" y2="126" stroke="#B78654" strokeWidth="5" strokeLinecap="round" />
      <line x1="104" y1="102" x2="110" y2="126" stroke="#B78654" strokeWidth="5" strokeLinecap="round" />
      <path d="M60 70 H98" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
    </>
  )
}

function SchoolPencil() {
  return (
    <>
      <rect x="52" y="78" width="56" height="14" rx="7" fill="#FFC46A" transform="rotate(-18 80 85)" />
      <path d="M108 70 121 76 112 88Z" fill="#F6E6D3" />
      <path d="M121 76 126 79 117 91 112 88Z" fill="#3D3A35" />
    </>
  )
}

function SchoolDesk() {
  return (
    <>
      <rect x="48" y="68" width="64" height="18" rx="8" fill="#D49A63" />
      <line x1="56" y1="86" x2="52" y2="122" stroke="#A86D3E" strokeWidth="5" />
      <line x1="104" y1="86" x2="108" y2="122" stroke="#A86D3E" strokeWidth="5" />
    </>
  )
}

function RoutineBed() {
  return (
    <>
      <rect x="46" y="84" width="68" height="26" rx="12" fill="#F5A7C8" />
      <rect x="46" y="72" width="24" height="16" rx="8" fill="#FFF2F7" />
      <line x1="48" y1="110" x2="48" y2="126" stroke="#B78CAB" strokeWidth="5" />
      <line x1="110" y1="110" x2="110" y2="126" stroke="#B78CAB" strokeWidth="5" />
    </>
  )
}

function RoutineBrush() {
  return (
    <>
      <rect x="55" y="88" width="52" height="12" rx="6" fill="#77C8FF" transform="rotate(-12 81 94)" />
      <rect x="104" y="82" width="12" height="18" rx="4" fill="#FFF6FA" transform="rotate(-12 110 91)" />
    </>
  )
}

function RoutineShower() {
  return (
    <>
      <path d="M52 60 Q82 48 110 62" stroke="#BFA9FF" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M108 62 V82" stroke="#BFA9FF" strokeWidth="7" strokeLinecap="round" />
      <circle cx="98" cy="94" r="4" fill="#7DC6FF" />
      <circle cx="84" cy="102" r="4" fill="#7DC6FF" />
      <circle cx="108" cy="108" r="4" fill="#7DC6FF" />
    </>
  )
}

function RoutineSchool() {
  return (
    <>
      <rect x="54" y="68" width="52" height="40" rx="8" fill="#FFD57E" />
      <path d="M54 68 80 48 106 68" fill="#FF9E7C" />
      <rect x="74" y="86" width="12" height="22" rx="4" fill="#7AAAF7" />
    </>
  )
}

function renderIllustration(theme: ThemeId, kind: string, size: IllustrationSize) {
  const palette = paletteByTheme[theme]
  const labelPad = size === 'sm' ? 2 : 0
  const scene = (() => {
    switch (kind) {
      case 'cat':
        return <AnimalCat palette={paletteByTheme.animals} />
      case 'dog':
        return <AnimalDog palette={paletteByTheme.animals} />
      case 'bird':
        return <AnimalBird palette={paletteByTheme.animals} />
      case 'fish':
        return <AnimalFish />
      case 'elephant':
        return <AnimalElephant />
      case 'tiger':
        return <AnimalCat palette={paletteByTheme.animals} />
      case 'rabbit':
        return <AnimalCat palette={paletteByTheme.animals} />
      case 'duck':
        return <AnimalBird palette={paletteByTheme.animals} />
      case 'baby':
        return <PersonCard outfit="#FFD7A6" hair="#8B5E3C" />
      case 'boy':
      case 'brother':
      case 'dad':
      case 'grandpa':
      case 'friend':
      case 'student':
        return <PersonCard outfit="#7DC6FF" hair="#5D4532" />
      case 'girl':
      case 'sister':
      case 'mum':
      case 'grandma':
        return <PersonCard outfit="#F7A8C4" hair="#6A4537" />
      case 'family':
        return (
          <>
            <PersonCard outfit="#7DC6FF" hair="#5D4532" />
            <g transform="translate(-26 18) scale(0.72)"><PersonCard outfit="#FFD7A6" hair="#8B5E3C" /></g>
            <g transform="translate(26 18) scale(0.72)"><PersonCard outfit="#F7A8C4" hair="#6A4537" /></g>
          </>
        )
      case 'apple':
        return <FoodApple />
      case 'banana':
        return <FoodBanana />
      case 'bread':
        return <FoodBread />
      case 'cake':
        return <FoodCake />
      case 'burger':
        return <FoodBurger />
      case 'carrot':
        return <FoodCarrot />
      case 'milk':
        return <rect x="62" y="58" width="36" height="60" rx="8" fill="#FFFDF7" stroke="#AAC7D9" strokeWidth="4" />
      case 'egg':
        return <ellipse cx="80" cy="86" rx="24" ry="32" fill="#FFF9E8" stroke="#E5D6B5" strokeWidth="4" />
      case 'juice':
        return (
          <>
            <rect x="62" y="58" width="36" height="58" rx="10" fill="#FFB85C" />
            <path d="M80 50 V72" stroke="#7DC6FF" strokeWidth="5" strokeLinecap="round" />
          </>
        )
      case 'sandwich':
        return <><path d="M48 100 80 60 112 100Z" fill="#F4C98B" /><rect x="54" y="88" width="52" height="8" rx="4" fill="#8ED36C" /></>
      case 'alphabet':
        return <SchoolAlphabet />
      case 'answer':
        return <><circle cx="80" cy="80" r="28" fill="#FFEAA6" /><text x="80" y="92" textAnchor="middle" fontSize="42" fontWeight="800" fill="#7A6134">✓</text></>
      case 'board':
      case 'classroom':
        return <SchoolBoard />
      case 'book':
        return <SchoolBook />
      case 'computer':
        return <><rect x="54" y="56" width="52" height="36" rx="8" fill="#7DC6FF" /><rect x="68" y="96" width="24" height="8" rx="4" fill="#9CA8B4" /></>
      case 'crayon':
        return <><rect x="52" y="78" width="56" height="14" rx="7" fill="#FF8FB3" transform="rotate(-18 80 85)" /><path d="M108 70 120 76 112 88Z" fill="#F6E6D3" /></>
      case 'desk':
        return <SchoolDesk />
      case 'pencil':
        return <SchoolPencil />
      case 'teacher':
        return <PersonCard outfit="#FFD57E" hair="#5D4532" />
      case 'wake-up':
        return <><RoutineBed /><text x="104" y="58" textAnchor="middle" fontSize="26">☀️</text></>
      case 'brush-teeth':
        return <RoutineBrush />
      case 'shower':
        return <RoutineShower />
      case 'get-dressed':
        return <><rect x="60" y="58" width="40" height="48" rx="12" fill="#FFB6D1" /><path d="M60 72 80 88 100 72" stroke="#fff" strokeWidth="4" fill="none" /></>
      case 'go-school':
        return <RoutineSchool />
      case 'go-home':
        return <><RoutineSchool /><path d="M40 114 H120" stroke="#82C55B" strokeWidth="6" strokeLinecap="round" /></>
      case 'homework':
        return <><SchoolDesk /><rect x="70" y="64" width="22" height="28" rx="4" fill="#FFFDF7" /></>
      case 'go-bed':
        return <><RoutineBed /><text x="104" y="56" textAnchor="middle" fontSize="24">🌙</text></>
      case 'lunch':
        return <><circle cx="80" cy="88" r="24" fill="#FFF2D8" stroke="#E4C48E" strokeWidth="4" /><circle cx="80" cy="88" r="10" fill="#FF9E7C" /></>
      default:
        return (
          <>
            <rect x={42 + labelPad} y={54} width={76 - labelPad * 2} height={56} rx="20" fill={palette.soft} />
            <circle cx="80" cy="80" r="18" fill={palette.accent} />
            <path d="M64 108 Q80 94 96 108" stroke={palette.line} strokeWidth="6" fill="none" strokeLinecap="round" />
          </>
        )
    }
  })()

  return (
    <svg viewBox="0 0 160 160" width="100%" height="100%" aria-hidden="true">
      <rect x="12" y="12" width="136" height="136" rx="34" fill={palette.bg} />
      <ellipse cx="80" cy="132" rx="38" ry="10" fill={palette.soft} />
      {scene}
    </svg>
  )
}

export function getBuiltInIllustration(word: WordItem, size: IllustrationSize) {
  const theme = getTheme(word)
  if (!theme) {
    return null
  }

  return renderIllustration(theme, getIllustrationKind(word), size)
}
