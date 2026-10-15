# Semantic Asset Directory (`assets/`)

This directory provides an organized, human-readable view of all media assets in the BirthLab Studio project.

## Directory Structure
- `hero/`: Hero showreel video (`hero-showreel.mp4`)
- `work-highlights/`: 14 preview cards for each project (Just Phil, Slashwork, Epic Travel, MIXD, etc.)
- `about/`: Studio team showcase (`birthlab-og-card.jpg`), founder studio reel, and published books
- `case-studies/`: 17 dedicated project folders containing brand media and video reels
- `audio/`: Audio soundscapes and WAV tracks
- `fonts/`: Subset WOFF2 typography files
- `404/`: 404 page background animations
- `runtime-scripts/`: React 18, Framer Motion, and Lenis smooth scroll engine bundles
- `manifest.json`: Complete bidirectional mapping between clean filenames and runtime hashed files

## Zero-Overhead Guarantee
Files in this directory are linked via filesystem hardlinks to `_assets/`. They consume **0 extra disk space** and guarantee 100% stability for the site's runtime.
