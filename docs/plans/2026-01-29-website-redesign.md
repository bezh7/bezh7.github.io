# Website Redesign: Blob Cursor + Clean Minimal

## Overview

Redesign personal portfolio from terminal/TUI aesthetic to a clean, minimal design with a distinctive interactive element: a gradient blob that replaces the cursor and responds to page elements.

## Design Goals

- Clean and simple with pastel/cream colors
- Personality through the blob cursor interaction
- Generous whitespace (not brutalist minimal)
- Mobile-friendly

## Color Palette

| Element | Color |
|---------|-------|
| Background | Warm cream `#FAF9F6` |
| Body text | Soft black `#1a1a1a` |
| Muted text | Warm gray `#6b6b6b` |
| Links | `#1a1a1a` with hover state |
| Blob | Soft pastel peach/lavender, ~20% opacity |

## Typography

- Font: Inter (or system sans-serif fallback)
- Name: 2rem, bold
- Body: 1rem, regular, line-height 1.7
- Muted/descriptions: 0.95rem

## Spacing

- Page top/bottom padding: 120px
- Max content width: 600px, centered
- Section gaps: 80px
- Project item gaps: 40px

## Layout Structure

```
[120px top padding]

Ben Zhang                          <- bold, larger
upenn m&t '29. building and writing about
whatever i think is cool. currently interested
in ai, infra, and mcp.

[80px gap]

Projects                           <- section label, muted

chatgpt app invocation simulator   <- link
script to test chatgpt app invocations...

[40px gap]

mcp rank                           <- link
lorem ipsum dolor sit amet...

[40px gap]

loople                             <- link
reusable led bracelet for parties...

[40px gap]

kam-research                       <- link
knee adduction moment monitoring...

[80px gap]

substack · linkedin · github       <- links, inline

[120px bottom padding]
```

## The Blob Cursor

### Behavior

- Cursor is hidden (`cursor: none`)
- Gradient blob (~180px diameter) follows mouse with 100ms easing
- Semi-transparent with soft blur (feels like light, not a shape)

### Interactions

| State | Blob Response |
|-------|---------------|
| Default | 180px, 20% opacity, follows cursor |
| Hover project title | Scales to 220px, color shifts warmer |
| Hover bottom links | Subtle pulse animation |
| Hover body text | Shrinks to 120px, fades to 10% (reading mode) |
| Click anywhere | Brief squish (scale down then back) |
| Near viewport edge | Fades out to avoid harsh cutoff |

### Mobile

- Blob is not shown (no hover on touch devices)
- Links have subtle press/tap animations instead

## Link Interactions

- Project titles: underline slides in from left on hover
- Bottom links: color darkens slightly on hover

## Page Load Animation

- Content fades in over 400ms
- Blob fades in 200ms after content

## Content Changes

### Remove
- "unnamed app" (data-labeling-mvp)

### Add
- mcp rank project with placeholder description
- GitHub link in footer links

### Keep
- chatgpt app invocation simulator (metadata-optimizer)
- loople
- kam-research
- substack link
- linkedin link

## Technical Notes

- Pure HTML/CSS/JS (no frameworks needed)
- Blob implemented with CSS radial gradient + JS mouse tracking
- Use `pointer-events: none` on blob so it doesn't interfere with clicks
- Use `mix-blend-mode` for blob to interact nicely with content
