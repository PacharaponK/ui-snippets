import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getSourceSections } from '../server/snippetSource.js'

test('finds the opening lines of top-level Vue blocks, including repeated styles', () => {
  const source = [
    '<!--',
    '<style>ignored</style>',
    '-->',
    '  <script setup>',
    'const tag = `<style>`',
    '</script>',
    '<script>export default {}</script>',
    '  <template',
    '    lang="html">',
    '    <div><template v-if="true">Nested</template></div>',
    '  </template>',
    '<style scoped></style>',
    '  <style>.example { color: red }</style>',
  ].join('\r\n')

  assert.deepEqual(getSourceSections(source), [
    { label: 'Script setup', lineIndex: 3 },
    { label: 'Script', lineIndex: 6 },
    { label: 'Template', lineIndex: 7 },
    { label: 'Style 1', lineIndex: 11 },
    { label: 'Style 2', lineIndex: 12 },
  ])
})
