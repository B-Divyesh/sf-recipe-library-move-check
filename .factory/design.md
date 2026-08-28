# Visual thesis: handwritten migration lab notebook

Recipe moves are experiments with irreplaceable family material. The site looks like a careful bench notebook: warm paper, blue ruling, graphite notes, red proof marks, and clipped recipe photographs. It should feel methodical rather than nostalgic or crafty.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| paper | `#F4EEDA` | page background |
| paper-raised | `#FFF9E8` | sheets and controls |
| ink | `#172C35` | primary text; 12.2:1 on paper |
| ink-muted | `#4D5C5F` | secondary text; 6.1:1 on paper |
| rule | `#87A8A4` | notebook lines and borders |
| blue-pencil | `#155E75` | primary actions; white is 7.1:1 |
| proof-red | `#9C2F2F` | collisions and correction marks |
| mustard | `#B16B08` | warnings and tabs |
| leaf | `#2E694B` | confirmed checks |
| night-paper | `#17272C` | explicit dark treatment |
| night-sheet | `#20383D` | dark raised surface |

The palette comes from field notebooks, fountain ink, correction pencil, and old recipe cards. Status always has a word or mark as well as color.

## Type

- Display and annotations: `Comic Sans MS`, `Bradley Hand`, `Segoe Print`, cursive. This intentionally uses local handwriting faces, avoiding a font download and keeping the lab-note character.
- Body and code: `ui-monospace`, `SFMono-Regular`, `Cascadia Code`, monospace. Export inspection benefits from aligned names, counts, and paths.
- Scale: 16, 18, 22, 30, 48 pixels. Body line height is 1.58 and reading width stays below 68 characters.

## Spacing and shape

- An 8-pixel base rhythm with 4-pixel detail increments.
- Main sections use 64–96 pixels of vertical space.
- Sheets have small 2–6 pixel corner variation, a ruled-paper background, and a hard graphite shadow instead of soft SaaS cards.
- Buttons resemble clipped labels. Result markers use circles, ticks, and underlines drawn as CSS strokes.

## Layout and interaction grammar

The landing page is an open workbench, not a centered hero. Copy occupies the left notebook page. The original illustration and terminal transcript overlap on the right like evidence clipped to the sheet. Long red proof lines connect a reported issue to the relevant checklist item. The live preview uses a two-column specimen ledger on wide screens and one continuous page at 390 pixels.

Every action gives a short written status in a live region. Links stay underlined. Focus uses a double blue-pencil outline. The phone layout drops decorative tape and keeps the evidence, actions, and result counts.

## Motion

One signature motion is a 220 ms “proof mark” stroke when results appear. Sheets shift upward by 4 pixels as they enter. Nothing loops. With `prefers-reduced-motion: reduce`, transforms and drawn strokes become immediate opacity changes. Terminal playback is user-triggered and can be paused.

## Original assets and provenance

- `site/public/notebook-migration.webp`: generated for this product with `/opt/fleet/lib/gen-image.sh` using the factory image deployment, 28 August 2026. Prompt: “Editorial overhead still life for a local recipe migration checker, handwritten scientific lab notebook on warm cream paper, two stacks of worn family recipe cards labelled only with abstract lines, a magnifying glass comparing duplicate cards, small red proofreader circles and blue pencil ticks, a USB export folder tab, restrained teal red mustard ink palette, tactile paper cutout and colored pencil texture, asymmetric composition with clear negative space, no readable text, no logos, no people, no gradient, no watermark.” The generated output is original project artwork; WebP derivative is stored in the repository.
- Icons and check marks are hand-made CSS strokes or Unicode marks. No stock assets or third-party icon packs are used.
- The Open Graph image is composed locally from the original artwork and product typography.

## Accessibility and performance decisions

The design is deliberately light-first because paper is the metaphor; the terminal and footer provide the dark treatment. All text pairings meet 4.5:1, controls are at least 44 pixels, decoration has empty alt text, and the hero art has a useful purpose-specific alt. The hero reserves its dimensions, uses WebP, and stays below 300 KB.
