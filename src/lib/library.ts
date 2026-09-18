export interface HubImage {
  path: string
  name: string
  category: string
  url: string
}

export const OWNER = 'Conflux-Union'
export const REPO = 'Conflux-Union-Hub'
export const REF = 'main'

export const REPO_URL = `https://github.com/${OWNER}/${REPO}`
export const SITE_URL = 'https://cxu.world'

const LIST_API = `https://data.jsdelivr.com/v1/packages/gh/${OWNER}/${REPO}@${REF}?structure=flat`
const CDN_BASE = `https://cdn.jsdelivr.net/gh/${OWNER}/${REPO}@${REF}`

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)$/i

export function cdnUrl(repoPath: string): string {
  const clean = repoPath.replace(/^\/+/, '')
  return `${CDN_BASE}/${clean.split('/').map(encodeURIComponent).join('/')}`
}

export function repoBlobUrl(repoPath: string): string {
  const clean = repoPath.replace(/^\/+/, '')
  return `${REPO_URL}/blob/main/${clean.split('/').map(encodeURIComponent).join('/')}`
}

export async function fetchLibrary(): Promise<HubImage[]> {
  const res = await fetch(LIST_API)
  if (!res.ok) throw new Error(`jsDelivr listing failed: ${res.status}`)
  const data = await res.json()
  const files: Array<{ name: string }> = data.files ?? []
  return files
    .filter((f) => IMAGE_EXT.test(f.name))
    .map((f) => {
      const parts = f.name.replace(/^\/+/, '').split('/')
      if (parts.length < 2) return null
      const [category, ...rest] = parts
      const fileName = rest.join('/')
      return {
        path: f.name,
        name: fileName.replace(/\.[^.]+$/, ''),
        category,
        url: cdnUrl(f.name),
      } satisfies HubImage
    })
    .filter((img): img is HubImage => img !== null)
    .sort((a, b) => a.path.localeCompare(b.path, 'zh-Hans-CN'))
}
