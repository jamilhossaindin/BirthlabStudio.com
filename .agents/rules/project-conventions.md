# Project Conventions — BirthlabStudio.com

These rules guide development and maintenance in this repository:

1. **Local Server First**:
   - Dev server runs on `http://localhost:3000` via `npm run dev`.
   - Never run build scripts that overwrite local files during active sessions.

2. **Static Routing**:
   - Each route is represented by a directory with an `index.html` file (e.g. `/work/index.html`).
   - Links should link to clean paths or relative `index.html` paths consistently.

3. **Asset Handling**:
   - Assets reside in `_assets/` and use relative references.
   - Heavy assets (videos/uncompressed PNGs) should be optimized if modifying or adding media.

4. **Accessibility (WCAG 2.2 AA)**:
   - Provide descriptive `alt` text for imagery.
   - Maintain visible focus indicators on all links.
   - Ensure color contrast >= 4.5:1.
