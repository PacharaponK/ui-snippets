# Custom Component Guidelines

- Always start with PrimeVue v4 components for UI controls and interactions. Reuse existing components where they meet the requirements.
- Use Bootstrap first for layout, spacing, responsive behavior, and utility classes. Use Bootstrap Icons as the first choice for icons.
- Use custom CSS only when PrimeVue v4 and Bootstrap cannot meet a component's requirements. Keep custom styles scoped to the component where possible.

## Snippet Development

- When adding or renaming a snippet, update the corresponding registry so the gallery, detail page, and source viewer stay in sync.
- Keep snippets self-contained. Document any imports, stylesheets, or setup required to run the copied code in another Vue project.
- Register signed-in-only Customize snippets in `src/data/customizeRegistry.js` and update the route access rules in `src/data/libraryAccess.js` when adding or renaming one.
- After changing snippet code, run `npm test` and `npm run build`. Verify that the live preview renders and that **Copy code** copies the intended source.
