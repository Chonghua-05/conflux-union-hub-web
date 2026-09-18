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

onMounted(() => {
  updateEdges()
  if (track.value) {
    resizeObserver = new ResizeObserver(updateEdges)
    resizeObserver.observe(track.value)
  }
})
onUnmounted(() => resizeObserver?.disconnect())

function onWheel(e: WheelEvent) {
  if (!track.value || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return
  e.preventDefault()
  track.value.scrollLeft += e.deltaY
}
</script>

<template>
  <div class="rail">
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
  </div>
</template>

<style scoped>
.rail {
  max-width: 1028px;
  margin: 0 auto 40px;
  padding: 0 24px;
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
