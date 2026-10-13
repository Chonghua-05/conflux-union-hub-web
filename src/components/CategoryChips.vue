<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  categories: Array<{ name: string; count: number }>
  active: string
}>()

const emit = defineEmits<{ select: [name: string] }>()

const track = ref<HTMLElement>()
const fadeL = ref(false)
const fadeR = ref(false)

function updateEdges() {
  const el = track.value
  if (!el) return
  fadeL.value = el.scrollLeft > 1
  fadeR.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

watch(
  () => props.active,
  async (name) => {
    await nextTick()
    track.value
      ?.querySelector<HTMLElement>(`[data-cat="${name}"]`)
      ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }
)

watch(
  () => props.categories.length,
  async () => {
    await nextTick()
    updateEdges()
  }
)

let resizeObserver: ResizeObserver | undefined
let scrollRaf: number | null = null

function startAutoScroll(direction: 'left' | 'right') {
  stopAutoScroll()
  const step = () => {
    const el = track.value
    if (!el) return
    const speed = direction === 'left' ? -7 : 7
    el.scrollLeft += speed
    updateEdges()

    if (direction === 'left' && el.scrollLeft <= 0) {
      stopAutoScroll()
      return
    }
    if (
      direction === 'right' &&
      el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
    ) {
      stopAutoScroll()
      return
    }
    scrollRaf = requestAnimationFrame(step)
  }
  scrollRaf = requestAnimationFrame(step)
}

function stopAutoScroll() {
  if (scrollRaf !== null) {
    cancelAnimationFrame(scrollRaf)
    scrollRaf = null
  }
}

function scrollByOffset(offset: number) {
  track.value?.scrollBy({ left: offset, behavior: 'smooth' })
}

onMounted(() => {
  updateEdges()
  if (track.value) {
    resizeObserver = new ResizeObserver(updateEdges)
    resizeObserver.observe(track.value)
  }
})

onUnmounted(() => {
  stopAutoScroll()
  resizeObserver?.disconnect()
})

function onWheel(e: WheelEvent) {
  if (!track.value || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return
  e.preventDefault()
  track.value.scrollLeft += e.deltaY
}
</script>

<template>
  <div class="rail">
    <div class="rail-box">
      <!-- 左侧悬停自动滚动区域 -->
      <div
        class="scroll-zone left"
        :class="{ visible: fadeL }"
        aria-hidden="true"
        title="向左滚动"
        @mouseenter="startAutoScroll('left')"
        @mouseleave="stopAutoScroll"
        @click="scrollByOffset(-260)"
      >
        <span class="zone-indicator">‹</span>
      </div>

      <div
        ref="track"
        class="chips"
        :class="{ 'fade-l': fadeL, 'fade-r': fadeR }"
        role="tablist"
        aria-label="按仓库目录分类"
        @wheel="onWheel"
        @scroll.passive="updateEdges"
      >
        <button
          v-for="c in categories"
          :key="c.name"
          class="chip"
          :class="{ on: c.name === active }"
          :data-cat="c.name"
          role="tab"
          :aria-selected="c.name === active"
          type="button"
          @click="emit('select', c.name)"
        >
          {{ c.name }}
          <span class="count">{{ c.count }}</span>
        </button>
      </div>

      <!-- 右侧悬停自动滚动区域 -->
      <div
        class="scroll-zone right"
        :class="{ visible: fadeR }"
        aria-hidden="true"
        title="向右滚动"
        @mouseenter="startAutoScroll('right')"
        @mouseleave="stopAutoScroll"
        @click="scrollByOffset(260)"
      >
        <span class="zone-indicator">›</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rail {
  max-width: 1028px;
  margin: 0 auto 40px;
  padding: 0 24px;
}

.rail-box {
  position: relative;
  width: 100%;
}

.scroll-zone {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 48px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, background 0.25s ease;
  cursor: pointer;
  user-select: none;
}

.scroll-zone.left {
  left: 0;
  background: linear-gradient(90deg, var(--canvas, #eef5fa) 35%, transparent);
}

.scroll-zone.right {
  right: 0;
  background: linear-gradient(270deg, var(--canvas, #eef5fa) 35%, transparent);
}

.scroll-zone.visible {
  opacity: 0.75;
  pointer-events: auto;
}

.scroll-zone.visible:hover {
  opacity: 1;
}

.zone-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--shell-strong, rgba(255, 255, 255, 0.72));
  border: 1px solid var(--hair);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: var(--aqua-600);
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  transition: transform 0.2s var(--ease-spring), background 0.2s ease;
}

.scroll-zone.left:hover .zone-indicator {
  transform: translateX(-2px) scale(1.08);
  background: var(--hover-tint);
}

.scroll-zone.right:hover .zone-indicator {
  transform: translateX(2px) scale(1.08);
  background: var(--hover-tint);
}

@media (hover: none) {
  .scroll-zone {
    display: none;
  }
}

.chips {
  --fade-l: 0px;
  --fade-r: 0px;
  display: flex;
  justify-content: safe center;
  gap: 28px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overscroll-behavior-x: contain;
  padding: 4px 2px;
  mask-image: linear-gradient(90deg, transparent, #000 var(--fade-l), #000 calc(100% - var(--fade-r)), transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 var(--fade-l), #000 calc(100% - var(--fade-r)), transparent);
}

.chips.fade-l {
  --fade-l: 56px;
}

.chips.fade-r {
  --fade-r: 56px;
}

.chips::-webkit-scrollbar {
  display: none;
}

.chip {
  position: relative;
  flex: none;
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding: 10px 2px 13px;
  border: none;
  background: none;
  font-size: 14.5px;
  font-weight: 500;
  letter-spacing: 0.3px;
  font-family: inherit;
  color: var(--ink-500);
  cursor: pointer;
  transition: color 0.3s ease;
}

.chip::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 6px;
  width: 0;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--aqua-400), var(--aqua-600));
  box-shadow: 0 0 10px var(--accent-glow);
  transform: translateX(-50%);
  transition: width 0.4s var(--ease-spring);
}

.chip:hover {
  color: var(--ink-900);
}

.chip.on {
  color: var(--ink-900);
  font-weight: 700;
}

.chip.on::after {
  width: calc(100% - 4px);
}

.count {
  font-size: 11px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--aqua-500);
  opacity: 0.85;
}

.chip.on .count {
  color: var(--aqua-600);
}
</style>
