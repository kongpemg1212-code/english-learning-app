import type { DailySession } from '../../types/session'
import { createObjectStoreRepository } from '../db'

const dailySessionRepo = createObjectStoreRepository<DailySession>({
  dbName: 'word-garden-db',
  storeName: 'daily-sessions',
  version: 1,
  keyField: 'date',
})

export function getDailySessionRepo() {
  return dailySessionRepo
}
