# AI Instructions for Take Care Of My Dogs

## Project Overview

A Progressive Web App (PWA) for tracking daily dog feeding schedules, medications, and supplements for three dogs: Murphy, Lyla, and Gilda.

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Build**: Gulp 5
- **PWA**: Service Worker with cache-first strategy
- **Hosting**: Kinsta static hosting
- **Domain**: takecareofmydogs.com

## File Structure

```
├── index.html          # Main HTML (source)
├── manifest.json       # PWA manifest (source)
├── sw.js              # Service worker (source)
├── package.json       # Dependencies and scripts
├── gulpfile.js        # Build configuration
├── assets/
│   ├── css/styles.css # Source styles
│   ├── js/main.js     # Source JavaScript
│   ├── images/        # Dog and medication photos
│   └── icons/         # PWA icons (72-512px)
└── dist/              # Built output (do not edit directly)
```

## Build Commands

- `npm start` - Development server with hot reload
- `npm run build` - Production build to dist/

## Important Rules

### Never Edit dist/
The dist/ directory is generated. Always edit source files in the project root and assets/ directory.

### Service Worker Versioning
When changing cached assets, update `CACHE_NAME` in sw.js:
```javascript
const CACHE_NAME = 'takecareofmydogs-v1.2.0';
```

### Adding New Images
1. Add image to assets/images/
2. Add path to `ASSETS_TO_CACHE` array in sw.js
3. Increment CACHE_NAME version
4. Run build

### Checkbox Data Attributes
Each checkbox uses `data-item-id` for localStorage persistence:
- Format: `{meal}-{dog}-{item}`
- Example: `breakfast-murphy-wetfood`, `dinner-lyla-benadryl`
- Must be unique across all items

### Cache Busting
Version query strings are added automatically by Gulp from package.json version. Bump package.json version when making significant changes.

## Coding Conventions

### JavaScript
- ES5 compatible (no arrow functions, const/let, template literals in production)
- IIFE wrapper with 'use strict'
- Use `var` for variable declarations
- Function declarations over expressions

### CSS
- Mobile-first responsive design
- No CSS preprocessors
- Use CSS custom properties for theming
- Class naming: BEM-influenced

### HTML
- Semantic elements (header, main, footer, article, section)
- ARIA attributes for accessibility
- data-* attributes for JavaScript hooks

## Dogs and Their Diets

### Murphy
- **Food**: Hill's Prescription Diet k/d Kidney Care (wet, 12.5oz can, 3x daily)
- **Supplements**: Hip & Joint (3), Skin & Coat (3), Probiotics (3) at breakfast

### Lyla
- **Food**: Purina Pro Plan Adult 7+ Shredded Blend (dry, 1 cup, 3x daily)
- **Medications**: Enalapril (2 pills, breakfast), Benadryl (1 pill, breakfast & dinner)
- **Supplements**: Hip & Joint (3), Skin & Coat (3), Probiotics (3) at breakfast

### Gilda
- **Food**: Hill's Prescription Diet c/d Multicare Urinary Care (wet, 12.5oz can, 3x daily)
- **Supplements**: Hip & Joint (3), Skin & Coat (3), Probiotics (3) at breakfast

## Common Tasks

### Updating Feeding Content
Edit index.html directly. Each meal tab (breakfast, lunch, dinner) contains feeding cards for each dog. Follow the existing HTML structure for feeding items.

### Modifying Styles
Edit assets/css/styles.css. Build will autoprefixer and minify.

### Modifying JavaScript
Edit assets/js/main.js. Build will minify with terser.

### Testing PWA
1. Run `npm run build`
2. Serve dist/ directory over HTTPS or localhost
3. Check Chrome DevTools > Application > Manifest and Service Workers

### Deployment
1. Bump version if needed (package.json, sw.js CACHE_NAME)
2. Run `npm run build`
3. Commit and push to main branch
4. Kinsta auto-deploys from Git

## Accessibility Requirements

- All interactive elements must be keyboard accessible
- Maintain ARIA attributes on tabs (role, aria-selected, aria-controls)
- Preserve skip navigation link
- Keep focus indicators visible
- Touch targets minimum 44x44px

## Testing Checklist

Before deploying:
- [ ] `npm run build` completes without errors
- [ ] dist/index.html loads correctly
- [ ] All three meal tabs work
- [ ] Checkboxes persist across page reloads
- [ ] Checkboxes reset at midnight
- [ ] Reset button clears all checkboxes
- [ ] Service worker registers (check DevTools)
- [ ] Site works offline after first load
