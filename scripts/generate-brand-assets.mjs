import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const brand = join(root, "brand_assets");
const appDir = join(root, "app");
const publicDir = join(root, "public");

/** Remove near-white background and optionally recolor foreground pixels. */
async function processLogo(input, output, { recolorToWhite = false, height = null } = {}) {
  let img = sharp(input).ensureAlpha();
  const meta = await img.metadata();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += info.channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const isBackground = r > 240 && g > 240 && b > 240;

    if (isBackground) {
      out[i + 3] = 0;
      continue;
    }

    if (recolorToWhite) {
      const alpha = out[i + 3];
      if (alpha > 20) {
        out[i] = 255;
        out[i + 1] = 255;
        out[i + 2] = 255;
      }
    }
  }

  let pipeline = sharp(out, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  }).png();

  if (height) {
    pipeline = pipeline.resize({ height, withoutEnlargement: false });
  }

  await pipeline.toFile(output);
  return meta;
}

async function cropIcon(input, output, widthRatio = 0.38) {
  const meta = await sharp(input).metadata();
  const cropW = Math.round(meta.width * widthRatio);
  const cropH = meta.height;
  await sharp(input)
    .extract({ left: 0, top: 0, width: cropW, height: cropH })
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(output);
}

async function makeFavicon(source, outputs) {
  for (const { path, size } of outputs) {
    const radius = Math.round(size * 0.22);
    const mask = Buffer.from(
      `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/></svg>`
    );

    await sharp(source)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .composite([{ input: mask, blend: "dest-in" }])
      .png()
      .toFile(path);
  }

  const faviconMask = Buffer.from(
    `<svg width="32" height="32"><rect x="0" y="0" width="32" height="32" rx="7" ry="7" fill="white"/></svg>`
  );

  await sharp(source)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .composite([{ input: faviconMask, blend: "dest-in" }])
    .toFile(join(publicDir, "favicon.ico"));
}

async function main() {
  mkdirSync(publicDir, { recursive: true });
  mkdirSync(appDir, { recursive: true });

  const hackathonLight = join(brand, "ai-hackathon-healthtech-light.png");
  const uaLight = join(brand, "ua-little-rock-light.png");
  const broLogo = join(brand, "Bro2Bro logo.png");

  // Transparent-bg light logos for marquee
  await processLogo(hackathonLight, join(brand, "ai-hackathon-healthtech-light-transparent.png"), { height: 40 });
  await processLogo(uaLight, join(brand, "ua-little-rock-light-transparent.png"), { height: 44 });

  // White logos for dark backgrounds
  await processLogo(hackathonLight, join(brand, "ai-hackathon-healthtech-dark.png"), { recolorToWhite: true, height: 40 });
  await processLogo(uaLight, join(brand, "ua-little-rock-dark.png"), { recolorToWhite: true, height: 44 });
  await processLogo(broLogo, join(brand, "bro2bro-logo-dark.png"), { recolorToWhite: true, height: 40 });

  // Hackathon icon mark (left emblem only)
  const iconSource = join(brand, "ai-hackathon-icon.png");
  await cropIcon(hackathonLight, iconSource);
  await processLogo(iconSource, join(brand, "ai-hackathon-icon-dark.png"), { recolorToWhite: true });

  // Favicons — BRO2BRO original logo
  await makeFavicon(broLogo, [
    { path: join(appDir, "icon.png"), size: 512 },
    { path: join(appDir, "apple-icon.png"), size: 180 },
    { path: join(publicDir, "icon-192.png"), size: 192 },
    { path: join(publicDir, "icon-512.png"), size: 512 },
  ]);

  console.log("Brand assets generated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
