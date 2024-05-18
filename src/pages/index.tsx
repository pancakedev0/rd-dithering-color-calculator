import * as React from 'react';
import ColorCalculator from '../components/ColorCalculator';
import { State } from '../lib/ReactHelpers';
import { useState } from 'react';
import { rgbToHex } from '../lib/ColorHelpers';
import LospecLoader from '../components/LospecLoader';
import { Palette } from '../lib/WebHelpers';
import { randomInt } from '../lib/MathHelpers';

// Some palettes disabled due to failing WCAG AAA standard
const preloadedPalettes: Palette[] = [
  {
    name: '1bit Monitor Glow',
    author: 'Polyducks',
    url: 'https://lospec.com/palette-list/1bit-monitor-glow',
    light: { r: 240, g: 246, b: 240 },
    dark: { r: 34, g: 35, b: 35 },
  },
  {
    name: 'Paperback-2',
    author: 'Doph',
    url: 'https://lospec.com/palette-list/paperback-2',
    light: { r: 184, g: 194, b: 185 },
    dark: { r: 56, g: 43, b: 38 },
  },
  {
    name: 'Pixel Ink',
    author: 'Polyducks',
    url: 'https://lospec.com/palette-list/pixel-ink',
    light: { r: 237, g: 246, b: 214 },
    dark: { r: 62, g: 35, b: 44 },
  },
  /* {
    name: 'Bitbee',
    author: 'Poltergasm',
    url: 'https://lospec.com/palette-list/bitbee',
    light: { r: 207, g: 171, b: 74 },
    dark: { r: 41, g: 43, b: 48 },
  }, */
  {
    name: 'Noire Truth',
    author: 'Cheeseismysoul',
    url: 'https://lospec.com/palette-list/noire-truth',
    light: { r: 198, g: 186, b: 172 },
    dark: { r: 30, g: 28, b: 50 },
  },
  {
    name: 'Obra Dinn - IBM 8503',
    author: '',
    url: 'https://lospec.com/palette-list/obra-dinn-ibm-8503',
    light: { r: 235, g: 229, b: 206 },
    dark: { r: 46, g: 48, b: 55 },
  },
  {
    name: 'Mac Paint',
    author: 'Polyducks',
    url: 'https://lospec.com/palette-list/mac-paint',
    light: { r: 139, g: 200, b: 254 },
    dark: { r: 5, g: 27, b: 44 },
  },
  /*   {
    name: 'Pastelito2',
    author: 'Anubi',
    url: 'https://lospec.com/palette-list/pastelito2',
    light: { r: 215, g: 222, b: 220 },
    dark: { r: 75, g: 71, b: 92 },
  }, */
  /*   {
    name: 'knockia3310',
    author: 'Imogia Games',
    url: 'https://lospec.com/palette-list/knockia3310',
    light: { r: 114, g: 164, b: 136 },
    dark: { r: 33, g: 44, b: 40 },
  }, */
  {
    name: "Y's Neutral Green",
    author: 'Yelta',
    url: 'https://lospec.com/palette-list/ys-neutral-green',
    light: { r: 255, g: 234, b: 249 },
    dark: { r: 0, g: 76, b: 61 },
  },
  /*   {
    name: "Y's Flowers and Asbestos",
    author: 'Yelta',
    url: 'https://lospec.com/palette-list/ys-flowers-and-asbestos',
    light: { r: 237, g: 244, b: 255 },
    dark: { r: 198, g: 43, b: 105 },
  }, */
  {
    name: 'Paper palette',
    author: 'Sumedh Natu',
    url: 'https://lospec.com/palette-list/paper-palette',
    light: { r: 246, g: 231, b: 193 },
    dark: { r: 62, g: 62, b: 62 },
  },
  {
    name: 'Obra Dinn - Macintosh',
    author: '',
    url: 'https://lospec.com/palette-list/obra-dinn-macintosh',
    light: { r: 229, g: 255, b: 255 },
    dark: { r: 51, g: 51, b: 25 },
  },
];

export default function Home() {
  const [palette, setPalette]: State<Palette> = useState(
    preloadedPalettes[randomInt(0, preloadedPalettes.length)]
  );

  const light = rgbToHex(palette.light);
  const dark = rgbToHex(palette.dark);

  return (
    <React.StrictMode>
      <div className="transition-all">
        <div
          className="flex h-screen flex-col items-center justify-center font-mono transition-all"
          style={{ backgroundColor: dark, color: light }}
        >
          <div className="z-10">
            <LospecLoader
              inputDark={palette.dark}
              inputLight={palette.light}
              onLoadPalette={setPalette}
            />
            <ColorCalculator palette={palette} onChangePalette={setPalette} />
          </div>
        </div>
        <div
          className="fixed bottom-12 right-12 font-script text-2xl text-[var(--lightCol)]"
          STYLE={`--lightCol:${light}`} // ignore ts. style is all uppercase so react passes through the style string unchanged
        >
          <a className="text-4xl underline" href={palette.url}>
            {palette.name}
          </a>
          <div className="pl-12">
            {palette.author ? 'by' : ''} {palette.author}
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
}
