<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DynamicIslandNav from './components/DynamicIslandNav.vue'
import HeroSection from './components/HeroSection.vue'
import CategoryChips from './components/CategoryChips.vue'
import GalleryGrid from './components/GalleryGrid.vue'
import LightBox from './components/LightBox.vue'
import FooterBar from './components/FooterBar.vue'
import { fetchLibrary, REPO_URL, type HubImage } from './lib/library'

const ALL = '全部'

const images = ref<HubImage[]>([])
const loading = ref(true)
const loadError = ref('')
const query = ref('')
const activeCategory = ref(ALL)
const lightboxIndex = ref(-1)

onMounted(async () => {
  try {
    images.value = await fetchLibrary()
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
})

const categories = computed(() => {
  const counts = new Map<string, number>()
  for (const img of images.value) {
    counts.set(img.category, (counts.get(img.category) ?? 0) + 1)
  }
  return [
    { name: ALL, count: images.value.length },
    ...[...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
  ]
})

const visible = computed(() => {
  const kw = query.value.toLocaleLowerCase()
  return images.value.filter((img) => {
    if (activeCategory.value !== ALL && img.category !== activeCategory.value) return false
    if (!kw) return true
    return (
      img.name.toLocaleLowerCase().includes(kw) ||
      img.category.toLocaleLowerCase().includes(kw)
    )
  })
})

function pickRandom() {
  const pool = visible.value.length ? visible.value : images.value
  if (!pool.length) return
  lightboxIndex.value = Math.floor(Math.random() * pool.length)
}

function step(delta: number) {
  const n = visible.value.length
  if (!n) return
  lightboxIndex.value = (lightboxIndex.value + delta + n) % n
}

function reload() {
  window.location.reload()
}
</script>

<template>
  <DynamicIslandNav @random="pickRandom" />

  <main>
    <HeroSection v-model:query="query" :total="images.length" :loading="loading" />

    <div v-if="loadError" class="error glass">
      <p>图片清单加载失败：{{ loadError }}</p>
      <p>
        可以到
        <a :href="REPO_URL" target="_blank" rel="noopener">仓库页面</a>
        确认内容，或
        <button type="button" @click="reload">刷新重试</button>
      </p>
    </div>

    <CategoryChips
      v-if="!loadError && !loading"
      :categories="categories"
      :active="activeCategory"
      @select="activeCategory = $event"
    />

    <GalleryGrid v-if="!loadError" :images="visible" :loading="loading" @open="lightboxIndex = $event" />

    <p v-if="!loading && !loadError && visible.length" class="hint">
      共 {{ visible.length }} 张 · 点击图片放大查看
    </p>
  </main>

  <LightBox
    v-if="lightboxIndex >= 0"
    :images="visible"
    :index="lightboxIndex"
    @close="lightboxIndex = -1"
    @step="step"
  />

  <FooterBar />
</template>

<style scoped>
.error {
  max-width: 520px;
  margin: 0 auto 40px;
  padding: 28px 32px;
  border-radius: var(--radius-lg);
  text-align: center;
  font-size: 14px;
  line-height: 1.9;
  color: var(--ink-700);
}

.error p {
  margin: 6px 0;
}

.error a {
  color: var(--aqua-600);
}

.error button {
  border: none;
  border-radius: var(--radius-pill);
  padding: 6px 16px;
  background: linear-gradient(135deg, var(--aqua-500), var(--aqua-600));
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.hint {
  max-width: 1200px;
  margin: -40px auto 60px;
  padding: 0 24px;
  text-align: center;
  font-size: 12.5px;
  color: var(--ink-300);
}
</style>
