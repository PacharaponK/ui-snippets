<script setup>
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const props = defineProps({
  source: { type: String, required: true },
  sections: { type: Array, required: true },
  open: { type: Boolean, required: true },
})

const codeBlock = useTemplateRef('codeBlock')
const lines = computed(() => props.source.split(/\r?\n/))
const query = ref('')
const matchIndex = ref(0)
const matches = computed(() => {
  if (!query.value) return []

  const pattern = new RegExp(query.value.replace(/[$.*+?^{}()|[\]\\]/g, '\\$&'), 'gi')
  return lines.value.flatMap((line, lineIndex) =>
    Array.from(line.matchAll(pattern), match => ({
      lineIndex,
      start: match.index,
      end: match.index + match[0].length,
    })),
  )
})
const activeMatch = computed(() => matches.value[matchIndex.value])

function scrollToLine(lineIndex) {
  const block = codeBlock.value
  const rows = block.firstElementChild.children
  block.scrollTo({ top: rows[lineIndex].offsetTop - rows[0].offsetTop, left: 0 })
}

async function revealMatch() {
  if (!activeMatch.value) return

  await nextTick()
  if (!props.open || !activeMatch.value) return

  scrollToLine(activeMatch.value.lineIndex)
  const block = codeBlock.value
  const mark = block.querySelector('mark')
  const left = mark.getBoundingClientRect().left - block.getBoundingClientRect().left
  if (left + mark.offsetWidth > block.clientWidth) {
    block.scrollLeft = Math.max(0, left - 24)
  }
}

function moveMatch(direction) {
  const count = matches.value.length
  if (!count) return

  matchIndex.value = (matchIndex.value + direction + count) % count
  revealMatch()
}

watch(query, () => {
  matchIndex.value = 0
  revealMatch()
})
</script>

<template>
  <div v-show="open" id="detail-source-code" class="customize-source-viewer">
    <nav v-if="sections.length" aria-label="Source sections" class="d-flex flex-wrap gap-2 mb-2">
      <Button
        v-for="section in sections"
        :key="section.label"
        :label="section.label"
        :title="'Line ' + (section.lineIndex + 1)"
        aria-controls="customize-source-lines"
        class="text-button"
        text
        size="small"
        @click="scrollToLine(section.lineIndex)"
      />
    </nav>

    <form role="search" aria-label="Vue source" class="d-flex flex-wrap align-items-center gap-2 mb-2" @submit.prevent="moveMatch(1)">
      <label class="visually-hidden" for="source-search">Search source</label>
      <InputText
        id="source-search"
        v-model="query"
        type="search"
        size="small"
        placeholder="Search source"
        autocomplete="off"
        @keydown.shift.enter.prevent="moveMatch(-1)"
      />
      <Button type="button" label="Previous" size="small" text :disabled="!matches.length" @click="moveMatch(-1)" />
      <Button type="submit" label="Next" size="small" text :disabled="!matches.length" />
      <span v-if="query" role="status" class="small text-body-secondary">
        {{ matches.length ? (matchIndex + 1) + ' of ' + matches.length : 'No matches' }}
      </span>
    </form>

    <pre
      id="customize-source-lines"
      ref="codeBlock"
      class="source-code position-relative"
      :style="{ '--source-line-digits': String(lines.length).length }"
      tabindex="0"
      aria-label="Vue single-file component source"
    ><code><template v-for="(line, index) in lines" :key="index"><span class="source-line" :data-line="index + 1"><span aria-hidden="true" class="source-line-number" :data-number="index + 1"></span><template v-if="activeMatch?.lineIndex === index">{{ line.slice(0, activeMatch.start) }}<mark>{{ line.slice(activeMatch.start, activeMatch.end) }}</mark>{{ line.slice(activeMatch.end) }}</template><template v-else>{{ line }}</template></span>{{ index < lines.length - 1 ? '\n' : '' }}</template></code></pre>
  </div>
</template>

<style scoped>
.customize-source-viewer {
  min-width: 0;
}

.source-line {
  display: inline-block;
  min-height: 1lh;
  padding-inline-start: calc((var(--source-line-digits) + 2) * 1ch);
}

.source-line-number {
  position: absolute;
  inset-inline-start: 0;
  width: calc(var(--source-line-digits) * 1ch + 0.6rem);
  text-align: end;
  color: #b4aed1;
  user-select: none;
}

.source-line-number::before {
  content: attr(data-number);
}

.source-line mark {
  background: #ffe18a;
  color: #211b09;
}
</style>
