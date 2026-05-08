import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const SOURCE = path.resolve('public/ChatGPT Image 6 de mar. de 2026, 18_03_49.png');
const OUT_DIR = path.resolve('public/tester2d/mannequins');

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function crcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  return table;
}
const CRC_TABLE = crcTable();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function readPng(filePath) {
  const buffer = fs.readFileSync(filePath);
  const pngSig = Buffer.from([137,80,78,71,13,10,26,10]);
  if (!buffer.subarray(0, 8).equals(pngSig)) throw new Error('Not a PNG file.');

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset); offset += 4;
    const type = buffer.toString('ascii', offset, offset + 4); offset += 4;
    const data = buffer.subarray(offset, offset + length); offset += length;
    offset += 4;
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') break;
  }

  if (bitDepth !== 8 || ![2, 6].includes(colorType)) throw new Error(`Unsupported PNG format ${bitDepth}/${colorType}`);

  const srcBpp = colorType === 6 ? 4 : 3;
  const stride = width * srcBpp;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const decoded = Buffer.alloc(width * height * srcBpp);

  let inOffset = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[inOffset++];
    for (let x = 0; x < stride; x += 1) {
      const i = y * stride + x;
      const left = x >= srcBpp ? decoded[i - srcBpp] : 0;
      const up = y ? decoded[i - stride] : 0;
      const upLeft = y && x >= srcBpp ? decoded[i - stride - srcBpp] : 0;
      const v = raw[inOffset++];
      if (filter === 0) decoded[i] = v;
      else if (filter === 1) decoded[i] = (v + left) & 0xff;
      else if (filter === 2) decoded[i] = (v + up) & 0xff;
      else if (filter === 3) decoded[i] = (v + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) decoded[i] = (v + paeth(left, up, upLeft)) & 0xff;
      else throw new Error(`Unknown filter ${filter}`);
    }
  }

  const pixels = Buffer.alloc(width * height * 4);
  for (let i = 0, j = 0; i < decoded.length; i += srcBpp, j += 4) {
    pixels[j] = decoded[i];
    pixels[j + 1] = decoded[i + 1];
    pixels[j + 2] = decoded[i + 2];
    pixels[j + 3] = srcBpp === 4 ? decoded[i + 3] : 255;
  }

  return { width, height, pixels };
}

function writeChunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}

function writePng(filePath, width, height, pixels) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6;

  const out = Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    writeChunk('IHDR', ihdr),
    writeChunk('IDAT', zlib.deflateSync(raw)),
    writeChunk('IEND', Buffer.alloc(0)),
  ]);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, out);
}

function extractRegion(source, x0, x1) {
  const width = x1 - x0;
  const height = source.height;
  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    source.pixels.copy(pixels, y * width * 4, (y * source.width + x0) * 4, (y * source.width + x1) * 4);
  }
  return { width, height, pixels };
}

function removeNeutralBackground(img) {
  const samples = [[0, 0], [img.width - 1, 0], [0, img.height - 1], [img.width - 1, img.height - 1]];
  let r = 0;
  let g = 0;
  let b = 0;
  for (const [x, y] of samples) {
    const i = (y * img.width + x) * 4;
    r += img.pixels[i];
    g += img.pixels[i + 1];
    b += img.pixels[i + 2];
  }
  r /= samples.length;
  g /= samples.length;
  b /= samples.length;

  const nearBg = new Uint8Array(img.width * img.height);
  for (let y = 0; y < img.height; y += 1) {
    for (let x = 0; x < img.width; x += 1) {
      const i = (y * img.width + x) * 4;
      const dist = Math.hypot(img.pixels[i] - r, img.pixels[i + 1] - g, img.pixels[i + 2] - b);
      const bright = img.pixels[i] > 225 && img.pixels[i + 1] > 225 && img.pixels[i + 2] > 225;
      nearBg[y * img.width + x] = dist < 36 || bright ? 1 : 0;
    }
  }

  // Flood fill from borders only, preserving bright details inside mannequin.
  const visited = new Uint8Array(img.width * img.height);
  const queue = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= img.width || y >= img.height) return;
    const idx = y * img.width + x;
    if (visited[idx] || !nearBg[idx]) return;
    visited[idx] = 1;
    queue.push([x, y]);
  };

  for (let x = 0; x < img.width; x += 1) {
    push(x, 0);
    push(x, img.height - 1);
  }
  for (let y = 0; y < img.height; y += 1) {
    push(0, y);
    push(img.width - 1, y);
  }

  while (queue.length) {
    const [x, y] = queue.pop();
    const idx = y * img.width + x;
    img.pixels[idx * 4 + 3] = 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }
}

function bboxAlpha(img) {
  let minX = img.width, minY = img.height, maxX = 0, maxY = 0;
  for (let y = 0; y < img.height; y += 1) {
    for (let x = 0; x < img.width; x += 1) {
      if (img.pixels[(y * img.width + x) * 4 + 3] > 12) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY };
}

function cropToBox(img, box) {
  const width = box.maxX - box.minX + 1;
  const height = box.maxY - box.minY + 1;
  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    img.pixels.copy(pixels, y * width * 4, ((box.minY + y) * img.width + box.minX) * 4, ((box.minY + y) * img.width + box.minX + width) * 4);
  }
  return { width, height, pixels };
}

function padBox(box, img, padding) {
  return {
    minX: Math.max(0, box.minX - padding),
    minY: Math.max(0, box.minY - padding),
    maxX: Math.min(img.width - 1, box.maxX + padding),
    maxY: Math.min(img.height - 1, box.maxY + padding),
  };
}

function normalizeCanvas(img, outW = 1200, outH = 2000, topMarginRatio = 0.08) {
  const pixels = Buffer.alloc(outW * outH * 4, 0);
  const scale = Math.min((outW * 0.68) / img.width, (outH * 0.86) / img.height);
  const scaledW = Math.round(img.width * scale);
  const scaledH = Math.round(img.height * scale);
  const offsetX = Math.floor((outW - scaledW) / 2);
  const offsetY = Math.max(Math.floor(outH * topMarginRatio), Math.floor((outH - scaledH) / 2));

  for (let y = 0; y < scaledH; y += 1) {
    for (let x = 0; x < scaledW; x += 1) {
      const sx = Math.min(img.width - 1, Math.floor(x / scale));
      const sy = Math.min(img.height - 1, Math.floor(y / scale));
      const si = (sy * img.width + sx) * 4;
      const di = ((offsetY + y) * outW + (offsetX + x)) * 4;
      pixels[di] = img.pixels[si];
      pixels[di + 1] = img.pixels[si + 1];
      pixels[di + 2] = img.pixels[si + 2];
      pixels[di + 3] = img.pixels[si + 3];
    }
  }

  return { width: outW, height: outH, pixels };
}

const source = readPng(SOURCE);
const half = Math.floor(source.width / 2);

const male = extractRegion(source, 0, half);
const female = extractRegion(source, half, source.width);

removeNeutralBackground(male);
removeNeutralBackground(female);

const maleBox = padBox(bboxAlpha(male), male, 64);
const femaleBox = padBox(bboxAlpha(female), female, 64);
const maleNorm = normalizeCanvas(cropToBox(male, maleBox));
const femaleNorm = normalizeCanvas(cropToBox(female, femaleBox));

writePng(path.join(OUT_DIR, 'male-default.png'), maleNorm.width, maleNorm.height, maleNorm.pixels);
writePng(path.join(OUT_DIR, 'female-default.png'), femaleNorm.width, femaleNorm.height, femaleNorm.pixels);

console.log('Generated:', path.join(OUT_DIR, 'male-default.png'));
console.log('Generated:', path.join(OUT_DIR, 'female-default.png'));
