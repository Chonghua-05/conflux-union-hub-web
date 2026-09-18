<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { HubImage } from '../lib/library'
import { repoBlobUrl } from '../lib/library'

const props = defineProps<{ images: HubImage[]; index: number }>()
const emit = defineEmits<{ close: []; step: [delta: number] }>()

const current = () => props.images[props.index]

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft') emit('step', -1)
  if (e.key === 'ArrowRight') emit('step', 1)
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="box">
      <div class="overlay" @click.self="emit('close')">
        <button class="side left" type="button" aria-label="上一张" @click="emit('step', -1)">‹</button>

        <figure v-if="current()" class="stage glass" :key="current()!.path">
          <div class="frame">
            <img :src="current()!.url" :alt="current()!.name" />
          </div>
          <figcaption>
            <div class="meta">
              <h3>{{ current()!.name }}</h3>
              <p>
                <span class="tag">{{ current()!.category }}</span>
                <span class="pos">{{ index + 1 }} / {{ images.length }}</span>
              </p>
            </div>
            <div class="actions">
              <a :href="current()!.url" target="_blank" rel="noopener" download>原图</a>
              <a :href="repoBlobUrl(current()!.path)" target="_blank" rel="noopener">仓库位置</a>
              <button type="button" aria-label="关闭" @click="emit('close')">×</button>
            </div>
          </figcaption>
        </figure>

        <button class="side right" type="button" aria-label="下一张" @click="emit('step', 1)">›</button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 24px;
  background: var(--overlay-bg);
  backdrop-filter: blur(22px) saturate(1.3);
  -webkit-backdrop-filter: blur(22px) saturate(1.3);
}

.stage {
  display: flex;
  flex-direction: column;
  max-width: min(880px, 92vw);
  max-height: 88vh;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.frame {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 26px 26px 0;
}

.frame img {
  max-width: 100%;
  max-height: calc(88vh - 150px);
  border-radius: var(--radius-md);
  box-shadow: 0 22px 60px rgba(20, 50, 74, 0.35);
  background: var(--img-pad);
}

html.dark .frame img {
  filter: brightness(0.9);
}

figcaption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 24px 22px;
}

.meta {
  min-width: 0;
}

.meta h3 {
  margin: 0 0 6px;
  font-size: 17px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta p {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 12px;
  color: var(--ink-300);
}

.tag {
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  background: var(--tag-bg);
  color: var(--aqua-600);
  font-weight: 600;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
}

.actions a {
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  color: var(--ink-700);
  background: var(--btn-ghost-bg);
  border: 1px solid var(--shell-border);
  transition: transform 0.3s var(--ease-spring), box-shadow 0.3s ease;
}

.actions a:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 60, 84, 0.16);
}

.actions button {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: var(--close-bg);
  color: var(--ink-700);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s var(--ease-spring);
}

.actions button:hover {
  background: var(--close-bg-hover);
  transform: rotate(90deg);
}

.side {
  flex: none;
  width: 46px;
  height: 46px;
  border: 1px solid var(--shell-border);
  border-radius: 50%;
  background: var(--shell);
  backdrop-filter: blur(12px);
  color: var(--ink-700);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  transition: transform 0.3s var(--ease-spring), background 0.3s ease;
}

.side:hover {
  background: var(--shell-strong);
  transform: scale(1.1);
}

.box-enter-active {
  transition: opacity 0.35s ease;
}

.box-enter-active .stage {
  transition: transform 0.5s var(--ease-spring);
}

.box-enter-from {
  opacity: 0;
}

.box-enter-from .stage {
  transform: translateY(30px) scale(0.94);
}

.box-leave-active {
  transition: opacity 0.25s ease;
}

.box-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .side {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .side.left {
    left: 10px;
  }

  .side.right {
    right: 10px;
  }

  figcaption {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
