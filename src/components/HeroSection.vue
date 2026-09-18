<script setup lang="ts">
const query = defineModel<string>('query', { required: true })
defineProps<{ total: number; loading: boolean }>()

function onClear() {
  query.value = ''
}
</script>

<template>
  <section class="hero" id="top">
    <p class="kicker">CONFLUX UNION · 表情包集散地</p>
    <h1>
      <em>嘻嘻</em>，没想到<br />
      有人截图了吧
    </h1>
    <p class="desc">
      收录 <strong>Conflux-Union/Conflux-Union-Hub</strong> 仓库的{{ loading ? '' : ` ${total} 张` }}图片，
      按成员目录分类，支持关键词检索与随机抽取。
    </p>

    <label class="search glass">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.2-3.2" />
      </svg>
      <input
        v-model.trim="query"
        type="search"
        placeholder="搜索图片关键词，如「萝莉」「银趴」…"
        aria-label="搜索图片"
      />
      <button v-if="query" class="clear" type="button" aria-label="清空搜索" @click="onClear">×</button>
    </label>
  </section>
</template>

<style scoped>
.hero {
  padding: 108px 24px 40px;
  max-width: 880px;
  margin: 0 auto;
  text-align: center;
}

.kicker {
  margin: 0 0 18px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--aqua-600);
  text-transform: uppercase;
  animation: rise 0.8s var(--ease-out) both;
}

h1 {
  margin: 0;
  font-size: clamp(38px, 6.4vw, 64px);
  line-height: 1.18;
  letter-spacing: 1px;
  animation: rise 0.8s var(--ease-out) 0.08s both;
}

h1 em {
  font-style: normal;
  font-weight: 800;
  background-image: linear-gradient(135deg, #2b6285, #1d7d8e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.45));
}

html.dark h1 em {
  background-image: linear-gradient(135deg, #8ecbea, #6fd6c8);
  -webkit-background-clip: text;
  background-clip: text;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
}

.desc {
  margin: 22px auto 34px;
  max-width: 560px;
  font-size: 15px;
  line-height: 1.9;
  color: var(--ink-500);
  animation: rise 0.8s var(--ease-out) 0.16s both;
}

.desc strong {
  color: var(--ink-700);
}

.search {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 520px;
  margin: 0 auto;
  padding: 3px 8px 3px 16px;
  border-radius: var(--radius-pill);
  color: var(--ink-300);
  animation: rise 0.8s var(--ease-out) 0.24s both;
  transition: box-shadow 0.4s ease, transform 0.4s var(--ease-spring);
}

.search:focus-within {
  box-shadow: var(--shadow-lift), 0 0 0 3px var(--focus-ring);
  transform: translateY(-1px);
}

.search input {
  flex: 1;
  min-width: 0;
  padding: 9px 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  font-family: inherit;
  color: var(--ink-900);
}

.search input::placeholder {
  color: var(--ink-500);
  opacity: 0.8;
}

.search input::-webkit-search-cancel-button {
  display: none;
}

.clear {
  flex: none;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: var(--count-bg);
  color: var(--ink-500);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.3s ease;
}

.clear:hover {
  background: var(--close-bg-hover);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
