<script setup lang="ts">
import { REPO_URL, SITE_URL } from '../lib/library'
</script>

<template>
  <footer class="foot">
    <div class="inner">
      <div class="grid">
        <div class="col brand-col">
          <div class="logo-row">
            <span class="dot"></span>
            <strong>Conflux Union Hub</strong>
          </div>
          <p>
            Conflux Union（同川世界）的公共表情图库浏览站。
            所有图片实时来源于 GitHub 仓库，本站不存储任何内容。
          </p>
        </div>

        <nav class="col">
          <h4>前往</h4>
          <a :href="SITE_URL" target="_blank" rel="noopener">.cxu.world 官网</a>
          <a :href="REPO_URL" target="_blank" rel="noopener">GitHub 仓库</a>
          <a :href="`${REPO_URL}/issues/new`" target="_blank" rel="noopener">提交图片 / 反馈</a>
          <a href="#top">回到顶部 ↑</a>
        </nav>

        <nav class="col">
          <h4>指南</h4>
          <p class="tips">
            点击任意图片放大查看，← → 键翻页，Esc 关闭；
            顶栏的骰子按钮可以随时随机捞一张。
          </p>
        </nav>
      </div>

      <div class="base">
        <span>© {{ new Date().getFullYear() }} Conflux Union</span>
        <span>背景插画 <a href="https://www.pixiv.net/artworks/148506746" target="_blank" rel="noopener">「Still, Between Summer」</a> · Android/アンドロイド（Pixiv）</span>
        <span>图片内容版权归各上传者所有 · 仅供社群内部娱乐</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  background: var(--foot-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid var(--hair);
}

.inner {
  max-width: 1152px;
  margin: 0 auto;
  padding: 56px 24px 24px;
}

.grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1.2fr;
  gap: 40px;
}

.logo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.logo-row strong {
  font-size: 17px;
  color: var(--ink-900);
}

.dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 30%, #d7e9f5, var(--aqua-500) 62%, var(--aqua-600));
  box-shadow: 0 3px 10px var(--accent-glow);
}

.brand-col p {
  margin: 0;
  font-size: 13px;
  line-height: 1.9;
  color: var(--ink-500);
}

.col h4 {
  margin: 0 0 14px;
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--aqua-600);
}

.col a {
  display: block;
  width: fit-content;
  margin-bottom: 10px;
  font-size: 13.5px;
  color: var(--ink-700);
  text-decoration: none;
  transition: color 0.3s ease, transform 0.3s var(--ease-spring);
}

.col a:hover {
  color: var(--aqua-600);
  transform: translateX(4px);
}

.tips {
  margin: 0;
  font-size: 13px;
  line-height: 1.9;
  color: var(--ink-500);
}

.base {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1px solid var(--hair);
  font-size: 12px;
  color: var(--ink-300);
}

.base a {
  color: var(--aqua-600);
  text-decoration: none;
}

.base a:hover {
  text-decoration: underline;
}

@media (max-width: 760px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .inner {
    padding: 40px 24px 20px;
  }
}
</style>
