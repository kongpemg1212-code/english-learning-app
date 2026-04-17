export const DEFAULT_PROFILE_ID = 'maya'

export function generateProfileId() {
  return DEFAULT_PROFILE_ID
}

export function normalizeProfileId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
