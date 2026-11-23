import { computed, defineAsyncComponent } from 'vue'
import { customizeCategoryId } from './libraryAccess'
import { memberComponents } from './librarySession'

const previews = import.meta.glob('../examples/{primevue,bootstrap}/*.vue', { import: 'default' })
const sources = import.meta.glob('../examples/{primevue,bootstrap}/*.vue', { eager: true, import: 'default', query: '?raw' })

export const frameworks = [
  { id: 'primevue', name: 'PrimeVue', icon: 'pi-bolt', url: 'https://primevue.org/' },
  { id: 'bootstrap', name: 'Bootstrap', icon: 'pi-box', url: 'https://getbootstrap.com/docs/5.3/' },
]

const categoryDetails = {
  buttons: { name: 'Buttons', icon: 'pi-stop' },
  [customizeCategoryId]: { name: 'Customize', icon: 'pi-sliders-h' },
  forms: { name: 'Forms', icon: 'pi-list' },
  layout: { name: 'Layout', icon: 'pi-th-large' },
  feedback: { name: 'Feedback', icon: 'pi-comment' },
  overlays: { name: 'Overlays', icon: 'pi-window-maximize' },
}

const entries = [
  {
    id: 'primevue-button',
    name: 'Button',
    description: 'Action buttons with severity, disabled, and loading states.',
    framework: 'primevue',
    category: 'buttons',
    tags: ['action', 'primary', 'secondary', 'success', 'danger', 'loading', 'disabled'],
    file: 'ButtonExample.vue',
    documentationUrl: 'https://primevue.org/button/',
  },
  {
    id: 'primevue-inputtext',
    name: 'InputText',
    description: 'A text field with a placeholder and two-way binding.',
    framework: 'primevue',
    category: 'forms',
    tags: ['input', 'text field', 'v-model', 'placeholder'],
    file: 'InputTextExample.vue',
    documentationUrl: 'https://primevue.org/inputtext/',
  },
  {
    id: 'bootstrap-alerts',
    name: 'Alerts',
    description: 'Contextual messages with a Vue-controlled dismiss action.',
    framework: 'bootstrap',
    category: 'feedback',
    tags: ['status', 'message', 'success', 'warning', 'danger', 'dismissible'],
    file: 'AlertExample.vue',
    documentationUrl: 'https://getbootstrap.com/docs/5.3/components/alerts/',
  },
  {
    id: 'primevue-card',
    name: 'Card',
    description: 'A content container with header, body, and footer slots.',
    framework: 'primevue',
    category: 'layout',
    tags: ['container', 'panel', 'slots', 'header', 'footer'],
    file: 'CardExample.vue',
    documentationUrl: 'https://primevue.org/card/',
  },
  {
    id: 'primevue-dialog',
    name: 'Dialog',
    description: 'A modal that asks for confirmation before applying changes.',
    framework: 'primevue',
    category: 'overlays',
    tags: ['modal', 'overlay', 'confirmation', 'popup'],
    file: 'DialogExample.vue',
    documentationUrl: 'https://primevue.org/dialog/',
  },
  {
    id: 'bootstrap-buttons',
    name: 'Buttons',
    description: 'Solid and outline buttons in three different sizes.',
    framework: 'bootstrap',
    category: 'buttons',
    tags: ['action', 'primary', 'secondary', 'outline', 'small', 'large'],
    file: 'ButtonExample.vue',
    documentationUrl: 'https://getbootstrap.com/docs/5.3/components/buttons/',
  },
  {
    id: 'bootstrap-cards',
    name: 'Cards',
    description: 'A flexible container for a title, description, and action.',
    framework: 'bootstrap',
    category: 'layout',
    tags: ['container', 'panel', 'title', 'action'],
    file: 'CardExample.vue',
    documentationUrl: 'https://getbootstrap.com/docs/5.3/components/card/',
  },
  {
    id: 'bootstrap-forms',
    name: 'Forms',
    description: 'A form with a text field, select, and checkbox.',
    framework: 'bootstrap',
    category: 'forms',
    tags: ['input', 'select', 'checkbox', 'submit', 'validation'],
    file: 'FormExample.vue',
    documentationUrl: 'https://getbootstrap.com/docs/5.3/forms/overview/',
  },
]

const publicComponents = entries.map(({ file, ...entry }) => {
  const path = `../examples/${entry.framework}/${file}`

  return {
    ...entry,
    previewComponent: defineAsyncComponent(previews[path]),
    sourceCode: sources[path],
  }
})

export const componentRegistry = computed(() => [...memberComponents.value, ...publicComponents])

export const categories = Object.keys(categoryDetails)
  .sort()
  .map(id => ({ id, ...categoryDetails[id] }))

export function findFramework(id) {
  return frameworks.find(framework => framework.id === id)
}
