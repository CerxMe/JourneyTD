# JourneyTD
strategy "tower defense" game played on a hexagonal grid

-------------------------------------

live: [Netlify](https://inspiring-jepsen-1d9cc8.netlify.app)

design docs: [Notion](https://incredible-cabbage-74c.notion.site/Tower-Defence-game-f7c8763a4c6440a8b93158c86e8b0663)
| [Figma](https://www.figma.com/file/lIoQwkBZJ1cT5rzONsBlIm/I-don't-know-what-I'm-doing?node-id=0%3A1)
-------------------------------------
## Vue 3 + Vite
[Vite](https://vitejs.dev/guide/), 
uses  [Vue 3](https://v3.vuejs.org) `<script setup>` SFCs [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup), 
[Vue Router 4](https://next.router.vuejs.org/guide/),
[Pinia](https://pinia.vuejs.org/introduction.html) for state management,
templates in [Pug](https://pugjs.org), styles in [Stylus](https://stylus-lang.com), 
[three.js](https://threejs.org/docs/) for 3D graphics.

Should run on any potato with a modern browser.

-------------------------------------
*development*
```
npm i
npm run dev
```