import { categories, findFramework } from '../data/componentRegistry'

export function readGalleryFilters(query) {
  return {
    framework: findFramework(query.framework)?.id ?? 'all',
    category: categories.find(item => item.id === query.category)?.id ?? '',
    search: typeof query.q === 'string' ? query.q : '',
  }
}

export function galleryLocation({ framework, category, search } = {}) {
  const query = {}
  if (framework && framework !== 'all') query.framework = framework
  if (category) query.category = category
  if (search) query.q = search

  return { name: 'gallery', query }
}
