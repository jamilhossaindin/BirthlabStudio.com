# Third-party code, media and provenance

BirthLab Studio is the current project brand. Rebranding and filenames do not transfer third-party copyright, establish independent authorship, or grant a licence. Existing notices and framework identities remain intact.

## Website implementation

This handover contains a modified Framer-generated implementation derived from the Kus-Studio portfolio by Mike Kus (https://mikekus.com/), as established by the earlier provenance audit. No whole-site reuse grant or editable source-project ownership record was supplied. This entry records provenance; it does not claim that a licence has been granted or determine what credit a separate agreement may require. Retained layout, embedded vector artwork and text need to be included in that clearance. BirthLab's concept labels should not be read as credits for the source site's original client work.

## Runtime and fonts

- React 18.2.0: Facebook, Inc. and its affiliates; MIT licence. Upstream notice: https://github.com/facebook/react/blob/v18.2.0/LICENSE. The corresponding licence is included in LICENSES/React-MIT.txt.
- Framer runtime, Framer Motion and exported components retain their original API names, identifiers and existing notices. Their inclusion here is not a claim of BirthLab authorship or permission to redistribute every export. Confirm the applicable export/project terms and exact embedded dependencies before distribution.
- Lenis smooth scrolling includes a `1.0.29` runtime marker. The matching `@studio-freight/lenis@1.0.29` npm package declares MIT, but its tarball did not include a separate licence file. Keep the implementation and any original notices and obtain the complete upstream notice before redistribution; that package declaration does not license the entire generated bundle. Upstream project: https://github.com/darkroomengineering/lenis.
- Font families present: Inter, JetBrains Mono, Manrope, Geist Mono, Agdasima and Metal Mania. Family names are retained for accurate attribution and to preserve typography. Upstream OFL notices are included under LICENSES where obtained. These notices identify the upstream families; exact binary/version correspondence and any modified/subset font obligations still need verification.
- The enquiry modal adds the unmodified Manrope variable font from https://github.com/google/fonts/blob/main/ofl/manrope/Manrope%5Bwght%5D.ttf as assets/fonts/manrope-enquiry-variable.ttf, under the upstream SIL Open Font License included in LICENSES/Manrope-enquiry-OFL.txt. It uses weights 400, 500 and 600 and a scoped CSS family alias to preserve the surrounding site's existing font selection.
- npm package licences and notices remain inside installed dependencies. Install using the supplied lockfile; do not relabel those packages as proprietary BirthLab code.

## Retained media needing clearance

- `assets/audio/soundscape-interference.mp3` matches the audio served by the source portfolio's About page. Original source URL: https://framerusercontent.com/assets/8w3IUatLX9a5JVJ6XPCVuHi94.mp3. The audio creator and reuse licence were not established.
- Four other files in `assets/audio/` have no complete creator/licence record in the handover.
- Frame Library retains YouTube reference `4874u5AWOGw`; Studio Links retains `PEn6J5YwvNA`. They originated in the corresponding source portfolio pages. Their availability, ownership and embedding permissions were not established by the cleanup.
- Replacement images, SVGs and MP4s have integrity manifests and concept-rendering material, but generation inputs, third-party rights and original authorship are not established by checksums alone.

The working media, embedded vector shapes and typography were preserved to keep the website's current experience. Renaming their files is organizational cleanup, not a change in provenance.

## Alternatives without an automatic media swap

For unresolved audio/video, obtain permission for the existing material, commission original material with documented rights, or select commercially usable media with an explicit licence and recorded attribution. Wikimedia Commons provides per-file licensing information, including public-domain/CC0 and attribution-based options: https://commons.wikimedia.org/wiki/Commons:Licensing. Check the actual file page and satisfy its conditions; the whole collection does not have a single blanket media licence.

For fonts, prefer the same upstream font family and recorded OFL release where its licence and subset provenance are confirmed. A font swap can alter line breaks and spacing, so replacements must be separately approved and visually checked. No media or font replacement was performed during this cleanup.
