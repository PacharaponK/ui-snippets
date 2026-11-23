# Ready Components

Ready Components is a personal library of interactive PrimeVue 4 and Bootstrap 5.3 snippets for Vue 3. Browse the gallery, narrow it by framework or category, search names and tags, or open a component’s detail page. Use **Source** to view its Vue single-file component and **Copy code** to copy it.

## Run locally

Use Node.js 20.19+ or 22.12+ with npm.

```sh
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Use `npm run build` to create `dist/` and `npm run preview` to serve the build locally.

## Add an example

1. Create a Vue single-file component in `src/examples/primevue/` or `src/examples/bootstrap/`. Keep its markup, state, imports, and example-specific styles in the same file.
2. Add an entry to `src/data/componentRegistry.js` with a unique `id`, a name and description, the framework and category keys, the example filename, search tags, and an official documentation URL when available. Add the label and icon to `categoryDetails` if introducing a new category.

The registry automatically imports the example for live rendering and as raw text for the source viewer. The gallery and detail route use the same entry.

## Use a copied snippet

Use Vue 3.5 or later. PrimeVue snippets expect PrimeVue 4 configured with a theme. Import the PrimeIcons stylesheet for examples using `pi` classes. Bootstrap snippets expect Bootstrap 5.3 CSS in the host project. Dismissal and form interactions use Vue state.

Clipboard access requires a secure context such as HTTPS or localhost and browser permission. You can select and copy the displayed source manually if clipboard access fails. When deploying the build, serve `index.html` for client-side routes such as `/components/primevue-dialog`.
