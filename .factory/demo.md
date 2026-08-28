# Demo sandbox

## Browser

- URL: `https://recipe-library-move-check.sociobot.in/demo`
- Local URL: `http://127.0.0.1:5173/demo` after `npm run dev`
- The page opens directly on completed findings for two fictional Mealie recipes and two fictional Tandoor recipes.
- **Reset demo** replaces the screen with the fixed starting state.
- **Start for real** leaves demo mode and opens the local install instructions.
- Demo state uses only `localStorage` key `demo:recipe-library-move-check:run`. Leaving the demo removes it. No real recipe data exists in the browser app.
- After the first visit and service worker activation, the same sample reloads offline.

## CLI

- Command: `recipe-move-check demo` or `cargo run -- demo`
- The command makes a new temporary directory containing two export folders, the Markdown report, and the JSON inventory.
- It prints the exact sandbox path. Delete that directory to reset or remove the demo.
- The sample source includes Lemon Pasta and Red Lentil Soup. The destination includes Lemon Pasta and Sunday Granola.
- The result contains one collision, one missing image, three field review items, and two ownership reviews.

Both entry points use fixed sample content and need no account or network access.
