import { readFile } from 'node:fs/promises'
import { parse } from '@vue/compiler-dom'

export function getSourceSections(source) {
  const labels = { template: 'Template', script: 'Script', style: 'Style' }
  const blocks = parse(source, { parseMode: 'sfc' }).children.filter(
    node => Object.hasOwn(labels, node.tag),
  )
  const numberedStyles = blocks.filter(block => block.tag === 'style').length > 1
  let styleNumber = 0

  return blocks.map(block => {
    let label = labels[block.tag]
    if (block.tag === 'script' && block.props.some(prop => prop.name === 'setup')) {
      label = 'Script setup'
    }
    if (block.tag === 'style' && numberedStyles) {
      label = `Style ${++styleNumber}`
    }
    return { label, lineIndex: block.loc.start.line - 1 }
  })
}

export function snippetSource() {
  const query = '?snippet-source'
  const moduleSuffix = '.snippet-source.js'

  return {
    name: 'snippet-source',
    enforce: 'pre',
    async resolveId(id, importer) {
      if (!id.endsWith('.vue' + query)) return

      const resolved = await this.resolve(id.slice(0, -query.length), importer, { skipSelf: true })
      if (resolved) return resolved.id + moduleSuffix
    },
    async load(id) {
      if (!id.endsWith('.vue' + moduleSuffix)) return

      const filename = id.slice(0, -moduleSuffix.length)
      this.addWatchFile(filename)
      const sourceCode = await readFile(filename, 'utf8')
      return `export default ${JSON.stringify({ sourceCode, sourceSections: getSourceSections(sourceCode) })}`
    },
  }
}
