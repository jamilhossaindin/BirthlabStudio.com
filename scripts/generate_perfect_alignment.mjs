import fs from 'fs';
import wawoff2 from 'wawoff2';
import opentype from 'opentype.js';

async function generate() {
  const woff2Buffer = fs.readFileSync('assets/fonts/manrope-600.woff2');
  const ttfBuffer = await wawoff2.decompress(woff2Buffer);
  const ab = ttfBuffer.buffer.slice(ttfBuffer.byteOffset, ttfBuffer.byteOffset + ttfBuffer.byteLength);
  const font = opentype.parse(ab);

  const viewBoxWidth = 1116;
  const viewBoxHeight = 209;
  const fontSize = 209.407343407838;

  // Mathematically calculated baseline for exact vertical dead-center:
  // Cap-height = 150.77px. Top = baselineY - 150.77. Bottom = baselineY + 3.14 (overshoot).
  // Total span = 153.91. Half = 76.955. Center at 104.5.
  // baselineY = 104.5 + 76.955 - 3.14 = 178.315.
  const baselineY = 178.315;

  const letterSpacingEm = 0.115;
  const letterSpacingPx = letterSpacingEm * fontSize;

  // 1. BIRTH-LAB
  const birthLabChars = 'Birth-Lab'.split('');
  let blGlyphs = [];
  let curX = 0;
  for (let i = 0; i < birthLabChars.length; i++) {
    const glyph = font.charToGlyph(birthLabChars[i]);
    blGlyphs.push({ char: birthLabChars[i], glyph, x: curX });
    curX += (glyph.advanceWidth / font.unitsPerEm) * fontSize;
    if (i < birthLabChars.length - 1) {
      curX += letterSpacingPx;
    }
  }

  let blMinX = Infinity, blMaxX = -Infinity;
  blGlyphs.forEach(item => {
    const p = item.glyph.getPath(item.x, baselineY, fontSize);
    const bb = p.getBoundingBox();
    if (bb.x1 < blMinX) blMinX = bb.x1;
    if (bb.x2 > blMaxX) blMaxX = bb.x2;
  });

  const blContentWidth = blMaxX - blMinX;
  const blOffsetX = (viewBoxWidth - blContentWidth) / 2 - blMinX;

  let blCombinedSvgPaths = [];
  blGlyphs.forEach(item => {
    const p = item.glyph.getPath(item.x + blOffsetX, baselineY, fontSize);
    blCombinedSvgPaths.push(p.toPathData(2));
  });

  const blFinalLeft = blMinX + blOffsetX;
  const blFinalRight = blMaxX + blOffsetX;
  console.log('Birth-Lab final horizontal span:', blFinalLeft.toFixed(2), 'to', blFinalRight.toFixed(2), 'width:', blContentWidth.toFixed(2));
  console.log('Birth-Lab left margin:', blFinalLeft.toFixed(2), 'right margin:', (viewBoxWidth - blFinalRight).toFixed(2));
  console.log('Birth-Lab top margin:', (baselineY - 150.77).toFixed(2), 'bottom margin:', (viewBoxHeight - (baselineY + 3.14)).toFixed(2));

  // 2. STUDIO (JUSTIFIED)
  // Must match exact horizontal span of Birth-Lab: from blFinalLeft to blFinalRight
  const studioChars = ['S', 'T', 'U', 'D', 'I', 'O'];
  const studioGlyphs = studioChars.map(c => {
    const glyph = font.charToGlyph(c);
    const p = glyph.getPath(0, baselineY, fontSize);
    const bb = p.getBoundingBox();
    return {
      char: c,
      glyph,
      bb,
      width: bb.x2 - bb.x1
    };
  });

  const studioTotalGlyphWidth = studioGlyphs.reduce((sum, g) => sum + g.width, 0);
  const studioTotalSpan = blFinalRight - blFinalLeft;
  const studioGap = (studioTotalSpan - studioTotalGlyphWidth) / (studioChars.length - 1);
  console.log('STUDIO total glyph width:', studioTotalGlyphWidth.toFixed(2), 'target span:', studioTotalSpan.toFixed(2), 'gap:', studioGap.toFixed(2));

  let studioCombinedSvgPaths = [];
  let sCurX = blFinalLeft;
  for (let i = 0; i < studioGlyphs.length; i++) {
    const g = studioGlyphs[i];
    const glyphOriginX = sCurX - g.bb.x1;
    const p = g.glyph.getPath(glyphOriginX, baselineY, fontSize);
    studioCombinedSvgPaths.push(p.toPathData(2));
    sCurX += g.width + studioGap;
  }

  // Generate SVG strings
  const blSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" fill="rgb(0, 102, 255)" style="width: 100%; height: 100%; display: block; overflow: visible;">
  <path d="${blCombinedSvgPaths.join(' ')}" fill="rgb(0, 102, 255)" />
</svg>`;

  const studioSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" fill="rgb(0, 102, 255)" style="width: 100%; height: 100%; display: block; overflow: visible;">
  <path d="${studioCombinedSvgPaths.join(' ')}" fill="rgb(0, 102, 255)" />
</svg>`;

  fs.writeFileSync('scripts/bl_vector.svg', blSvg);
  fs.writeFileSync('scripts/studio_vector.svg', studioSvg);
  console.log('Regenerated bl_vector.svg and studio_vector.svg successfully!');
}

generate();
