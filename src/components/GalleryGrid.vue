<script setup lang="ts">
import { ref } from 'vue'
import type { HubImage } from '../lib/library'

defineProps<{ images: HubImage[]; loading: boolean }>()
const emit = defineEmits<{ open: [index: number] }>()

const loaded = ref(new Set<string>())

function onImgLoad(path: string) {
  loaded.value = new Set(loaded.value).add(path)
}
</script>

<template>
  <section id="gallery" class="gallery">
    <div v-if="loading" class="masonry">
      <div v-for="i in 9" :key="i" class="card glass skeleton" :style="{ minHeight: `${150 + (i % 3) * 70}px` }">
        <div class="shimmer"></div>
      </div>
    </div>

    <TransitionGroup v-else tag="div" name="pop" class="masonry">
      <figure
        v-for="(img, i) in images"
        :key="img.path"
        class="card glass"
        :class="{ ready: loaded.has(img.path) }"
        tabindex="0"
        role="button"
        :aria-label="`查看 ${img.name}`"
        @click="emit('open', i)"
        @keydown.enter="emit('open', i)"
      >
        <div class="thumb">
          <img :src="img.url" :alt="img.name" loading="lazy" @load="onImgLoad(img.path)" />
        </div>
        <figcaption>
          <span class="name">{{ img.name }}</span>
          <span class="tag">{{ img.category }}</span>
        </figcaption>
      </figure>
    </TransitionGroup>

    <p v-if="!loading && images.length === 0" class="empty glass">
      没有匹配的图片，换个关键词试试？<br />
      <small>也可能仓库里还没有这个分类的内容。</small>
    </p>
  </section>
</template>

<style scoped>
.gallery {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 90px;
}

.masonry {
  position: relative;
  columns: 4 240px;
  column-gap: 20px;
}

.card {
  break-inside: avoid;
  margin: 0 0 20px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.4s var(--ease-spring),
    box-shadow 0.4s ease;
}

.card:hover,
.card:focus-visible {
  transform: translateY(-6px) scale(1.015);
  box-shadow: var(--shadow-lift);
  outline: none;
}

.thumb {
  position: relative;
  background: var(--thumb-bg);
}

html.dark .thumb::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(13, 26, 36, 0.22);
  pointer-events: none;
}

.thumb img {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 0.5s ease, transform 0.7s var(--ease-out);
}

.card.ready .thumb img {
  opacity: 1;
  transform: none;
}

figcaption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 16px;
}

.name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-700);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag {
  flex: none;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  background: var(--tag-bg);
  color: var(--aqua-600);
}

.skeleton {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 30%, var(--shimmer) 50%, transparent 70%);
  transform: translateX(-100%);
  animation: sweep 1.6s ease-in-out infinite;
}

@keyframes sweep {
  to {
    transform: translateX(100%);
  }
}

.empty {
  max-width: 460px;
  margin: 30px auto 0;
  padding: 34px 30px;
  border-radius: var(--radius-lg);
  text-align: center;
  font-size: 15px;
  line-height: 2;
  color: var(--ink-500);
}

.empty small {
  color: var(--ink-300);
}

.pop-enter-active {
  transition: opacity 0.45s ease, transform 0.5s var(--ease-spring);
}

.pop-enter-from {
  opacity: 0;
  transform: translateY(26px) scale(0.94);
}

/* p1y=1.2 → 过冲约 1.3%：即使 ~2400px 的大位移也只多弹 ~30px，弹顶停在标签栏下方 */
.pop-move {
  transition:
    transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1),
    box-shadow 0.4s ease;
}

.pop-leave-active {
  transition: opacity 0.25s ease, transform 0.3s ease;
  position: absolute;
  pointer-events: none;
}

.pop-leave-from {
  opacity: 1;
}

.pop-leave-to {
  opacity: 0;
  transform: scale(0.92);
}
</style>
