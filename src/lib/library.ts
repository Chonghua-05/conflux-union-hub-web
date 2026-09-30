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

// 图片清单由香港服务器每 ~3 分钟从 GitHub 拉取一次并缓存在本站静态 JSON，
// 浏览器只读该文件，不再直接调用 api.github.com。
// 原因：匿名 GitHub API 限额为 60 次/小时/IP，若每名访客都实时查询（每次 2 个请求）
// 会很快耗尽并报 “GitHub commit lookup failed: 403”；放到服务端后由单一 IP 缓存复用。
const MANIFEST_URL = '/api/manifest.json'

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)$/i

// 按 main 的最新 commit SHA 固定引用图片：SHA 即内容哈希，
// 每次新提交都会生成全新 URL，可完全绕过 jsDelivr 对分支引用 12 小时的 CDN 缓存，实现“提交即生效”。
export function cdnUrl(sha: string, repoPath: string): string {
  const clean = repoPath.replace(/^\/+/, '')
  const enc = clean.split('/').map(encodeURIComponent).join('/')
  return `https://cdn.jsdelivr.net/gh/${OWNER}/${REPO}@${sha}/${enc}`
}

export function repoBlobUrl(repoPath: string): string {
  const clean = repoPath.replace(/^\/+/, '')
  return `${REPO_URL}/blob/${REF}/${clean.split('/').map(encodeURIComponent).join('/')}`
}

interface TreeNode {
  path: string
  type: string
}

interface Manifest {
  sha: string
  tree: TreeNode[]
}

export async function fetchLibrary(): Promise<HubImage[]> {
  // 读取服务端缓存的清单（含最新 commit SHA 与文件树）
  const res = await fetch(MANIFEST_URL, { cache: 'no-store' })
  if (!res.ok) throw new Error(`图片清单加载失败: ${res.status}`)
  const data: Manifest = await res.json()
  const sha = data.sha
  const tree: TreeNode[] = data.tree ?? []

  return tree
    .filter((t) => t.type === 'blob' && IMAGE_EXT.test(t.path))
    .map((t) => {
      const parts = t.path.replace(/^\/+/, '').split('/')
      if (parts.length < 2) return null
      const [category, ...rest] = parts
      const fileName = rest.join('/')
      return {
        path: t.path,
        name: fileName.replace(/\.[^.]+$/, ''),
        category,
        url: cdnUrl(sha, t.path),
      } satisfies HubImage
    })
    .filter((img): img is HubImage => img !== null)
    .sort((a, b) => a.path.localeCompare(b.path, 'zh-Hans-CN'))
}
