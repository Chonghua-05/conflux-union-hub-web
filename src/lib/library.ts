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

const GH_API = `https://api.github.com/repos/${OWNER}/${REPO}`
const GH_HEADERS = { Accept: 'application/vnd.github+json' }

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

export async function fetchLibrary(): Promise<HubImage[]> {
  // 1) 取 main 最新提交 SHA（实时请求，走 GitHub API，不受 jsDelivr 分支缓存影响）
  const commitRes = await fetch(`${GH_API}/commits/${REF}`, { headers: GH_HEADERS })
  if (!commitRes.ok) throw new Error(`GitHub commit lookup failed: ${commitRes.status}`)
  const sha: string = (await commitRes.json()).sha

  // 2) 取该提交的完整文件树
  const treeRes = await fetch(`${GH_API}/git/trees/${sha}?recursive=1`, { headers: GH_HEADERS })
  if (!treeRes.ok) throw new Error(`GitHub tree lookup failed: ${treeRes.status}`)
  const tree: TreeNode[] = (await treeRes.json()).tree ?? []

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
