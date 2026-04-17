export const DEFAULT_PROFILE_ID = 'maya'

export function generateProfileId() {
  return `guest-${Math.random().toString(36).slice(2, 8)}`
}

export function normalizeProfileId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
