# Oxygen Not Included site

The Oxygen Not Included section of Seed Archive, to be served at https://seedarchive.gg/oxygen-not-included/ (`basePath` `/oxygen-not-included`,
`lib/site.ts`); the Oxygen Not Included generator (`../oxygen-not-included`) fills its data. How the games and the portal fit together is
`../.claude/rules/architecture.md`; how to work here is `.claude/rules/`.

## Parts

| Part         | What it is                                                                                                                                                                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app`        | Next.js routes: the home page, `tools`, `tools/map` (the full-page world map)                                                                                                                                                                   |
| `components` | `archive` (the shared header, the section's footer, the shared analytics), `providers` (theme, intl), `oni` (the map page over the shared viewer `@seed-archive/map`), `tools` (the Tools index)                                                                                            |
| `lib`        | `site.ts` (the section's prefix), `i18n` (messages), `oni` (the names of the generator's numbers, written by the generator, and the map's palette), `tools.ts` (the Tools menu) |
| `public`     | static files; `wasm/` the Oxygen Not Included generator built to WebAssembly (`map.js`, `map_bg.wasm`, generated) and its worker                                                                                                                                                         |
| `docs`       | `seo.md`: the section's semantic core and link map                                                                                                                                                                                                                           |

## Run

```bash
npm install      # @seed-archive/map comes from GitHub Packages: the token in ~/.npmrc
npm run dev      # the site on localhost:5030/oxygen-not-included
npm run lint
npm run build
```
