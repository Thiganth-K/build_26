import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create public/logo.svg (Crisp Vector Logo matching Gemini_Generated_Image_8nul298nul298nul.png)
const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 120" width="420" height="120" fill="none">
  <!-- Core Symbol: Two Bold Slanted Slashes // -->
  <g transform="translate(10, 10)">
    <polygon points="25,95 50,5 72,5 47,95" fill="#111111" />
    <polygon points="55,95 80,5 102,5 77,95" fill="#111111" />
  </g>
  <!-- Text: BUILD//26 -->
  <text x="125" y="78" font-family="'Inter', 'Arial Black', sans-serif" font-weight="900" font-size="68" fill="#111111" letter-spacing="-2">BUILD<tspan fill="#4E56E8">//</tspan>26</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgLogo);

// 2. Create public/logo-mark.svg (Icon-only circle/badge with //)
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" fill="none">
  <circle cx="50" cy="50" r="46" fill="#111111" stroke="#000000" stroke-width="3"/>
  <g transform="translate(14, 12) scale(0.72)">
    <polygon points="25,95 50,5 72,5 47,95" fill="#FFFFFF" />
    <polygon points="55,95 80,5 102,5 77,95" fill="#FFFFFF" />
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'logo-mark.svg'), svgIcon);

// 3. Generate a pure PNG file for public/logo.png (256x256 RGBA)
function createPng(width, height, drawFn) {
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel + 1;
  const rawData = Buffer.alloc(stride * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * stride;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ byte) & 1) {
          crc = (crc >>> 1) ^ 0xEDB88320;
        } else {
          crc = crc >>> 1;
        }
        byte = byte >>> 1;
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeAndData, crc]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bit depth
  ihdrData[9] = 6; // RGBA color type
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Draw the circle badge with the double // symbol
const iconPng = createPng(256, 256, (x, y, w, h) => {
  const cx = w / 2;
  const cy = h / 2;
  const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  
  // Outer black circle
  if (dist <= 118) {
    // Check if inside first slash: slanted forward
    // line equation: x - 0.3 * (h - y)
    const slantX = x + (y - cy) * 0.38;
    
    // Slash 1: slantX between 92 and 114, y between 60 and 196
    const inSlash1 = slantX >= 92 && slantX <= 116 && y >= 60 && y <= 196;
    // Slash 2: slantX between 140 and 164, y between 60 and 196
    const inSlash2 = slantX >= 140 && slantX <= 164 && y >= 60 && y <= 196;
    
    if (inSlash1 || inSlash2) {
      return [255, 255, 255, 255]; // White slashes
    }
    
    return [17, 17, 17, 255]; // Dark background
  }
  
  return [0, 0, 0, 0]; // Transparent outside circle
});

fs.writeFileSync(path.join(publicDir, 'logo.png'), iconPng);
fs.writeFileSync(path.join(publicDir, 'build26-logo.png'), iconPng);

console.log('Successfully created public/logo.svg, public/logo-mark.svg, and public/logo.png');
