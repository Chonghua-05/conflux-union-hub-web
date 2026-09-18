<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { SITE_URL } from '../lib/library'

const island = ref(false)
const morphing = ref(false)
const dark = ref(false)
let morphTimer = 0

const emit = defineEmits<{ random: [] }>()

function setTheme(v: boolean, persist = true) {
  dark.value = v
  document.documentElement.classList.toggle('dark', v)
  if (persist) localStorage.setItem('theme', v ? 'dark' : 'light')
}

function onScroll() {
  const next = window.scrollY > 28
  if (next === island.value) return
  island.value = next
  morphing.value = true
  document.documentElement.classList.add('is-morphing')
  clearTimeout(morphTimer)
  morphTimer = window.setTimeout(() => {
    morphing.value = false
    document.documentElement.classList.remove('is-morphing')
  }, 400)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  const saved = localStorage.getItem('theme')
  setTheme(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches, false)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  clearTimeout(morphTimer)
  document.documentElement.classList.remove('is-morphing')
})
</script>

<template>
  <header class="nav-wrap" :class="{ floating: island, morph: morphing }">
    <nav class="island">
      <a class="brand" href="#top" aria-label="回到顶部">
        <span class="brand-mark" aria-hidden="true"></span>
        <strong class="brand-name">hub</strong>
      </a>

      <div class="links">
        <a href="#gallery">画廊</a>
        <a :href="SITE_URL" target="_blank" rel="noopener">官网</a>
      </div>

      <button
        class="theme-btn"
        type="button"
        :aria-label="dark ? '切换到浅色模式' : '切换到深色模式'"
        @click="setTheme(!dark)"
      >
        <svg v-if="dark" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4 19 19M19 5l-1.6 1.6M6.6 17.4 5 19" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
        </svg>
      </button>

      <button class="dice" type="button" @click="emit('random')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
        <span>随机来一张</span>
      </button>
    </nav>
  </header>
</template>

<style scoped>
.nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.island {
  pointer-events: auto;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 8px 28px;
  border-radius: 0;
  background: var(--shell);
  border: 1px solid var(--shell-border);
  backdrop-filter: blur(2px) saturate(1.8);
  -webkit-backdrop-filter: blur(2px) saturate(1.8);
  box-shadow: var(--shadow-soft), var(--glass-spec);
  transition:
    width 0.62s var(--ease-goo),
    padding 0.62s var(--ease-goo),
    border-radius 0.62s var(--ease-goo),
    margin 0.62s var(--ease-goo),
    box-shadow 0.5s var(--ease-out),
    background 0.35s ease;
}

.nav-wrap.floating .island {
  width: min(860px, 92vw);
  margin-top: 10px;
  padding: 5px 8px 5px 14px;
  border-radius: var(--radius-pill);
  background: var(--shell);
  box-shadow: var(--shadow-lift), var(--glass-spec);
  animation: island-jelly 0.6s var(--ease-goo);
}

.nav-wrap.morph .island {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  background: var(--bar-bg-morph);
  will-change: transform, width, border-radius, padding;
}

@keyframes island-jelly {
  0% {
    transform: scale(1, 1);
  }
  30% {
    transform: scale(0.975, 1.035);
  }
  55% {
    transform: scale(1.02, 0.975);
  }
  75% {
    transform: scale(0.992, 1.008);
  }
  100% {
    transform: scale(1, 1);
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  margin-right: auto;
}

.brand-mark {
  width: 76px;
  height: 19px;
  flex: none;
  background: currentColor;
  color: var(--ink-900);
  -webkit-mask: url('../assets/super-symbol.svg') center / contain no-repeat;
  mask: url('../assets/super-symbol.svg') center / contain no-repeat;
  transition: transform 0.4s var(--ease-spring);
}

.brand:hover .brand-mark {
  transform: scale(1.08);
}

.nav-wrap.floating .brand-mark {
  transform: scale(0.92);
}

.brand-name {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--aqua-600);
}

.links {
  display: flex;
  gap: 6px;
}

.links a {
  position: relative;
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  font-size: 14px;
  color: var(--ink-500);
  text-decoration: none;
  transition: background 0.3s ease, color 0.3s ease;
}

.links a:hover {
  color: var(--ink-900);
  background: var(--hover-tint);
}

.theme-btn {
  flex: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--shell-border);
  border-radius: 50%;
  background: var(--hover-tint);
  color: var(--ink-500);
  cursor: pointer;
  transition: transform 0.35s var(--ease-spring), color 0.3s ease;
}

.theme-btn:hover {
  color: var(--ink-900);
  transform: rotate(15deg) scale(1.08);
}

.dice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: none;
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, var(--aqua-500), var(--aqua-600));
  box-shadow: 0 6px 18px var(--accent-glow);
  transition: transform 0.35s var(--ease-spring), box-shadow 0.35s ease;
}

.dice:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 10px 26px var(--accent-glow-strong);
}

.dice:active {
  transform: scale(0.96);
}

@media (max-width: 640px) {
  .links {
    display: none;
  }
}
</style>
