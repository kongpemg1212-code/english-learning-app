type KeyedRecord = Record<string, unknown>

type AsyncKeyValueRepo<T> = {
  get: (key: string) => Promise<T | undefined>
  save: (value: T) => Promise<void>
  clear: () => Promise<void>
  list: () => Promise<T[]>
}

type BrowserStoreConfig<T extends KeyedRecord> = {
  dbName: string
  storeName: string
  version: number
  keyField: keyof T
}

const memoryStores = new Map<string, Map<string, unknown>>()

function getMemoryStore(storeName: string) {
  if (!memoryStores.has(storeName)) {
    memoryStores.set(storeName, new Map<string, unknown>())
  }

  return memoryStores.get(storeName)!
}

function hasIndexedDb() {
  return typeof indexedDB !== 'undefined'
}

function openDb<T extends KeyedRecord>({
  dbName,
  storeName,
  version,
}: BrowserStoreConfig<T>) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, version)

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName)
      }
    }

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

async function withStore<T extends KeyedRecord, TResult>(
  config: BrowserStoreConfig<T>,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<TResult>,
) {
  const db = await openDb(config)

  return new Promise<TResult>((resolve, reject) => {
    const transaction = db.transaction(config.storeName, mode)
    const store = transaction.objectStore(config.storeName)
    const request = operation(store)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => db.close()
    transaction.onerror = () => reject(transaction.error)
  })
}

export function createObjectStoreRepository<T extends KeyedRecord>(
  config: BrowserStoreConfig<T>,
): AsyncKeyValueRepo<T> {
  const fallbackStore = getMemoryStore(config.storeName)

  const keyFor = (value: T) => String(value[config.keyField])

  if (!hasIndexedDb()) {
    return {
      async get(key) {
        return fallbackStore.get(key) as T | undefined
      },
      async save(value) {
        fallbackStore.set(keyFor(value), value)
      },
      async clear() {
        fallbackStore.clear()
      },
      async list() {
        return [...fallbackStore.values()] as T[]
      },
    }
  }

  return {
    async get(key) {
      return withStore(config, 'readonly', (store) => store.get(key))
    },
    async save(value) {
      await withStore(config, 'readwrite', (store) => store.put(value, keyFor(value)))
    },
    async clear() {
      await withStore(config, 'readwrite', (store) => store.clear())
    },
    async list() {
      return withStore(config, 'readonly', (store) => store.getAll())
    },
  }
}
