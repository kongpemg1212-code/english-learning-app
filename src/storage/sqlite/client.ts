import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

import type { CloudAppState } from '../../store/useAppStore'
import type { WordProgress } from '../../types/progress'
import type { DailySession } from '../../types/session'

const DATABASE_STORAGE_KEY = 'word-garden-sqlite'

let sqlitePromise: Promise<SqlJsStatic> | null = null
let databasePromise: Promise<Database> | null = null
let memoryBytes: Uint8Array | null = null

function hasLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function encodeBytes(bytes: Uint8Array) {
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

function decodeBytes(value: string) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function loadPersistedBytes() {
  if (memoryBytes) {
    return memoryBytes
  }

  if (!hasLocalStorage()) {
    return null
  }

  const raw = window.localStorage.getItem(DATABASE_STORAGE_KEY)
  return raw ? decodeBytes(raw) : null
}

function persistDatabase(db: Database) {
  const bytes = db.export()
  memoryBytes = bytes

  if (!hasLocalStorage()) {
    return
  }

  window.localStorage.setItem(DATABASE_STORAGE_KEY, encodeBytes(bytes))
}

async function getSqlite() {
  if (!sqlitePromise) {
    sqlitePromise = initSqlJs({
      locateFile: () => sqlWasmUrl,
    })
  }

  return sqlitePromise
}

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = (async () => {
      const SQL = await getSqlite()
      const persisted = loadPersistedBytes()
      const db = persisted ? new SQL.Database(persisted) : new SQL.Database()

      db.run(`
        create table if not exists profile_state (
          profile_id text primary key,
          payload text not null
        );

        create table if not exists word_progress (
          profile_id text not null,
          word_id text not null,
          payload text not null,
          primary key (profile_id, word_id)
        );

        create table if not exists daily_sessions (
          profile_id text not null,
          session_date text not null,
          payload text not null,
          primary key (profile_id, session_date)
        );
      `)

      persistDatabase(db)
      return db
    })()
  }

  return databasePromise
}

async function selectPayload(
  query: string,
  params: (string | number)[],
): Promise<string | null> {
  const db = await getDatabase()
  const statement = db.prepare(query)
  statement.bind(params)

  const row = statement.step() ? statement.getAsObject() : null
  statement.free()

  return row?.payload ? String(row.payload) : null
}

async function selectPayloadList<T>(
  query: string,
  params: (string | number)[],
): Promise<T[]> {
  const db = await getDatabase()
  const statement = db.prepare(query)
  statement.bind(params)
  const values: T[] = []

  while (statement.step()) {
    const row = statement.getAsObject()
    if (row.payload) {
      values.push(JSON.parse(String(row.payload)) as T)
    }
  }

  statement.free()
  return values
}

async function runMutation(query: string, params: (string | number)[]) {
  const db = await getDatabase()
  db.run(query, params)
  persistDatabase(db)
}

export async function loadProfileState(profileId: string): Promise<CloudAppState | null> {
  const payload = await selectPayload('select payload from profile_state where profile_id = ?', [profileId])
  return payload ? (JSON.parse(payload) as CloudAppState) : null
}

export async function saveProfileState(profileId: string, value: CloudAppState) {
  await runMutation(
    `
      insert into profile_state(profile_id, payload)
      values(?, ?)
      on conflict(profile_id) do update set payload = excluded.payload
    `,
    [profileId, JSON.stringify(value)],
  )
}

export async function getWordProgress(profileId: string, wordId: string): Promise<WordProgress | undefined> {
  const payload = await selectPayload(
    'select payload from word_progress where profile_id = ? and word_id = ?',
    [profileId, wordId],
  )
  return payload ? (JSON.parse(payload) as WordProgress) : undefined
}

export async function listWordProgress(profileId: string): Promise<WordProgress[]> {
  return selectPayloadList<WordProgress>(
    'select payload from word_progress where profile_id = ? order by word_id asc',
    [profileId],
  )
}

export async function saveWordProgress(profileId: string, value: WordProgress) {
  await runMutation(
    `
      insert into word_progress(profile_id, word_id, payload)
      values(?, ?, ?)
      on conflict(profile_id, word_id) do update set payload = excluded.payload
    `,
    [profileId, value.wordId, JSON.stringify(value)],
  )
}

export async function clearWordProgress(profileId: string) {
  await runMutation('delete from word_progress where profile_id = ?', [profileId])
}

export async function getDailySession(profileId: string, date: string): Promise<DailySession | undefined> {
  const payload = await selectPayload(
    'select payload from daily_sessions where profile_id = ? and session_date = ?',
    [profileId, date],
  )
  return payload ? (JSON.parse(payload) as DailySession) : undefined
}

export async function listDailySessions(profileId: string): Promise<DailySession[]> {
  return selectPayloadList<DailySession>(
    'select payload from daily_sessions where profile_id = ? order by session_date asc',
    [profileId],
  )
}

export async function saveDailySession(profileId: string, value: DailySession) {
  await runMutation(
    `
      insert into daily_sessions(profile_id, session_date, payload)
      values(?, ?, ?)
      on conflict(profile_id, session_date) do update set payload = excluded.payload
    `,
    [profileId, value.date, JSON.stringify(value)],
  )
}

export async function clearDailySessions(profileId: string) {
  await runMutation('delete from daily_sessions where profile_id = ?', [profileId])
}
