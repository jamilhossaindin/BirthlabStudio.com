import fs from 'fs';

const studioSvg = fs.readFileSync('scripts/studio_vector.svg', 'utf8');
const blVectorSvg = fs.readFileSync('scripts/bl_vector.svg', 'utf8');

const testHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Alignment Comparison</title>
  <link rel="stylesheet" href="assets/runtime-scripts/fonts.css">
  <style>
    @font-face {
      font-family: "Manrope";
      src: url("./assets/fonts/manrope-600.woff2") format("woff2");
      font-weight: 600;
      font-style: normal;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #000;
      color: #fff;
      font-family: "Manrope", sans-serif;
      padding: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .wrapper {
      width: 100%;
      max-width: 1140px;
    }
    .box {
      border: 1px solid #333;
      padding: 12px;
      position: relative;
      background: #0a0a0a;
      margin-bottom: 24px;
    }
    /* Guide lines */
    .guide-left {
      position: absolute;
      top: 0; bottom: 0; left: calc(12px + 8.67px * (100% - 24px) / 1116);
      border-left: 1px dashed red;
      pointer-events: none;
      z-index: 10;
    }
    .guide-right {
      position: absolute;
      top: 0; bottom: 0; right: calc(12px + 8.67px * (100% - 24px) / 1116);
      border-right: 1px dashed red;
      pointer-events: none;
      z-index: 10;
    }
    .guide-mid {
      position: absolute;
      left: 0; right: 0; top: 50%;
      border-top: 1px dashed lime;
      pointer-events: none;
      z-index: 10;
    }
    h2 { font-size: 14px; color: #888; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <h2>1. Birth-Lab: foreignObject with Flex Centering</h2>
    <div class="box">
      <div class="guide-left"></div>
      <div class="guide-right"></div>
      <div class="guide-mid"></div>
      <svg viewBox="0 0 1116 209" style="width: 100%; height: 100%; display: block; overflow: visible;">
        <foreignObject width="100%" height="100%" style="overflow: visible;">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-align: center;">
            <h1 style="font-family: 'Manrope', sans-serif; font-size: 209.407343407838px; font-weight: 600; letter-spacing: 0.115em; line-height: 1; color: rgb(0, 102, 255); margin: 0; padding: 0; transform: translateY(-0.06em); display: inline-flex; align-items: center; justify-content: center;">
              Birth-Lab
            </h1>
          </div>
        </foreignObject>
      </svg>
    </div>

    <h2>2. Birth-Lab: Vector Paths directly extracted from Manrope 600 font</h2>
    <div class="box">
      <div class="guide-left"></div>
      <div class="guide-right"></div>
      <div class="guide-mid"></div>
      ${blVectorSvg}
    </div>

    <h2>3. STUDIO: Vector Paths directly extracted from Manrope 600 font (Justified, Centered)</h2>
    <div class="box">
      <div class="guide-left"></div>
      <div class="guide-right"></div>
      <div class="guide-mid"></div>
      ${studioSvg}
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('test_comparison.html', testHtml);
console.log('Saved test_comparison.html');
